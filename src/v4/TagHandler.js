
/**
 * @module TagHandler
 */
class TagHandler{

    constructor(parser){
        this.parser = parser;
    }
    /**
     * It extracts tag expression which starts from '<' and ends on '>'.
     * Data after '>' should be saved to data string for next time processing.
     * Data before '<' should be passed to saveText method.
     * Eg before<tag exp>value</tag>after
     * 
     * In some cases, we need to maintain the order of elements. Hence
     * saveText("before") should be called before saveTag("tag");
     * 
     */
    handle(){}
    reset(){}
    validateTagExpression(){}

    endIndex(str){
        this.parser.index.lastEnd = this.parser.index.end;
        const startFrom = this.parser.index.start;
        if(str) {
            let index = this.parser.data.indexOf( str , startFrom);
            if(index !== -1 ){
                this.parser.index.end = index + str.length - 1;
            }else{
                this.parser.index.end = -1;
            }
        }else{
            this.parser.index.end = this.parser.data.indexOf( ">" , startFrom);
        }
    }

    relativeIndexOf(str){
        return this.parser.data.indexOf(str, this.parser.index.start );
    }
    /**
     * extract text before tag, tag expression, and after tag text.
     * Eg: before<tag exp>after
     * 
     * @param {number} startOffset number of chars from '<' to actual tag expression. It is 8 in case of '<!CDATA['
     * @param {number} endOffset number of chars before '>' to actual tag expression. It is 3 in case of ']]>'
     */
    breakData(startOffset=0, endOffset=0){
        //Extract
        this.tagExpression = this.parser.data.substring(this.parser.index.start + startOffset + 1, this.parser.index.end  - endOffset);
        this.parentTagValue = this.parser.data.substring(this.parser.index.lastEnd + 1,this.parser.index.start);
        
        //save text appears before tag starts
        this.parser.responseBuilder.saveText(this.parentTagValue);
    }

    /**
     * Tag expression is not needed for some tags which are not being recorded, like XMLPiTag, PiTag, DOCType, CommentTag
     */
    extractTagExpression(startOffset=0, endOffset=0){
        //Extract
        this.tagExpression = this.parser.data.substring(this.parser.index.start + startOffset + 1, this.parser.index.end  - endOffset);
    }

    last(){
        this.reset();
    }
}

module.exports = TagHandler