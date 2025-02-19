const {XMLParser,XMLValidator, XMLBuilder} = require("fast-xml-parser");

describe("XMLParser", function() {
  it("should import v5", function() {
    const parser = new XMLParser();
    parser.parse("<a></a>");
    XMLValidator.validate("<a></a>");
    XMLBuilder.build({a:""})
  });
});