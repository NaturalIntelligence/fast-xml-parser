const ResponseBuilder = require("./ResponseBuilder")
/**
 * A tag can have array only if it has multiple occurences. So a user need to exlicitely check if a tag has an array before processing further value of a tag.
 * location: "Japan"
 * location: ["US", "Japan"]
 * 
 * To avoid this check a user can set `arrayMode: true` which always put child nodes in an array.
 * 
 * We don't face this problem in case of preserveOrder scenario. Hence, bothe options are treated separately and only one option can be enabled at a time. However, `arrayMode` takes precedence if both options are enabled.
 * 
 * Structure:
 ```
 [{ 
    location : [{ 
        "repeated-leaf-tag" : ["val1", "val2"],
        "single-leaf-tag" : "value",
        "nested-tag" : [{
            "key" : [ ... ]
        }]
    }]
}]
 ```
 * 
 * arrayMode can have 2 possible values: true, 'strict'
 */
class ArrayResponseBuilder extends ResponseBuilder{

    constructor(options){
        super(options)
        this.tagStack[0].ref = this.outputNodeType();

        //To avoid runtime check
        if(this.options.arrayMode === 'strict'){
            this.addNewKey = function(obj, key, val){
                if(Array.isArray(val) ){ //TODO: check if it can be avoided
                    obj[key] = val;
                }else{
                    obj[key] = [val];
                }
            };
        }
    }

    // _updateValue(val){
    //     return val;
    // }

    outputNodeType(){
        return []
    };

    /**
     * 
     * @param {TagNode} tagNode 
     */
    sizeOfOutputRef(tagNode){
        return tagNode.ref.length ;
    }

    /**
     * 
     * @param {object} tagNode 
     */
    refNode(tagNode){
        return tagNode.ref[0];
    }
    /**
     * Attributes can be added to the parent node as sibling of it's nested tags. Or they can be grouped under a single node.
     */
    //setupAttributeNode(){}

    /**
     * Adds a property with empty array value: `key: []`.
     * * tag : [{    sub-tag : []  }]
     * * tag : [{    sub-tag : [ "val" ] , sub-tag2: [] }]
     * * tag : [{    sub-tag : [ "val" , "other" ] , sub-tag2: [] }]
     * 
     * Note: In case of leaf nodes, [] will be replaced by premitive value at the time of closing tag.
     * @param {array} parentArrNode 
     * @param {string} tagName
     * @returns {array} Reference to newly created child node
     */
    addTag(parentArrNode, tagName){
        const arr = [];
        this._AddOrUpdateObjectToArray(parentArrNode, tagName, arr);
        return arr;
    }

    /**
     * 
     * @param {string} val 
     */
    addCDATA(val){
        const parentNode = this.parentTagNode().ref;
        //this.addProperty(parentNode, this.options.cdataPropertyName, val)
        this._AddOrUpdateObjectToArray(parentNode, this.options.cdataPropertyName, val )
    }

    /**
     * 
     * @param {object} obj parent tag
     * @param {string} tagName this object already exists in parent tag
     * @param {string} key 
     * @param {any} val 
     */
    _addText(obj, tagName, key, val){
        const parentArrNode = obj[0][tagName];
        this._AddOrUpdateObjectToArray(parentArrNode, key, val);
    }

    /**
     * 
     tagName : [{
        attrGropName : [{
            attrName : val
        }]
     }]
     
     tagName : [{
        attrName : val
     }]
     * 
     * @param {array} parentArrNode with single object
     * @param {string} tagName 
     * @param {any} val 
     */
    _addAttribute(parentArrNode, tagName, val){
        //val = this._updateValue(val);
        this._AddOrUpdateObjectToArray(parentArrNode, tagName, val)
    }

    /**
     * Add an object to empty array. Or update the object with new val.
     * 
     * * arr : [ ] ⟹ arr : [{    key : val  }]
     * * arr : [ { old-key : any }] ⟹ arr : [{    old-key : any , key: val }]
     * * arr : [ { key: any } ] ⟹ arr : [ { key: [ any, val ] } ]
     * * arr : [ { key: [ any , other] } ] ⟹ arr : [ { key: [ any, other, val ] } ]
     * 
     * @param {array} parentArrTag with single object
     * @param {string} key 
     * @param {any} val 
     */
    _AddOrUpdateObjectToArray(parentArrTag, key, val){
        if(parentArrTag.length === 0){ //first entry in parent
            this.pushSinglePropertyObject(parentArrTag, key, val)
        }else{//repeatative entry
            this.addProperty(parentArrTag[0], key, val);
        }
    }

}



module.exports = ArrayResponseBuilder