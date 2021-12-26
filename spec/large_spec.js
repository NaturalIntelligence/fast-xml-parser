"use strict";

import {XMLParser, XMLValidator} from "../src/fxp.js";
import {expect} from "chai";
import * as fs from "fs";
import * as path from "path";

describe("XMLParser", function() {
    it("should validate big XML file", function() {
        this.timeout(5000);
        const fileNamePath = path.resolve("./spec/assets/large.xml");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = XMLValidator.validate(svgData);
        expect(result).to.be.true;
    });
});
