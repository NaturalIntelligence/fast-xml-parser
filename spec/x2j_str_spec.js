"use strict";

const {XMLParser, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    xit("should parse a XML to JSON string", function() {
        const xmlData = `<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "boolean":  true,
                "intTag":   45,
                "floatTag": 65.34
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        const result = parser.prettifyString(parser.parse(xmlData));
        //console.log(JSON.stringify(result,null,4));
        //console.log(result);
        //expect(result).toEqual(expected);
    });
});