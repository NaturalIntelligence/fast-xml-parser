'use strict';

const util = require('./util');
const buildOptions = require('./util').buildOptions;
const XmlNode = require('./xmlNode');

//polyfill
if (!Number.parseInt && window.parseInt) {
  Number.parseInt = window.parseInt;
}
if (!Number.parseFloat && window.parseFloat) {
  Number.parseFloat = window.parseFloat;
}

const defaultOptions = {
  attributeNamePrefix: '@_',
  attrNodeName: false,
  textNodeName: '#text',
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false, //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true, //Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: '\\c',
  tagValueProcessor: function(a, tagName) {
    return a;
  },
  attrValueProcessor: function(a, attrName) {
    return a;
  },
  stopNodes: []
  //decodeStrict: false,
};

exports.defaultOptions = defaultOptions;

const props = [
  'attributeNamePrefix',
  'attrNodeName',
  'textNodeName',
  'ignoreAttributes',
  'ignoreNameSpace',
  'allowBooleanAttributes',
  'parseNodeValue',
  'parseAttributeValue',
  'arrayMode',
  'trimValues',
  'cdataTagName',
  'cdataPositionChar',
  'tagValueProcessor',
  'attrValueProcessor',
  'parseTrueNumberOnly',
  'stopNodes'
];
exports.props = props;

/**
 * Trim -> valueProcessor -> parse value
 * @param {string} tagName
 * @param {string} val
 * @param {object} options
 */
function processTagValue(tagName, val, options) {
  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }
    val = options.tagValueProcessor(val, tagName);
    val = parseValue(val, options.parseNodeValue, options.parseTrueNumberOnly);
  }

  return val;
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    const tags = tagname.split(':');
    const prefix = tagname.charAt(0) === '/' ? '/' : '';
    if (tags[0] === 'xmlns') {
      return '';
    }
    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }
  return tagname;
}

function parseValue(val, shouldParse, parseTrueNumberOnly) {
  if (shouldParse && typeof val === 'string') {
    let trimValue = val.trim();
    if (trimValue === '') {
      return val;
    }
    if (trimValue === 'true') {
      return true;
    }
    if (trimValue === 'false') {
      return false;
    }
    if (isNaN(trimValue)) {
      return val;
    }
    let parsed;
    if (val.indexOf('0x') !== -1) {
      //support hexa decimal
      parsed = Number.parseInt(val, 16);
    } else if (val.indexOf('.') !== -1) {
      parsed = Number.parseFloat(val);
      val = val.replace(/\.?0+$/, "");
    } else {
      parsed = Number.parseInt(val, 10);
    }
    if (parseTrueNumberOnly) {
      parsed = String(parsed) === val ? parsed : val;
    }
    return parsed;
  }

  return util.isExist(val) ? val : '';
}

//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp('([^\\s=]+)\\s*(=\\s*([\'"])(.*?)\\3)?', 'g');

function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === 'string') {
    attrStr = attrStr.replace(/\r?\n/g, ' ');
    //attrStr = attrStr || attrStr.trim();

    const matches = util.getAllMatches(attrStr, attrsRegx);
    const len = matches.length; //don't make it inline
    const attrs = {};
    for (let i = 0; i < len; i++) {
      const match = matches[i];
      const attrName = resolveNameSpace(match[1], options);
      if (attrName.length) {
        let value = match[4];
        if (value !== undefined) {
          if (options.trimValues) {
            value = value.trim();
          }
          value = options.attrValueProcessor(value, attrName);
          attrs[options.attributeNamePrefix + attrName] = parseValue(
            value,
            options.parseAttributeValue,
            options.parseTrueNumberOnly
          );
        } else if (options.allowBooleanAttributes) {
          attrs[options.attributeNamePrefix + attrName] = true;
        }
      }
    }
    if (!Object.keys(attrs).length) {
      return;
    }
    if (options.attrNodeName) {
      const attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }
    return attrs;
  }
}

const getTraversalObj = function(xmlData, options) {
  options = buildOptions(options, defaultOptions, props);
  const xmlObj = new XmlNode('!xml');
  let currentNode = xmlObj;
  let textData = "";
  let textFrom = 0;

  for (let i = 0; i < xmlData.length; i++) {
    const ch = xmlData[i];
    if (ch === '<') {
      textData += xmlData.substring(textFrom, i);

      if (xmlData[i + 1] === '/') {//Closing Tag
        i = closeTag(xmlData, currentNode, textData, i, options);
        currentNode = currentNode.parent;
        textData = '';
      } else if (xmlData[i + 1] === '?') {
        i = findClosingIndex(xmlData, "?>", i, "Pi Tag is not closed.")
      } else if (xmlData.substr(i + 1, 3) === '!--') {
        i = findClosingIndex(xmlData, "-->", i, "Comment is not closed.")
      } else if (xmlData.substr(i + 1, 2) === '!D') {
        const closeIndex = findClosingIndex(xmlData, ">", i, "DOCTYPE is not closed.");
        const tagExp = xmlData.substring(i, closeIndex);
        if (tagExp.indexOf("[") >= 0) {
          i = xmlData.indexOf("]>", i) + 1;
        } else {
          i = closeIndex;
        }
      } else if (xmlData.substr(i + 1, 2) === '![') {
        const closeIndex = findClosingIndex(xmlData, "]]>", i, "CDATA is not closed.") - 2;
        const tagExp = xmlData.substring(i + 9, closeIndex);

        //considerations
        //1. CDATA will always have parent node
        //2. A tag with CDATA is not a leaf node so it's value would be string type.
        if (textData) {
          currentNode.appendVal(processTagValue(currentNode.tagname, textData, options));
          textData = "";
        }

        if (options.cdataTagName) {
          //add cdata node
          const childNode = new XmlNode(options.cdataTagName, currentNode, tagExp);
          currentNode.addChild(childNode);
          //for backtracking
          currentNode.appendVal(options.cdataPositionChar);
          //add rest value to parent node
          if (tagExp) {
            childNode.val = tagExp;
          }
        } else {
          currentNode.val = (currentNode.val || '') + (tagExp || '');
        }

        i = closeIndex + 2;
      } else {//Opening tag
        const result = openTag(xmlData, currentNode, textData, i, options);
        i = result.closeIndex;
        currentNode = result.currentNode;
        textData = "";
      }
      textFrom = i + 1;
    }
  }
  return xmlObj;
};

function openTag(xmlData, currentNode, textData, pos, options) {
  let {selfClosing, tagName, tagExp, closeIndex} = closingIndexForOpeningTag(xmlData, pos + 1, options.ignoreNameSpace);

  if (textData && currentNode.tagname !== '!xml') {
    currentNode.appendVal(processTagValue(currentNode.tagname, textData, options));
  }

  if (selfClosing) {
    const childNode = new XmlNode(tagName, currentNode, '');
    if (tagExp) {
      childNode.attrsMap = buildAttributesMap(tagExp, options);
    }
    currentNode.addChild(childNode);
  } else {
    const childNode = new XmlNode(tagName, currentNode);
    if (tagExp) {
      childNode.attrsMap = buildAttributesMap(tagExp, options);
    }
    currentNode.addChild(childNode);
    if (options.stopNodes.length && options.stopNodes.includes(childNode.tagname)) {
      childNode.startIndex = closeIndex;
    }
    currentNode = childNode;
  }
  return {closeIndex, currentNode};
}

function closeTag(xmlData, currentNode, textData, pos, options) {
  const closeIndex = findClosingIndex(xmlData, ">", pos, "Closing Tag is not closed.");

  if (options.stopNodes.length && options.stopNodes.includes(currentNode.tagname)) {
    currentNode.eraseChildNodes();

    currentNode.val = xmlData.substr(currentNode.startIndex + 1, pos - currentNode.startIndex - 1);
  } else if (currentNode.val !== undefined) {
    currentNode.appendVal(processTagValue(currentNode.tagname, textData, options));
  } else {
    currentNode.val = processTagValue(currentNode.tagname, textData, options);
  }
  return closeIndex;
}

function closingIndexForOpeningTag(xmlData, from, ignoreNameSpace) {
  let tagName;
  let index;
  for (index = from; index < xmlData.length; index++) {
    let ch = xmlData[index];
    if (ch === '>') {
      const selfClosing = xmlData[index - 1] === '/';
      tagName = xmlData.substring(from, selfClosing ? index - 1 : index);
      return {
        selfClosing,
        tagName,
        tagExp: null,
        closeIndex: index,
      }
    } else if (ignoreNameSpace && ch === ':') {
      from = index + 1;
    } else if (ch === ' ' || ch === '\n' || ch === '\r' || ch === '\t') {
      tagName = xmlData.substring(from, index);
      index++;
      break;
    }
  }

  if (index === xmlData.length) {
    throw new Error('Tag is not closed.')
  }

  let attrBoundary = null;
  for (let i = index; i < xmlData.length; i++) {
    let ch = xmlData[i];
    if (attrBoundary !== null) {
      if (ch === attrBoundary) {
        attrBoundary = null;
      }
    } else if (ch === '"' || ch === "'") {
      attrBoundary = ch;
    } else if (ch === '>') {
      const selfClosing = xmlData[i - 1] === '/';
      const tagExp = xmlData.substring(index, selfClosing ? i - 1 : i);
      return {
        selfClosing,
        tagName,
        tagExp,
        closeIndex: i
      }
    }
  }

  throw new Error('Tag is not closed.')
}

function findClosingIndex(xmlData, str, pos, errMsg) {
  const closingIndex = xmlData.indexOf(str, pos);
  if (closingIndex === -1) {
    throw new Error(errMsg)
  }
  return closingIndex + str.length - 1;
}

exports.getTraversalObj = getTraversalObj;
