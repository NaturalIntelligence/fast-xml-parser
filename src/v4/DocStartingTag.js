
const TagHandler = require("./TagHandler")
const util = require("./util")

/**
 * * [1] - attribute name having value
 * * [2] - attribue value boundary char
 * * [3] - attribute value
 * * [4] - boolean attribute name 
 */
const attrRegexString = '(\\s*[^=\\s]+)\\s*=\\s*([\'"])([\\s\\S]*?)\\2|(\\s*[\\S]+)';
const attrRegex = new RegExp(attrRegexString, "g");


/*
Invalid expressions

* <a b="s<d"></a>
* <a b="sd">3 < 5</a>
* <a b="sd">3 & 5</a>
* 
valid

<a>
<a >
<a/>
<a b>
<a b/>
*/
/**
 * 
 */
const singleQuote = "'";
const doubleQuote = '"';
const nameStartChar = 'A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-\\.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*'
const regexName = new RegExp('^' + nameRegexp + '$');

//TODO: rename it to DocOpeningTag
class DocStartingTag extends TagHandler {

    constructor(parser) {
        super(parser);
        this.current = -1;
        this.quotesStack = [];
        this.attrBoundary = "";
        this.isSelfClosing = false;
        this.tagName = "";
        this.ns = [];
        /**
         * List of attributes. Key represents attribute name with NS if presents
         */
        this.attributes = {};
    }

   /*  reset() {
        super.reset();

        this.current = -1;
        this.quotesStack = [];
        this.attrBoundary = "";
        this.isSelfClosing = false;
        this.tagName = "";
        this.ns = [];
        this.attributes = {};
    } */

    handle() {
        if (this.current === -1) {
            this.current = this.parser.index.start + 1;
        }
        for (; this.current < this.parser.index.end; this.current++) {
            let ch = this.parser.data[this.current];
            /*if(ch === '<') throw new Error("Tag expression is not well formed"); //This condition can be checked when validation is on using indexOf("<")
            else*/ if (this.attrBoundary) {
                if (ch === this.attrBoundary) this.attrBoundary = "";
            } else if (ch === doubleQuote || ch === singleQuote) {
                this.attrBoundary = ch;
            }
        }

        if (this.attrBoundary) {//open expression
            return;
        } else {//complete expression
            this.breakData();
            this.processTagExpression();
        }
    }

    handleStringData() {
        for (let index = this.parser.index.start + 1; index < this.parser.data.length; index++) {
            let ch = this.parser.data[index];
            if (this.attrBoundary) {
                if (ch === this.attrBoundary) this.attrBoundary = "";
            } else if (ch === doubleQuote || ch === singleQuote) {
                this.attrBoundary = ch;
            } else if (ch === '>') {
                this.parser.index.lastEnd = this.parser.index.end;
                this.parser.index.end = index;

                if (this.parser.data[index - 1] === "/") {
                    this.isSelfClosing = true;
                    this.breakData(0, 1); //exclude '/' in last from tag expression
                } else {
                    this.breakData();
                }
                this.processTagExpression();
                this.parser.openingTagFound = true;
                //check for self closing tag
                if (this.isSelfClosing) {
                    this.parser.responseBuilder.selfClosing(this.tagName);
                    this.parser.endScope(this.ns);
                }

                break;
            }
        }//End loop
    }
    
    processTagExpression() {
        //separate tagName
        const separatingIndex = this.tagExpression.indexOf(" ");
        
        if (separatingIndex === -1) {//no attribute expression
            this.tagName = this.tagExpression;
        } else {
            this.tagName = this.tagExpression.substr(0, separatingIndex);
            this.processAttributeString(separatingIndex);
        }
        this.tagName = this.tagName.trimRight();

        if(this.tagName.length === 0){
            throw new Error("Invalid character '<'. You should use '&lt;' instead")
        }

        const originalName = this.tagName;
        this.tagName = this.validateNS(this.tagName);
        this.tagNode = this.parser.responseBuilder.addOpeningTag(this.tagName, this.ns, originalName);
        
        if (separatingIndex !== -1){
            this.processAttrbutes(this.tagNode);
        }

    }

    /**
     * 1. Check for NS scoping if enabled
     * 2. Remove NS prefix if enabled
     * 3. Validate name without NS
     * @param {string} str tagName or attrName
     * @returns {string}
     */
    validateNS(str){
        let nameWithoutNS = str;
        const colonIndex = str.indexOf(":");
        if(colonIndex !== -1) {
            if(!this.parser.options.ignoreNSScoping){//TODO: control it by validation flag
                let ns = str.substr(0, colonIndex);
                if (!this.parser.nameSpaceMap[ns]) {
                    throw new Error(`Namespace '${ns}' is not bound to '${str}'. Tag '${this.tagName}'`)
                }
            }
            
            nameWithoutNS = str.substr(colonIndex + 1);
            if(this.parser.options.removeNSPrefix)  {
                str = nameWithoutNS;
            }
        }
        this.validateName(nameWithoutNS);//performance overhead: 40L rps
        return str;
    }

    /**
     * 1. Separate NS
     * 2. Validate boolean attribute
     * 3. build attribute map
     * @param {number} separaterIndex 
     */
    processAttributeString(separaterIndex) {
        let attrString = this.tagExpression.substr(separaterIndex);
        const matches = util.getAllMatches(attrString, attrRegex);

        for (let i=0; i < matches.length; i++) {
            let attrName = matches[i][4];
            let attrVal = matches[i][3];
            
            if (attrName) {//boolean attribute
                if (this.parser.options.allowBooleanAttributes) {
                    attrVal = true;
                } else {
                    throw new Error(`Boolean attributes are not allowed: '${attrName.trim()}' in Tag '${this.tagName}'`);
                }
            } else {
                attrName = matches[i][1];
                attrVal= attrVal.replace(/[\n\r]/,"");
            }

            if(attrName[0] === ' ' || attrName[0] === '\t' || attrName[0] === '\n' || attrName[0] === '\r'){
                attrName = attrName.trimLeft();
            }else{
                throw new Error(`Not well-formed. No space before attribute '${attrName}' in Tag '${this.tagName}'`)
            }

            if(attrName.indexOf("xmlns:") === 0){
                if(!attrVal){
                    throw new Error(`Namespace '${attrName}' is assigned to emptry source`)
                }
                const ns = attrName.substr(6);
                this.validateName(ns);
                this.registerNS( ns )
                if(!this.parser.options.ignoreXmlnsAttributes) this.attributes[attrName] = attrVal;
            }else if(this.parser.options.ignoreAttributes === false){
                //TODO: make it dummy for ignoreAttributes: true

                //TODO: remove tagNode dependency. Let the builder fetch it from the stack
                
                attrName = this.validateNS(attrName);
                //This will not throw error when the same attribue with & without NS appears:  ns:ab & ab
                if(this.attributes[attrName]){//TODO: check for attr with empty value
                    throw new Error(`Duplicate attribute '${attrName}' in tag '${this.tagName}'`);
                }
                this.attributes[attrName] = attrVal;
            }
        }
        
    }

    /**
     * 5. Save values in this.attributes so they can be passed to tagValueProcessor
     * 6. 
     * @param {string} attrString 
     */
    processAttrbutes(tagNodePointer) {
        this.parser.responseBuilder.setupAttributeNode();
        const keys = Object.keys(this.attributes);
        const len = keys.length;
        for (let i = 0; i < len; i++) {
            let attrName = keys[i];
            const attrVal = this.attributes[attrName];

            //TODO: check for duplicate attributes 
            if(this.parser.responseBuilder.hasAttribute(tagNodePointer, attrName) ){
                throw new Error(`Duplicate attribute ${attrName} in tag ${this.tagName}`);
            }else{
                this.parser.responseBuilder.addAttribute(tagNodePointer, attrName, attrVal)
            }
        }
        tagNodePointer.attrs = this.attributes;
    }



    /**
     * @param {string} ns;
     */
    registerNS(ns) {
        this.parser.addNS(ns);
        this.ns.push(ns);
    }

    //TODO: mock it for validation:false
    validateName(nameWithoutNS) {
        if (!regexName.test(nameWithoutNS)) {//validate attribute name
            throw new Error(`'${nameWithoutNS}' is not well formed in tag '${this.tagName}'`)
        }
     }

}
module.exports = DocStartingTag