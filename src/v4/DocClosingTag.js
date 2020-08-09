const TagHandler = require("./TagHandler")

class DocClosingTag extends TagHandler{

    constructor(parser){
        super(parser);
        if(parser.options.validation){
            this.process = this.breakData;
        }else{
            this.process = this.breakDataWithOutTagExpression;
        }
    }

    handle(){
        this.process();
    }
    
    handleStringData(){
        this.endIndex();
        this.process(1);

        this.startingTagNode = this.parser.responseBuilder.tagStack.pop();
        this.parser.responseBuilder.closeTag(this.startingTagNode);
        this.parser.endScope(this.startingTagNode.ns);

        //TODO: tagReplacer
        //check if it is a leaf node
        //call tagReplacer which can parse the value or can change tag name.
        //Logic: Instead of adding tag to output node directly add it to TagNode. Add it to output node when closing tag is called.
    }

    validateTagExpression(){
        let exp = this.tagExpression.trimRight();
        
        if(!this.startingTagNode.name){
            throw new Error("Closing tag '</"+ this.tagExpression +">' is not expected. Matching opening tag is not present.");
        }else if(this.startingTagNode.originalName !== exp){
            throw new Error("Closing tag is not well formed. '</"+ this.startingTagNode.originalName+ ">' was expected instead of '</" + this.tagExpression + ">'.");
        }
    }
}
module.exports = DocClosingTag