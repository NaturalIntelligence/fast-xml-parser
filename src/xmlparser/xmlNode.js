'use strict';

class XmlNode{
  constructor(tagname) {
    this.tagname = tagname;
    this.child = []; //nested tags, text, cdata, comments in order
    this.attrsMap = {}; //attributes map
  }
  add(key,val){
    // this.child.push( {name : key, val: val, isCdata: isCdata });
    this.child.push( {[key]: val });
  }
  addChild(node) {
    if(node.attrsMap && Object.keys(node.attrsMap).length > 0){
      this.child.push( { [node.tagname]: node.child, attributes: node.attrsMap });
    }else{
      this.child.push( { [node.tagname]: node.child });
    }
  };
};


module.exports = XmlNode;