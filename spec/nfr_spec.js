
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
});