const TagHandler = require("./TagHandler")

class CommentTag extends TagHandler{

    constructor(parser){
        super(parser);
        if(parser.options.validation){
            this.process = this.breakData;
        }else{
            this.process = this.breakDataWithOutTagExpression;
        }
    }

    handle(){
        if( this.parser.data[this.parser.index.end - 1] === "-" && this.parser.data[this.parser.index.end - 2] === "-" ){
            this.process();
        }
    }
    handleStringData(){
        this.endIndex("-->");
        this.process(3,2);
    }

    validateTagExpression(){
        if(this.tagExpression.indexOf("--") !== -1){
            throw new Error("Comment tag is not well formed. '--' are not allowed inside. <!--" + this.tagExpression.substr(0,10) + "...");
        }
    }
}
module.exports = CommentTag