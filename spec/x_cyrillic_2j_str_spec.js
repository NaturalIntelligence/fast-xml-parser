"use strict";

const parser = require("../src/parser");
const validator = require("../src/validator");

describe("XMLParser", function() {

    it("should parse XML with cyrillic characters to JSON string", function() {
        const xmlData = `<КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>`;
        const expected = {
            "КорневаяЗапись": {
                "Тэг":  "ЗначениеValue53456"
            }
        };
        const options = {
          localeRange: "а-яёА-ЯЁa-zA-Z",
          attributeNamePrefix : "@_"
        }

        const result = parser.parse(xmlData, options, { localeRange: "а-яёА-ЯЁa-zA-Z" });
        expect(result).toEqual(expected);
        // console.log({ expected})
        // console.log({ result })
    });

    it("should invalid XML with invalid localRange", function() {
        const xmlData = `<КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>`;

        const expected = {
            "code": "InvalidOptions",
            "msg":  "Invalid localeRange",
            "line": 1
        };

        const result = validator.validate(xmlData , { localeRange: "а-яёА-ЯЁa-zA-Z<" }).err
        expect(result).toEqual(expected);
        // console.log({ expected})
        // console.log({ result })
    });

});
