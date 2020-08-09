const TagHandler = require("./TagHandler")
const util = require("./util")

class XMLPiTag extends TagHandler{

    constructor(parser){
        super(parser);
    }

    handle(){
        //this.trimData();
    }
    
    handleStringData(){
        this.endIndex("?>");
        //this.trimData();
        this.extractTagExpression(5,1);
        validate(this.tagExpression);
    }

}

//TODO: You can replace this logic with indexOf("<?xml") without compromising with performence.
XMLPiTag.canHandle = function(data){
    if( data[0] === "<" &&
        data[1] === "?" &&
        data[2] === "x" &&
        data[3] === "m" &&
        data[4] === "l"
    ){
        return true;
    }else{
        return false;
    }
}

const attributesRegx = new RegExp('([a-z]+)\\s*=\\s*([\'"]).*?\\2',"g");
function validate(tagData){
    const matches = util.getAllMatches(tagData, attributesRegx);
    if(matches){
        const len = matches.length; //don't make it inline

        /**
         * 'version' attribute is mandatory
         * 'encoding'/'standalone' comes next but in sequence. And they are optional
         */
        if(len === 0){
            throw new Error( "XML pi tag with missing mandatory attributes" );
        }else if(len === 1 && matches[0][1] === "version" ){
            //do nothing
        }else if(len === 2 && matches[0][1] === "version" 
            && (matches[1][1] === "encoding"  || matches[1][1] === "standalone") ){
                //do nothing
        }else if(len === 3 && matches[0][1] === "version" 
            && matches[1][1] === "encoding" && matches[2][1] === "standalone" ){
                //do nothing
        }else{
            throw new Error( "XML Declaration PI tag is not well-formed" );

        }
    }
}

module.exports = XMLPiTag