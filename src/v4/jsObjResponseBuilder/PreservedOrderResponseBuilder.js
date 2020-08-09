const ResponseBuilder = require("./ResponseBuilder")
/**
 * Structure:
 ```
 [ 
     { tag : [
            { key : "leaf"},
            { "sub-tag" : [
                { "key", "val"}
            ] }
     ]}
]
 ```
 */
class PreservedOrderResponseBuilder extends ResponseBuilder{

    constructor(options){
        super(options)
        this.tagStack[0].ref = this.outputNodeType();
    }


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
     * Adds a single property object with empty array value to an array: `{ key: [] }`.
     * 
     * Note: At the time of closing tag, empty array `[]` will be replaced with primitive value if it is the leaf tag.
     * @param {array} parentNode 
     * @param {string} tagName 
     * @returns {object} Reference to newly created child node
     */
    addTag(parentNode, tagName){
        const arr = [];
        this.pushSinglePropertyObject(parentNode, tagName, arr )
        return arr;
    }

    addCDATA(val){
        const parentNode = this.parentTagNode().ref;
        //this.addProperty(parentNode, this.options.cdataPropertyName, val)
        this.pushSinglePropertyObject(parentNode, this.options.cdataPropertyName, val )
    }

    closeTag(tagNode){
        if(this.options.preserveOrder === true){
            if(tagNode.ref && tagNode.ref.length === 1 && tagNode.ref[0][this.options.tagValuePropertyName] != undefined){
                let val = tagNode.ref[0][this.options.tagValuePropertyName];
                tagNode.ref = this.parseTagValue(tagNode.name, val, tagNode.attrs);
                //if(val === undefined) val = currentTag.val;
                const parentNode = this.parentTagNode();
                const parentOutputNode = parentNode.ref[parentNode.ref.length - 1];
                parentOutputNode[tagNode.name] = val;
            }
        }
    }

    saveText(text){
        //if(this.options.trimValues)    text = text.trim();
        text = text.trim();
        if(text.length > 0){
            const parentTagNode = this.parentTagNode();
            text = this.parseTagValue(parentTagNode.name, text, parentTagNode.attrs);
            if(text === undefined) text = parentTagNode.val;
            this.addText(parentTagNode.name, text);
        }
    }

    /**
     * 
     * @param {object} arrayNode parent tag
     * @param {string} tagName this object already exists in parent tag
     * @param {string} key 
     * @param {any} val 
     */
    _addText(arrayNode, tagName, key, val){
        const tempNode = {};
        tempNode[key] = val;
        arrayNode.push( tempNode );
        return tempNode;
    }

    _addAttribute(parentNode, key, val){
        this.pushSinglePropertyObject(parentNode, key, val);
    }
}

module.exports = PreservedOrderResponseBuilder;