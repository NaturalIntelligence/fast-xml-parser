
import { XMLParser, XMLBuilder, XMLValidator } from "../src/fxp.js";

describe("XMLParser", function () {

  it("should process XML with js properties hasOwnProperty, toString", function () {
    const xmlData = `
        <root>
          <hasOwnProperty>1</hasOwnProperty>
          <constructor>1</constructor>
          <toString>2</toString>
        </root>
        `;
    const expected = {
      "root": {
        "hasOwnProperty": 1,
        "constructor": 1,
        "toString": 2
      }
    }
    const parser = new XMLParser();
    let result = parser.parse(xmlData);
    //   console.log(JSON.stringify(result, null,4));
    expect(result).toEqual(expected);
  });

  it("should throw error for deeply nested XML", function () {

    const depth = 102;
    const xmlData = '<a>'.repeat(depth) + 'x' + '</a>'.repeat(depth);

    const parser = new XMLParser();
    expect(() => parser.parse(xmlData)).toThrowError("Maximum nested tags exceeded");
  });
  it("should not throw error when max depth is not reached", function () {

    const depth = 100;
    const xmlData = '<a>'.repeat(depth) + 'x' + '</a>'.repeat(depth);

    const parser = new XMLParser({ maxNestedTags: 101 });
    parser.parse(xmlData);
  });
});