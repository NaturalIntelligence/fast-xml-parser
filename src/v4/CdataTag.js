const TagHandler = require("./TagHandler")

class CdataTag extends TagHandler{

    constructor(parser){
        super(parser);
    }

    handle(){
        if( this.parser.data[this.parser.index.end - 1] === "]" && this.parser.data[this.parser.index.end - 2] === "]" ){
            this.breakData(8,2);
            this.parser.responseBuilder.addCDATA(this.tagExpression);
        }
    }

    handleStringData(){
        this.endIndex("]]>")
        this.breakData(8,2);
        this.parser.responseBuilder.addCDATA(this.tagExpression);
    }

    validateTagExpression(){
        if(this.relativeIndexOf("<![CDATA[") !== this.parser.index.start){
            throw new Error("Invalid CDATA tag epxression. Failed to process " + this.parser.data.substr(0,20) + "...");
        }
    }
}
module.exports = CdataTag