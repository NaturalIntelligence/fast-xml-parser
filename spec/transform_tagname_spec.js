"use strict";

import {XMLParser} from "../src/fxp.js";

describe("XMLParser", function() {
    it("should parse lowercase tag names", function() {
        const xmlData = `<?xml version='1.0'?>
          <root>
            <person>Person 1</person>
            <Person>Person 2</Person>
            <PERSON>Person 3</PERSON>
            <person>Person 4</person>
          </root>
        `;

        const parser = new XMLParser({
            // transformTagName: (tagName) => tagName
            ignoreDeclaration: true,
            transformTagName: (tagName) => tagName.toLowerCase()
        });
        let result = parser.parse(xmlData);

        const expected = {
            "root": {
                "person": [
                    "Person 1",
                    "Person 2",
                    "Person 3",
                    "Person 4"
                ]
            }
        };

        expect(result).toEqual(expected);
    });
    it("should parse tag name with attributes", function() {
        const tagMap = { 'list-item': 'li' };
        const xmlData = `<?xml version="1.0"?>
            <root>
                <ul>
                    <list-item/>
                    <list-item>foo</list-item>
                    <list-item checked>bar</list-item>
                    <list-item attr="value">bar</list-item>
                </ul>
            </root>`
        const expected = {
    "?xml": {
        "@_version": "1.0"
    },
    "root": {
        "ul": {
            "li": [
                "",
                "foo",
                {
                    "#text": "bar",
                    "@_checked": true
                },
                {
                    "#text": "bar",
                    "@_attr": "value"
                }
            ]
        }
    }
}
        const options = {
                //preserveOrder: true,
                allowBooleanAttributes: true,
                ignoreAttributes: false,
                transformTagName: (tagName) => tagMap[tagName] ?? tagName,
        };
        const parser = new XMLParser(options);
        // console.log(JSON.stringify(parser.parse(xml)));
        
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

    });
        
});
