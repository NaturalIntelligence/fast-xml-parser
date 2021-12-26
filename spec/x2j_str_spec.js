"use strict";

import {XMLParser, XMLValidator} from "../src/fxp.js";
import {expect} from "chai";

describe("XMLParser", function() {

    it.skip("should parse a XML to JSON string", function() {
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
        //expect(result).to.deep.equal(expected);
    });
});