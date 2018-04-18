const fs = require("fs");
const path = require("path");
const {validate} = require("../parser");

describe("XMLParser", function() {
    it("should validate big XML file", function() {
        this.slow(60000);
        this.timeout(180000);
        const fileNamePath = path.join(__dirname, "assets/large.xml");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = validate(svgData);
        expect(result).equal(true);
    });
});
