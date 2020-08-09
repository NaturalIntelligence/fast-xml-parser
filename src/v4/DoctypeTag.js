const TagHandler = require("./TagHandler")

/*
privateDoctype = <!DOCTYPE [\\s\\S]*]>
publicDoctype = <!DOCTYPE [\\s\\S]*>
*/
/**
 * 
 */
class DocTypeTag extends TagHandler{

    constructor(parser){
        super(parser);
        this.publicTag = false;
        this.exp = "";
    }

   /*  reset(){
        this.publicTag = false;
        this.exp = "";
    } */

    handle(){
        if(this.publicTag){
            if(this.parser.data[this.parser.index.end - 1] === ']'){
                //tag ends
                this.breakDataWithOutTagExpression();
            }else{
                //continue
            }
        }else{
            this.exp = this.parser.data.substr(this.parser.index.start + 9, this.parser.index.end);
            if(/^[^<]+\[/.test(this.exp)){
                this.publicTag = true;
            }else{
                //private tag ending
                this.breakDataWithOutTagExpression();
            }
        }
        
    }

    handleStringData(){
        //this.endIndex();
        const expStartIndex = this.parser.index.start + 9;
        const expEndIndex = this.parser.data.indexOf("[", expStartIndex) + 1;
        this.exp = this.parser.data.substring(expStartIndex, expEndIndex);
        
        if(/^[^<]+\[/.test(this.exp)){//startsWith " \w+ ["
            this.endIndex("]>");
        }else{
            this.endIndex();
        }

        //tagExpression can be extracted to verify the format
        //this.breakDataWithOutTagExpression();
        
    }
}
module.exports = DocTypeTag