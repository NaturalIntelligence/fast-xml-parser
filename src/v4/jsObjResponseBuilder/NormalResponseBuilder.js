const ResponseBuilder = require("./ResponseBuilder")

/**
 * When `preserveOrder` and `arrayMode` are false.
 * @module NormalResponseBuilder
 */
class NormalResponseBuilder extends ResponseBuilder {
    constructor(options){
        super(options)
        this.tagStack[0].ref = this.outputNodeType();
    }

    outputNodeType(){
        return {}
    };
    /**
     * 
     * @param {TagNode} tagNode 
     */
    sizeOfOutputRef(tagNode){
        return Object.keys(tagNode.ref).length ;
    }

    /**
     * Add an empty child Object. If the parent tag already has the same property then convert it into an array first.
     * 
     * Expected output:
     * * tagName: {}
     * * tagName : [{}, {}]
     * 
     * Note: In case of leaf nodes, {} will be replaced by premitive value at the time of closing tag.
     * 
     * @param {object} parentNode 
     * @param {string} tagName 
     */
    addTag(parentNode,tagName){
        const obj = {};
        //if(parentNode[tagName] == undefined){ next statement may little faster
        if(typeof parentNode[tagName] === "undefined"){
            parentNode[tagName] = obj ;
        }else if(!Array.isArray(parentNode[tagName])){
            parentNode[tagName] = [ parentNode[tagName] , obj];
        }else{
            parentNode[tagName].push(obj);
        }
        return obj;
    }

    /**
     * 
     * @param {object} obj it can be a tag obj or attribute node inside a tag object.
     * @param {string} key attribute name
     * @param {any} val  attribute value
     */
    _addAttribute(obj, key, val){
        obj[key] = val;
    }

    addCDATA(val){
        const parentTagNode = this.parentTagNode();
        this.addProperty(parentTagNode.ref, this.options.cdataPropertyName, val)
    }

    /**
     * 
     * * value: ["val"] ⇒ tag: { key : "val" }
     * * value: "val" ⇒ tag: { key : "val" }
     * 
     * @param {obj} obj parent tag
     * @param {string} tagName this object already exists in parent tag
     * @param {string} key 
     * @param {any} value
     */
    _addText(obj, tagName, key, value){
        if(Array.isArray(value) && value.length === 1){//TODO: already covered in closingTag()
            value = value[0];
        }
        let tag = obj[tagName];

        if(Array.isArray(tag) ){
            tag = tag[tag.length - 1];
            tag[key] = value;
        }else{
            tag[key] = value;
        }
    }
}

module.exports = NormalResponseBuilder