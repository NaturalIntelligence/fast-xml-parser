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

//a non-leaf tag would be an array
function prettify(node, options){
  return compress( [node], options);
}

/**
 * 
 * @param {array} arr 
 * @param {object} options 
 * @param {string} jPath 
 * @returns object
 */
function compress(arr, options, jPath){
  let text = "";
  const compressedObj = {};
  for (let i = 0; i < arr.length; i++) {
    const tagObj = arr[i];
    const property = propName(tagObj);
    let newJpath = "";
    if(jPath === undefined) newJpath = property;
    else newJpath = jPath + "." + property;

    if(property === options.textNodeName){
      text += tagObj[property];
    }else if(property === undefined){
      continue;
    }else if(tagObj[property]){
      
      let val = compress(tagObj[property], options, newJpath);
      const isLeaf = isLeafTag(val, options);

      if(tagObj.attributes){
        assignAttributes( val, tagObj.attributes, newJpath, options);
      }else if(Object.keys(val).length === 1 && val[options.textNodeName] && !options.alwaysCreateTextNode){
        val = val[options.textNodeName];
      }else if(Object.keys(val).length === 0){
        if(options.alwaysCreateTextNode) val[options.textNodeName] = "";
        else val = "";
      }

      if(compressedObj[property] !== undefined) {
        if(!Array.isArray(compressedObj[property])) {
          compressedObj[property] = [ compressedObj[property] ];
        }
        compressedObj[property].push(val);
      }else{
        //TODO: if a node is not an array, then check if it should be an array
        //also determine if it is a leaf node
        if (options.isArray(property, newJpath, isLeaf )) {
          compressedObj[property] = [val];
        }else{
          compressedObj[property] = val;
        }
      }
    }
    
  }
  if(text.length > 0) compressedObj[options.textNodeName] = text;
  return compressedObj;
}

function propName(obj){
  const keys = Object.keys(obj);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if(key !== "attributes") return key;
  }
}

function assignAttributes(obj, attrMap, jpath, options){
  if (attrMap) {
    const keys = Object.keys(attrMap);
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      const atrrName = keys[i];
      if (options.isArray(atrrName, jpath + "." + atrrName, true, true)) {
        obj[atrrName] = [ attrMap[atrrName] ];
      } else {
        obj[atrrName] = attrMap[atrrName];
      }
    }
  }
}

function isLeafTag(obj, options){
  const propCount = Object.keys(obj).length;
  if( propCount === 0 || (propCount === 1 && obj[options.textNodeName]) ) return true;
  return false;
}
exports.convertToJson = prettify;
