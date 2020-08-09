const TagHandlerFactory = require("./TagHandlerFactory");
const buildOptions = require("./OptionsBuilder");
const JsObjResponseBuilderFactory = require("./jsObjResponseBuilder/ResponseBuilderFactory");
//const JsObjResponseBuilderFactory = require("./jsObjResponseBuilder2/ResponseBuilderFactory");
class xmlparser{

    constructor(options){
        this.options = buildOptions(options);
        this.tagHandlerFactory = new TagHandlerFactory(this);
        
        this.index = {
            start: -1, //position of first '<' in data
            end: -1, //position of first '>' in chunk
            current: -1
        }
        this.data = "";
        this.chunk = ""; //part of recent data received which is not merged to this.data yet.
        this.responseBuilder = JsObjResponseBuilderFactory(this.options);
        this.nameSpaceMap = {};
    }

    //TODO: call it before further parsing
    reset(){
        this.index = {
            start: -1, //position of first '<' in data
            end: -1, //position of first '>' in chunk
            current: -1
        }
        this.data = "";
        this.chunk = "";
        this.openingTagFound = false;
        this.responseBuilder.reset();
        this.nameSpaceMap = {};
    }



    /**
     * 
     * @param {string} data 
     */
    parseStream(data){
        for(let i=0; i< data.length; i++){
            let newChunk = data[i];
            this.chunk += newChunk;

            let indexOfClosingChar = newChunk.indexOf(">");
            if(indexOfClosingChar !== -1){
                //process ahead
                this.data += this.chunk;
                if(this.index.start === -1){
                    this.index.start = this.data.indexOf("<");
                }
                if(this.index.start !== -1){
                    this.index.end = this.data.length + indexOfClosingChar - 1;
                    const tagHandler = this.tagHandlerFactory.getHandler(this.data, this.index);
                    //A tag can handle the tag or skip to process it next time. Because closing char can appear before closing the tag
                    tagHandler.handle();
                    this.data = this.data.substr(this.index.end + 1);
                    this.index.start = -1;//TODO: FIX: this should not be called when DocStartingTag has not finished it's processing.
                    tagHandler.last();
                    this.chunk = ""; //reset
                }
            }else{
                //wait
            }
        }
    }

    /**
     * 
     * @param {string} data 
     */
    parseString(data){
        this.reset();
        this.data = data;
        while(true){
            this.index.start = this.data.indexOf("<", this.index.end);
            if(this.index.start === -1) break; //no more odata
            
            const tagHandler = this.tagHandlerFactory.getHandler(this.data, this.index);
            if(tagHandler) {
                tagHandler.handleStringData();
                if(this.options.validation) tagHandler.validateTagExpression();
                if(this.index.end === -1 ) {
                    //throw new Error("Incomplete XML Data. Failed in processing " + tagHandler._type);
                    throw new Error("Incomplete XML Data. Or invald opening tag " + this.data.substr(0, 10));
                }
            }else{
                throw new Error("Invalid tag expression. Failed to process at "  + this.data.substr(0, 10) + "... Previous Tag in not closed at right position.");

            }
            tagHandler.last();
        }
        if(!this.openingTagFound){
            throw new Error("No element found.");
        }
        return this.responseBuilder.tagStack[0].ref;
    }

    /**
     * Maintain the namespaces counter
     * @param {string} ns 
     */
    addNS(ns){
        if(this.nameSpaceMap[ns]){
            this.nameSpaceMap[ns]++;
        }else{
            this.nameSpaceMap[ns] = 1;
        }
    }

    /**
     * Reduce the count value of namespace if tag has namespace(s)
     * @param {array} nsArray 
     */
    endScope(nsArray){
        if(nsArray && nsArray.length > 0){
            for(let i=0; i< nsArray.length; i++){
                this.nameSpaceMap[ nsArray[i] ]--;
            }
        }
    }
}

module.exports = xmlparser