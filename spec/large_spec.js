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
    // 5.5.11's tagExpWithClosingIndex accumulated char codes into an array and
    // returned via String.fromCharCode(...chars). For a tag expression large
    // enough, the spread exceeds V8's argument-count limit and surfaces as
    // "RangeError: Maximum call stack size exceeded".
    it("should parse a tag with a very long attribute value without stack overflow", function() {
        const longValue = "x".repeat(200000);
        const xmlData = `<root><item attr="${longValue}"/></root>`;

        const parser = new XMLParser({ ignoreAttributes: false });
        let result;
        expect(() => { result = parser.parse(xmlData); }).not.toThrow();
        expect(result.root.item["@_attr"]).toBe(longValue);
    });

    // Tabs inside quoted attribute values must be preserved verbatim.
    // Only tabs outside quoted attributes (between attributes) are
    // normalised to spaces. The spacing between attributes is
    // implementation detail and is not asserted here.
    it("should preserve tab characters inside quoted attribute values", function() {
        const xmlData = '<root><item a="x\ty"/></root>';

        const parser = new XMLParser({ ignoreAttributes: false });
        const result = parser.parse(xmlData);
        expect(result.root.item["@_a"]).toBe("x\ty");
    });
});
