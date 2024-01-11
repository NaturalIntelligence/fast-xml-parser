"use strict";

const {XMLParser} = require("../src/fxp");

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
});
