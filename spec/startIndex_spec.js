
const {XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should support the START_INDEX symbol ", function(){
        const xmlData = `<root><foo/><bar type="quux"/><bar type="bat"/></root>`;
        const expected = { 
            root: {
                foo: '',
                bar: [
                    { "@_type": 'quux'},
                    { "@_type": 'bat'},
                ],
            }
         };
        
        const parser = new XMLParser({preserveOrder:false, ignoreAttributes: false});
        const START_INDEX = parser.getStartIndexSymbol();
        const result = parser.parse(xmlData);
        // console.dir(result, {depth:Infinity});
        expect(result).toEqual(expected);
        expect(result.root[START_INDEX]).toEqual(0); // index of <root>
        // expect(result.root.foo[START_INDEX]).toEqual(6); // index of <foo/> - but there's no object, just a string.
        expect(result.root.bar[0][START_INDEX]).toEqual(12);
        expect(result.root.bar[1][START_INDEX]).toEqual(30);
    });
});
