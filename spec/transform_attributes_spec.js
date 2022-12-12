"use strict";

const {XMLParser} = require("../src/fxp");

describe("XMLParsers", function() {
    it("should transform attribute names", function() {
        const xmlData = `<?xml version='1.0'?>
          <root>
            <person title="1">Person 1</person>
            <person tITle="2">Person 2</Person>
            <person hello:TItle="3">Person 3</PERSON>
            <person hElLO:TITLE="4">Person 4</person>
          </root>
        `;

        const parser = new XMLParser({
            ignoreAttributes: false,
            ignoreDeclaration: true,
            attributeNamePrefix: "",
            attributesGroupName: "attributes",
            transformTagName: (tag) => tag.toLowerCase(),
            transformAttributeName: (attr) => attr.toLowerCase()
        });
        let result = parser.parse(xmlData);

        const expected = {
            "root": {
                "person": [
                    { attributes: { title: "1" }, "#text": "Person 1" },
                    { attributes: { title: "2" }, "#text": "Person 2" },
                    { attributes: { "hello:title": "3" }, "#text": "Person 3" },
                    { attributes: { "hello:title": "4" }, "#text": "Person 4" }
                ]
            }
        };

        expect(result).toEqual(expected);
    });
});
