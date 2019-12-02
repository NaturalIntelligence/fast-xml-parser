"use strict";

const validator = require("../src/validator");

describe("XMLParser", function() {
    it("should validate big XML file", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/large.xml");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = validator.validate(svgData);
        expect(result).toBe(true);
    });

    it("should not validate big XML file with duplicate root node", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/large_duplicate_root.xml");
        const fileContent = fs.readFileSync(fileNamePath).toString();

        const expected = { code: "InvalidXml", msg: 'Multiple possible root nodes found.', line: 49};
        var result = validator.validate(fileContent).err;
        expect(result).toEqual(expected);
    });

});
