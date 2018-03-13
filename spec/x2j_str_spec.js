"use strict";

const parser = require("../src/parser");

describe("XMLParser", function() {

    it("should parse a XML to JSON string", function() {
        const xmlData = `<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "boolean":  true,
                "intTag":   45,
                "floatTag": 65.34
            }
        };

        const result = parser.convertToJsonString(parser.getTraversalObj(xmlData));
        //console.log(JSON.stringify(result,null,4));
        //console.log(result);
        //expect(result).toEqual(expected);
    });
});