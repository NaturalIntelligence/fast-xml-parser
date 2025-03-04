
import { XMLParser } from "../src/fxp.js";

describe("XMLParser", function() {

    it("should support the START_INDEX symbol ", function(){
        const xmlData = `<root><foo/><bar type="quux"/><bar type="bat"/></root>`;
        const START_INDEX = XMLParser.getStartIndexSymbol();
        const expected = { 
            root: {
                [START_INDEX]: 0,
                foo: {
                    [START_INDEX]: 6,
                },
                bar: [
                    { 
                        [START_INDEX]: 12,
                        "@_type": 'quux'
                    },
                    { 
                        [START_INDEX]: 30,
                        "@_type": 'bat'
                    },
                ],
            }
         };
        
        const parser = new XMLParser({preserveOrder:false, ignoreAttributes: false, preserveStartIndex: true});
        const result = parser.parse(xmlData);
        // console.dir(result, {depth:Infinity});
        expect(result).toEqual(expected);
        expect(result.root[START_INDEX]).toEqual(0); // index of <root>
        // expect(result.root.foo[START_INDEX]).toEqual(6); // index of <foo/> - but there's no object, just a string.
        expect(result.root.bar[0][START_INDEX]).toEqual(12);
        expect(result.root.bar[1][START_INDEX]).toEqual(30);
    });
});
