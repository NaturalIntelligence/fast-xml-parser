"use strict";

const parser = require("../src/parser");
const validator = require("../src/validator");
const he = require("he");

describe("XMLParser", function() {
    
    it("should parse attributes having '>' in value", function() {
        const xmlData = `<? xml version = "1.0" encoding = "UTF - 8" ?>
        <testStep type="restrequest" name="test step name (bankId -> Error)" id="90e453d3-30cd-4958-a3be-61ecfe7a7cbe">
              <settings/>
              <encoding>UTF-8</encoding>
        </testStep>`;

        const expected = {
            "testStep": {
                "type": "restrequest",
                "name":       "test step name (bankId -> Error)",
                "id":     "90e453d3-30cd-4958-a3be-61ecfe7a7cbe",
                "settings": "",
                "encoding": "UTF-8"
            }
        };

        let result = parser.parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            //parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse attributes with valid names", function() {
        const xmlData = `
        <a>
            <bug atr="sasa" boolean>val
                <b/>
                <br/>
                <br b/>
                <c>some<!--single line comment--></c>here
            </bug>as well
        </a>`;

        const expected = {
            "a": {
                "#text": "as well",
                "bug": {
                    "#text": "valhere",
                    "@_atr": "sasa",
                    "@_boolean": true,
                    "b": "",
                    "br": [
                        "",
                        {
                            "@_b": true
                        }
                    ],
                    "c": "some"
                }
            }
        };

        let result = parser.parse(xmlData, {
            //attributeNamePrefix: "",
            ignoreAttributes:    false,
            //parseAttributeValue: true,
            allowBooleanAttributes: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
});