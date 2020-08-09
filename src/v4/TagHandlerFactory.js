const CdataTag = require("./CdataTag");
const XMLPiTag = require("./XMLPiTag");
const PiTag = require("./PiTag");
const DocClosingTag = require("./DocClosingTag");
const DocStartingTag = require("./DocStartingTag");
const DoctypeTag = require("./DoctypeTag");
const CommentTag = require("./CommentTag");


/**
 *  Tags

<e>
<e/>
</e>
<e a=">">
<!DOCTYPE [ * >
<!DOCTYPE [ * ]>
<?some ?>
<!-- < > -->
<![CDATA[ < > ]]>

 * 
 */
class TagHandlerFactory{
    constructor(parser){
        this.parser = parser;
        /* this.XMLPiTag = new XMLPiTag(parser);
        this.PiTag = new PiTag(parser);

        this.CdataTag = new CdataTag(parser);
        this.DoctypeTag = new DoctypeTag(parser);
        this.CommentTag = new CommentTag(parser);

        this.DocClosingTag = new DocClosingTag(parser);

        this.DocStartingTag = new DocStartingTag(parser); */

        this._secondaryTagHandlers = {
            "D" :  new DoctypeTag(parser),
            "[" :  new CdataTag(parser),
            "-" :  new CommentTag(parser),
        };

        this._tagHandlers = {
            "?": (data) => {
                    if(XMLPiTag.canHandle(data)){
                        return  new XMLPiTag(parser);
                    }else{
                        return  new PiTag(parser);
                    }
                },
            "!" : (data, startIndex) => {
                    return this._secondaryTagHandlers[data[ startIndex + 2 ]];
                },
            "/" : () => new DocClosingTag(parser)
        }
    }

    /**
     * Get appropriate tag handler based on 2nd or 3rd character after '<'
     * @param {string} data 
     * @param {object} index 
     * @returns {TagHandler} TagHandler
     */
    getHandler(data, index){
        
        const handler = this._tagHandlers[data[ index.start + 1 ]];
        if(handler){
            return handler(data, index.start);
        }else{
            return new DocStartingTag(this.parser);
        }
    }
}

module.exports = TagHandlerFactory;