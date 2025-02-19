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
});
