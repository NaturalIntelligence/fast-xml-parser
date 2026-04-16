"use strict";

import {XMLParser, XMLValidator} from "../src/fxp.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);

// Derive the directory name
const __dirname = dirname(__filename);

describe("XMLParser", function() {
    it("should validate big XML file", function() {
        const fileNamePath = path.join(__dirname, "assets/large.xml");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = XMLValidator.validate(svgData);
        expect(result).toBe(true);
    });

    // Regression for https://github.com/NaturalIntelligence/fast-xml-parser/issues/817
    // Introduced in 5.5.11 by tagExpWithClosingIndex: char codes were accumulated
    // into an array and returned via `String.fromCharCode(...chars)`. For a tag
    // expression large enough, the spread exceeds V8's argument-count limit and
    // surfaces as "RangeError: Maximum call stack size exceeded".
    it("should parse a tag with a very long attribute value without stack overflow", function() {
        const longValue = "x".repeat(200000);
        const xmlData = `<root><item attr="${longValue}"/></root>`;

        const parser = new XMLParser({ ignoreAttributes: false });
        let result;
        expect(() => { result = parser.parse(xmlData); }).not.toThrow();
        expect(result.root.item["@_attr"]).toBe(longValue);
    });
});
