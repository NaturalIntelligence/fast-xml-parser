'use strict';

let START_INDEX;

if (typeof Symbol !== "function") {
  START_INDEX = "@@startIndex";
} else {
  START_INDEX = Symbol("Start Index of XML Node");
}

export default class XmlNode{
  constructor(tagname) {
    this.tagname = tagname;
    this.child = []; //nested tags, text, cdata, comments in order
    this[":@"] = {}; //attributes map
  }
  add(key,val){
    // this.child.push( {name : key, val: val, isCdata: isCdata });
    if(key === "__proto__") key = "#__proto__";
    this.child.push( {[key]: val });
  }
  addChild(node, startIndex) {
    if(node.tagname === "__proto__") node.tagname = "#__proto__";
    if(node[":@"] && Object.keys(node[":@"]).length > 0){
      this.child.push( { [node.tagname]: node.child, [":@"]: node[":@"] });
    }else{
      this.child.push( { [node.tagname]: node.child });
    }
    // if requested, add the startIndex
    if (startIndex !== undefined) {
      this.child[this.child.length - 1][START_INDEX] = startIndex;
    }
  }
  /** symbol used for startIndex */
  static getStartIndexSymbol() {
    return START_INDEX;
  }
}
