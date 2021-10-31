'use strict';

const util = require('./util');

const convertToJson = function(node, options, parentTagName, jpath) {
  
  const jObj = {};
  
  // when no child node or attr is present
  if (!options.alwaysCreateTextNode && (!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  }

  // otherwise create a textnode if node has some text
  if (util.isExist(node.val) && !(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
    const tagName = options.textNodeName;
    const newJpath = jpath + "." + tagName;
    jObj[tagName] = options.isArray(tagName, newJpath, true) ? [node.val] : node.val;
  }

  copyAttributesifPresent(jObj, node.attrsMap, jpath, options);

  const keys = Object.keys(node.child);
  for (let index = 0; index < keys.length; index++) {
    const tagName = keys[index];
    let newJpath = "";
    if(jpath === undefined) newJpath = tagName;
    else newJpath = jpath + "." + tagName;

    if (node.child[tagName] && node.child[tagName].length > 1) {
      jObj[tagName] = [];
      for (let tag in node.child[tagName]) {
        if (node.child[tagName].hasOwnProperty(tag)) {
          jObj[tagName].push( 
            convertToJson(node.child[tagName][tag], options, tagName, newJpath) 
          );
        }
      }
    } else {
      
      const result = convertToJson(node.child[tagName][0], options, tagName, newJpath);
      jObj[tagName] = options.isArray(tagName, newJpath, isLeafNode(node.child, tagName)) ? [result] : result;
    }
  }

  //add value
  return jObj;
};
function copyAttributesifPresent(tagObj, attrMap, jpath, options){
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      const atrrName = keys[i];
      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
        tagObj[atrrName] = [ attrMap[atrrName] ];
      } else {
        tagObj[atrrName] = attrMap[atrrName];
      }
    }
  }
}

function isLeafNode(node, tagName){
  const childNode = node[tagName][0].child;
  if( childNode && Object.keys(childNode).length > 0) return false;
  return true;
}
exports.convertToJson = convertToJson;
