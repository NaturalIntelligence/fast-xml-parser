"use strict";

const parser = require("../src/parser");

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

        const result = parser.parse(xmlData, options);
        expect(result).toEqual(expected);
        // console.log({ expected})
        // console.log({ result })
    });
});
