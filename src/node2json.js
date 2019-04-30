'use strict';

const util = require('./util');

const copyObj = function (source, options) {
  let target = {}
    target.nodeName = source.tagname
  let p = source.tagname.split(":")
  if (p.length > 1) {
    target.nodeName = p[1];
    target.namespace = p[0];
  }
  if ((options.attrNodeName != false) && (source.attrsMap != null) && ("attr" in source.attrsMap)) {
    let attrKeys = Object.keys(source.attrsMap.attr)
    if (attrKeys.length > 0) {
      target.attr = {}
      attrKeys.forEach(key => {
        target.attr[key] = source.attrsMap.attr[key]
      })
    }
  }
  if (source.val != "") {
    target.val = source.val
  }
  if  (source.child.length > 0) {
    target.children = []
  }
  source.child.forEach(c => {
    target.children.push(copyObj(c, options))
  })
  return target
}
const convertToJson = function(node, options) {
  var jObj = {};
  if (options.resembleXml) {
    jObj = copyObj(node.child[0], options)
    return jObj
  }
  //when no child node or attr is present
  if ((!node.child || util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
    return util.isExist(node.val) ? node.val : '';
  } else {
    //otherwise create a textnode if node has some text
    if (util.isExist(node.val)) {
      if (!(typeof node.val === 'string' && (node.val === '' || node.val === options.cdataPositionChar))) {
        jObj[options.textNodeName] = node.val;
      }
    }
  }

  util.merge(jObj, node.attrsMap);

  const keys = Object.keys(node.child);
  if ("nodeNameAsType" in options) {
    if (keys.length > 0) {
      jObj[options.nodeNameAsType[1]] = []
    }
  }

  for (let index = 0; index < keys.length; index++) {
    var tagname = keys[index];
    if (node.child[tagname] && node.child[tagname].length > 1) {
      //if ()
      jObj[tagname] = [];
      for (var tag in node.child[tagname]) {
        jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
      }
    } else {
      jObj[tagname] = convertToJson(node.child[tagname][0], options);
    }
  }

  //add value
  return jObj;
};

exports.convertToJson = convertToJson;
