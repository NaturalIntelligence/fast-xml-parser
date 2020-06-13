'use strict';

class XmlNode {
  constructor(tagname, parent, val) {
    this.tagname = tagname;
    this.parent = parent;
    this.val = val; //text only
    this.child = null; //child tags
    this.attrsMap = null; //attributes map
    this.startIndex = 0;
  }

  addChild(child) {
    if (this.child === null) {
      this.child = {};
    }
    if (this.child[child.tagname] !== undefined) {
      //already presents
      this.child[child.tagname].push(child);
    } else {
      this.child[child.tagname] = [child];
    }
  }

  eraseChildNodes() {
    this.child = null;
  }

  appendVal(value) {
    this.val = (this.val === undefined ? '' : this.val + '') + value;
  }
}

module.exports = XmlNode;
