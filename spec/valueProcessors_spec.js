"use strict";

const parser = require("../src/parser");
const validator = require("../src/validator");
const he = require("he");

describe("XMLParser", function() {

    it("should decode HTML entities if allowed", function() {
        const xmlData = "<rootNode>       foo&ampbar&apos;        </rootNode>";
        const expected = {
            "rootNode": "foo&bar'"
        };
        const result = parser.parse(xmlData, {
            parseNodeValue: false,
            decodeHTMLchar: true,
            tagValueProcessor : a => he.decode(a)
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("tag value processor should be called with value and tag name", function() {
        const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                start
                <name1>Jack 1</name1 >
                middle
                <name2>35</name2>
                end
            </person>
        </any_name>`;

        const expected = {
            "any_name": {
                "person": {
                    "#text": "startmiddleend",
                    "name1": "Jack 1",
                    "name2": 35
                }
            }
        };

        const resultMap = {}
        const result = parser.parse(xmlData, {
            tagValueProcessor: (val, tagName) => {
                if(resultMap[tagName]){
                    resultMap[tagName].push(val)
                }else{
                    resultMap[tagName] = [val];
                }
                return val;
            }
        });
        //console.log(JSON.stringify(result,null,4));
        //console.log(JSON.stringify(resultMap,null,4));
        expect(result).toEqual(expected);
        expect(resultMap).toEqual({
            "any_name": [
                "",
                ""
            ],
            "person": [
                "start",
                "middle",
                "end"
            ],
            "name1": [
                "Jack 1"
            ],
            "name2": [
                "35"
            ]
        });
    });

    it("result should have no value if tag processor returns nothing", function() {
        const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                start
                <name1>Jack 1</name1 >
                middle
                <name2>35</name2>
                end
            </person>
        </any_name>`;

        const expected = {
            "any_name": {
                "person": {
                    "name1": "",
                    "name2": ""
                }
            }
        };

        const result = parser.parse(xmlData, {
            tagValueProcessor: (val, tagName) => {
            }
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("result should have constant value returned by tag processor", function() {
        const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                <name1>Jack 1</name1 >
                <name2>35</name2>
            </person>
        </any_name>`;

        const expected = {
            "any_name": {
                "#text" : "fxpfxp",
                "person": {
                    "#text" : "fxpfxpfxp",
                    "name1": "fxp",
                    "name2": "fxp"
                }
            }
        };

        const result = parser.parse(xmlData, {
            tagValueProcessor: (val, tagName) => {
                return "fxp"
            }
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
});