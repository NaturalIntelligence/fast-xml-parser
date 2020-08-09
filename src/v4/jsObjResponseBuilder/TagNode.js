/**
 * @module TagNode
 */
class TagNode{
    constructor(tagName, nsArr, originalName){
        //this.options = options;
        this.name = tagName;
        this.ns = nsArr;
        this.val = [];
        this.originalName = originalName;
        //this.withoutNS = tagNameWithoutNS;
        
        //Pointer to result node in memory
        this.ref = null;

        //this.attributes: attrsMap,
        //this.cdata: cdata,

    }

    isEmpty(){
        return Object.keys(this.ref).length === 0 && this.val.length == 0;
    }
}

module.exports = TagNode