var validator = require("../bin/validator");

describe("XMLParser", function () {

      it("should validate big XML file", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/large.xml");
        var svgData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(svgData);
        expect(result).toBe(true);
      });
});