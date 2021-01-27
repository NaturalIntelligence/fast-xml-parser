'use strict';

const util = require('./util');

const convertToJson = function(node, options) {
  const jObj = {};

  // when no child node or attr is present
  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  }

  // otherwise create a textnode if node has some text
  if (util.isExist(node.val)) {
    if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
      const asArray = util.isTagnameInArrayMode(node.tagname, options.arrayMode)
      jObj[options.textNodeName] = asArray ? [node.val] : node.val;
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    const tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj[tagname] = [];
      for (let tag in node.child[tagname]) {
        if (node.child[tagname].hasOwnProperty(tag)) {
          jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
        }
      }
    } else {
      const result = convertToJson(node.child[tagname][0], options);
      const asArray = (options.arrayMode === true && typeof result === 'object') || util.isTagnameInArrayMode(tagname, options.arrayMode);
      jObj[tagname] = asArray ? [result] : result;
    }
  }

  //add value
  return jObj;
};

exports.convertToJson = convertToJson;
