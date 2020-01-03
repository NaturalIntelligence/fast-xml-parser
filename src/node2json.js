'use strict';

const util = require('./util');

const convertToJson = function (node, options) {
  const jObj = {};

  //when no child node or attr is present
  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        if (options.arrayMode === "strict") {
          jObj[options.textNodeName] = [node.val];
        } else {
          jObj[options.textNodeName] = node.val;
        }
      }
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);

  const keys = Object.keys(node.child);

  if (keys.length > 1 && (options.preserveOrder === true ||
    (options.preserveOrder === "text" && keys.includes(options.textNodeName)))) {
    const jArray = new Array(node.children)

    for (let key of keys) {
      for (var child of node.child[key]) {
        jArray[child.indexInParent] = { [key]: convertToJson(child, options) };
      }
    }

    const result = { "#ordered": jArray }
    util.merge(result, node.attrsMap, options.arrayMode)
    return result
  }

  for (let index = 0; index < keys.length; index++) {
    var tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj[tagname] = [];
      for (var tag in node.child[tagname]) {
        jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
      }
    } else {
      if (options.arrayMode === true) {
        const result = convertToJson(node.child[tagname][0], options)
        if (typeof result === 'object')
          jObj[tagname] = [result];
        else
          jObj[tagname] = result;
      } else if (options.arrayMode === "strict") {
        jObj[tagname] = [convertToJson(node.child[tagname][0], options)];
      } else {
        jObj[tagname] = convertToJson(node.child[tagname][0], options);
      }
    }
  }

  //add value
  return jObj;
};

exports.convertToJson = convertToJson;
