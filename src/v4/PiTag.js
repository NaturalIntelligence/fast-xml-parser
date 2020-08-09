const TagHandler = require("./TagHandler")
//Example
//<?name ?>
class PiTag extends TagHandler{

    constructor(parser){
        super(parser);
    }

    handle(){
        const tagName = this.parser.data.substr(this.parser.index.start, this.parser.data.indexOf(" ") - 1);
        if(tagName.toLowerCase() === "xml"){
            throw new Error("Invalid pi tag : '" + tagName+ "'");
        }
        this.breakDataWithOutTagExpression();
    }
    
    handleStringData(){
        this.endIndex("?>");
        this.breakData(2,2);
    }

}
module.exports = PiTag