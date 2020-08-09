const ValueParser = require("./ValueParser")
const TagNode = require("./TagNode")

/**
 * @module ResponseBuilder
 */
class ResponseBuilder{

    constructor(options){
        this.options = options;
        this.tagStack = [ new TagNode() ];
        this.attrPrefix = "";
        if(!this.options.attributesGroupName){
            this.attrPrefix = this.options.attributeNamePrefix;
        }
    }

    reset(){
        this.tagStack = [ new TagNode() ];
        this.tagStack[0].ref = this.outputNodeType();
    }

    /**
     * @param {TagNode} tagNode 
     * @returns {object} output reference object
     */
    refNode(tagNode){
        return tagNode.ref;
    }

    /**
     * Prepend a prefix with attribute name if given in configuration.
     * @param {string} attrName 
     * @returns {string} attribute name
     */
    prefixAttributeName(attrName){
        return this.attrPrefix + attrName;
    }

    /**
     * Creates an object with single property and push it to the array
     * 
    ```
    arr = [
    { key : value }
    ]
    ```
     * @param {array} arr 
     * @param {string} key 
     * @param {any} value 
     */
    pushSinglePropertyObject(arr, key, value){
        const tempObj = {};
        this.addNewKey(tempObj, key, value);
        arr.push( tempObj );
    }


    
    /**
     * Add a property to the given object. 
     * * If the property already presents then convert it to array first. 
     * * If it is already an array then push the new value in end.
     * 
     * @param {Object} obj 
     * @param {string} key 
     * @param {any} val 
     */
    addProperty(obj, key, val){
        if(obj[key]){ //TODO: check for empty value: obj[key] = ""
            if(Array.isArray(obj [key])){
                obj [key].push(val);
            }else{
                obj [key] = [ obj [key] , val];
            }
        }else {
            this.addNewKey(obj, key, val);
        }
    }

    addNewKey(obj, key, val) {
        obj[key] = val;
    }

    /**
     * An attribute can be added as sibling of child tags or in a group.
     * This method helps to set it up.
     */
    setupAttributeNode(){
        const parentTagNode = this.parentTagNode();
        const outputNodeRef = parentTagNode.ref;

        if(this.options.attributesGroupName){
            parentTagNode.attrNodeRef = this.addTag(outputNodeRef, this.options.attributesGroupName);
        }else{
            parentTagNode.attrNodeRef = outputNodeRef;
        }
    }
    
    /**
     * 
     * @param {object} tagNode 
     * @param {string} attributeName 
     * @param {any} value 
     */
    addAttribute(tagNode, attributeName, value){
        let val = this.parseAttributeValue(attributeName, value);
        if(val === undefined) val = value 
        this._addAttribute(tagNode.attrNodeRef, this.prefixAttributeName(attributeName), val );
    }

    hasAttribute(tagNode, attrName){
        if(tagNode.attrNodeRef[attrName]) return true; //TODO: check for attribute with empty value
        else return false;
    }

    /**
     * Creates new TagNode and update the reference of parent Node with this.
     * @param {string} tagName 
     * @param {array} nsArr 
     * @returns {TagNode} newly created TagNode.
     */
    addOpeningTag(tagName, nsArr, originalName){
        const outputRefNode = this.addTag(this.parentTagNode().ref, tagName);
        const newTagNode = new TagNode(tagName, nsArr, originalName);

        newTagNode.ref = outputRefNode;

        this.tagStack.push( newTagNode );
        return newTagNode;
    }

    /**
     * Add text node to a leaf or non-leaf tag
     * @param {string} tagName
     * @param {any} val
     */
    addText(tagName, val){
        const parentNode = this.parentTagNode()
        this._addText(parentNode.ref, tagName, this.options.tagValuePropertyName, val);
    }

    /**
     * 
     * @param {TagNode} tagNode recently popped node from the tag stack
     */
    closeTag(tagNode){
        if( tagNode.isEmpty()){//Empty Node
            tagNode.val = [""]
        }

        if(tagNode.val.length > 0){
            if( this.options.arrayMode !== 'strict' && tagNode.val.length === 1){
                tagNode.val = tagNode.val[0];
            }

            let val = this.parseTagValue(tagNode.name, tagNode.val, tagNode.attrs);
            if(val === undefined) val = tagNode.val;
            if(this.sizeOfOutputRef(tagNode) > 0 ){//when tag has attributes or nested tag
                this.addText(tagNode.name, val);
            }else{//leaf node
                this.replaceWithValueNode( tagNode.name, val );
            }
        }
    }

    /**
     * Update leaf-node value with premitive value. It is previously set as [] or {}
     * @param {string} tagName 
     */
    replaceWithValueNode(tagName, val){
        const parentNode = this.parentTagNode()
        const parentOfLeafNode = this.refNode(parentNode);
        const leafNode = parentOfLeafNode[tagName];

        if( Array.isArray(leafNode) && leafNode.length > 1 ){ //repeatative
            //update last node
            if(Array.isArray(val)){
                leafNode[leafNode.length - 1] = val[0];
            }else{
                leafNode[leafNode.length - 1] = val;
            }
        }else{
            parentOfLeafNode[tagName] = val;
        }
    }

    saveText(text){
        if(this.options.trimTagValue)    text = text.trim();
        //text = text.trim();
        if(text.length > 0){
            const parentTagNode = this.parentTagNode();
            parentTagNode.val.push(text);
        }
    }

    selfClosing(){
        /* const parentNode = this.parentTagNode();
        if (attrCount === 0) {
            if (Array.isArray(parentTagNode.ref[this.tagName]) && parentTagNode.ref[this.tagName].length > 1) { //repeatative
                //update last node
                parentTagNode.ref[this.tagName][parentTagNode.ref[this.tagName].length - 1] = "";
            } else {
                parentTagNode.ref[this.tagName] = "";
            }
        } */
        const startTagNode = this.tagStack.pop();
        this.closeTag(startTagNode);
        //TODO: check if this node has no child node then assign it with empty string
    }
    /**
     * This method gets called when `this.options.parseTagValue : true`
     * @param {any} val 
     */
    parseAttributeValue(name,val){
        val =  ValueParser.parseValue(val, this.options.parseTrueNumberOnly, this.options.parseAttributeValue)
        return this.options.attrValueProcessor(name, val);
    }

    /**
     * Parse the tag value from string to relevant data type. And call tagValueProcessor()
     * @param {string} name 
     * @param {string} actualValue 
     * @param {object|array} attrs 
     */
    parseTagValue(name, actualValue, attrs){
        actualValue = ValueParser.parseValue(actualValue, this.options.parseTrueNumberOnly, this.options.parseTagValue)
        return this.options.tagValueProcessor(name, actualValue, attrs);
    }

    /**
     * @returns {TagNode} Top node from TagStack (Latest node)
     */
    parentTagNode(){ 
        return this.tagStack [ this.tagStack.length - 1] ;
    }

}

module.exports = ResponseBuilder;