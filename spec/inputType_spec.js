"use strict";

const fs = require("fs");
const path = require("path");

const {XMLParser, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should parse when Buffer is given as input", function() {
        
        const fileNamePath = path.join(__dirname, "assets/mini-sample.xml");
        const xmlData = fs.readFileSync(fileNamePath);

        const expected = {
            "any_name": {
                "person": [
                    {
                        "phone": [
                            122233344550,
                            122233344551
                        ],
                        "name": "Jack",
                        "age": 33,
                        "emptyNode": "",
                        "booleanNode": [
                            false,
                            true
                        ],
                        "selfclosing": ""
                    },
                    {
                        "phone": [
                            122233344553,
                            122233344554
                        ],
                        "name": "Boris"
                    }
                ]
            }
        };

        const parser = new XMLParser();
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse when invalid value is given", function() {

        const parser = new XMLParser();
        expect(parser.parse(23)).toBeUndefined();
    });

    it("should not parse when invalid value is given", function() {

        const parser = new XMLParser( { preserveOrder: true});
        expect(parser.parse([])).toBeUndefined();
    });
    
    it("should not parse when invalid value is given", function() {

        const parser = new XMLParser();
        expect(parser.parse([])).toBeUndefined();
    });
});
