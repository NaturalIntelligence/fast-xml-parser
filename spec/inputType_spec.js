"use strict";

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);

// Derive the directory name
const __dirname = dirname(__filename);

import { XMLParser } from "../src/fxp.js";

describe("XMLParser", function () {

    it("should decode UTF-8 Uint8Array input", function () {
        const xmlData = new TextEncoder().encode("<root>caf\u00e9 \ud83e\uddea</root>");
        const parser = new XMLParser();
        expect(parser.parse(xmlData)).toEqual({ root: "caf\u00e9 \ud83e\uddea" });
    });

    it("should decode only the selected Uint8Array view", function () {
        const bytes = new TextEncoder().encode("junk<root>value</root>junk");
        const parser = new XMLParser();
        expect(parser.parse(bytes.subarray(4, bytes.length - 4))).toEqual({ root: "value" });
    });

    it("should validate decoded Uint8Array input", function () {
        const xmlData = new TextEncoder().encode("<root>value</root>");
        const parser = new XMLParser();
        expect(parser.parse(xmlData, true)).toEqual({ root: "value" });
    });

    it("should reject invalid XML in Uint8Array input during validation", function () {
        const xmlData = new TextEncoder().encode("<root>value</other>");
        const parser = new XMLParser();
        expect(() => parser.parse(xmlData, true)).toThrowError(/Expected closing tag/);
    });

    it("should preserve node order for Uint8Array input", function () {
        const xmlData = "<root><a>1</a><b>2</b><a>3</a></root>";
        const parser = new XMLParser({ preserveOrder: true });
        expect(parser.parse(new TextEncoder().encode(xmlData))).toEqual(parser.parse(xmlData));
    });

    it("should parse UTF-8 Buffer input", function () {
        const xmlData = Buffer.from("<root>caf\u00e9 \ud83e\uddea</root>");
        const parser = new XMLParser();
        expect(parser.parse(xmlData)).toEqual({ root: "caf\u00e9 \ud83e\uddea" });
    });

    it("should parse when Buffer is given as input", function () {

        const fileNamePath = path.join(__dirname, "assets/mini-sample.xml");
        const xmlData = fs.readFileSync(fileNamePath);

        const expected = {
            "?xml": '',
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

    // xit("should not parse when invalid value is given", function() {
    //     const parser = new XMLParser();
    //     const result = parser.parse(23);
    //     // console.log(result)
    //     expect(result).toEqual({});
    // });

    // xit("should not parse when invalid value is given", function() {
    //     const parser = new XMLParser();
    //     const result = parser.parse([]);
    //     // console.log(result)
    //     expect(result).toBeUndefined();
    // });

    // xit("should not parse when invalid value is given", function() {
    //     const parser = new XMLParser( { preserveOrder: true});
    //     const result = parser.parse([]);
    //     expect(result).toBeUndefined();
    // });

    // xit("should not parse when null", function() {
    //     const parser = new XMLParser( { preserveOrder: true});
    //     expect(() => {
    //         parser.parse(null);
    //         // console.log(result);
    //     }).toThrowError("Cannot read properties of null (reading 'toString')");
    // });

    // xit("should not parse when undefined", function() {
    //     const parser = new XMLParser( { preserveOrder: true});
    //     expect(() => {
    //         parser.parse();
    //         // console.log(result);
    //     }).toThrowError("Cannot read properties of undefined (reading 'toString')");
    // });


});
