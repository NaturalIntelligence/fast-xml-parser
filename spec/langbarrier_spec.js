
const {XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should parse <constructor> ", function(){
        const xmlData = `<root><other /><constructor /></root>`;
        const expected = { root: { other: '', constructor: '' } };
        
        const parser = new XMLParser({preserveOrder:false});
        const result = parser.parse(xmlData);
        // console.log(result);
        expect(result).toEqual(expected);
        //expect(result.replace(/\s+/g, "")).to.deep.equal(XMLdata.replace(/\s+/g, ""));
    });
});
