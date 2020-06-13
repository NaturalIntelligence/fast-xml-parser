'use strict';

const util = require('./util');

const convertToJson = function(node, options) {
  //when no child node or attr is present
  if (!node.child && !node.attrsMap) {
    return util.isExist(node.val) ? node.val : '';
  }

  const jObj = {};
  if (util.isExist(node.val)) {
    if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
      if (options.arrayMode === "strict") {
        jObj[options.textNodeName] = [node.val];
      } else {
        jObj[options.textNodeName] = node.val;
      }
    }
  }

  util.merge(jObj, node.attrsMap, options.arrayMode);

  if (node.child) {
    const keys = Object.keys(node.child);
    for (let i = 0; i < keys.length; i++) {
      const tagname = keys[i];
      const value = node.child[tagname];

      if (value.length > 1) {
        const array = [];
        for (let i = 0; i < value.length; i++) {
          array.push(convertToJson(value[i], options));
        }
        jObj[tagname] = array;
      } else {
        const result = convertToJson(value[0], options);

        if (options.arrayMode === true) {
          if (typeof result === 'object') {
            jObj[tagname] = [result];
          } else {
            jObj[tagname] = result;
          }
        } else if (options.arrayMode === "strict") {
          jObj[tagname] = [result];
        } else {
          jObj[tagname] = result;
        }
      }
    }
  }

  //add value
  return jObj;
};

exports.convertToJson = convertToJson;
