"use strict";

const {XMLParser, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should parse XML with cyrillic characters to JSON string", function() {
        const xmlData = `<КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>`;
        const expected = {
            "КорневаяЗапись": {
                "Тэг":  "ЗначениеValue53456"
            }
        };
        const options = {
          attributeNamePrefix : "@_"
        }
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        
        expect(result).toEqual(expected);
        // console.log({ expected})
        // console.log({ result })
    });
});
