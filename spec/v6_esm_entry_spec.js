import { XMLParser } from "fast-xml-parser/v6";

describe("ESM v6 entry", function() {
  it("should import and parse", function() {
    const parser = new XMLParser();
    const result = parser.parse("<root>1</root>");
    expect(result).toEqual({ root: 1 });
  });
});
