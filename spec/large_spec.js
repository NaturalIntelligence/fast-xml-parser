"use strict";

const {XMLParser, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {
    it("should validate big XML file", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/large.xml");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = XMLValidator.validate(svgData);
        expect(result).toBe(true);
    });
});
