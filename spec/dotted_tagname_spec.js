"use strict";

import { XMLParser } from "../src/fxp.js";

describe("XMLParser with dotted tag names", function () {

  it("should correctly parse tags containing dots", function () {
    const xmlData = `<root>
      <catalog>
        <product>
          <vendor.name>Acme Corp</vendor.name>
          <vendor.country>US</vendor.country>
        </product>
      </catalog>
    </root>`;

    const expected = {
      "root": {
        "catalog": {
          "product": {
            "vendor.name": "Acme Corp",
            "vendor.country": "US"
          }
        }
      }
    };

    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse nested dotted tag names", function () {
    const xmlData = `<root><a.b><c.d>val</c.d></a.b></root>`;

    const expected = {
      "root": {
        "a.b": {
          "c.d": "val"
        }
      }
    };

    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse tag names with multiple dots", function () {
    const xmlData = `<root><a.b.c>val</a.b.c></root>`;

    const expected = {
      "root": {
        "a.b.c": "val"
      }
    };

    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse self-closing tags with dots", function () {
    const xmlData = `<root><a.b/></root>`;

    const expected = {
      "root": {
        "a.b": ""
      }
    };

    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse dotted tags with attributes", function () {
    const xmlData = `<root><a.b id="1">val</a.b></root>`;

    const expected = {
      "root": {
        "a.b": {
          "#text": "val",
          "@_id": "1"
        }
      }
    };

    const parser = new XMLParser({ ignoreAttributes: false });
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse repeated dotted tags without jPath accumulation", function () {
    const xmlData = '<root>' + '<item><a.b>x</a.b></item>'.repeat(100) + '</root>';

    const parser = new XMLParser();
    const result = parser.parse(xmlData);

    expect(result.root.item.length).toBe(100);
    for (const item of result.root.item) {
      expect(item["a.b"]).toBe("x");
    }
  });

  it("should correctly parse dotted tags with preserveOrder", function () {
    const xmlData = `<root><a.b>val</a.b></root>`;

    const parser = new XMLParser({ preserveOrder: true });
    const result = parser.parse(xmlData);

    expect(result[0]["root"][0]["a.b"][0]["#text"]).toBe("val");
  });

  it("should correctly handle dotted tags mixed with normal tags", function () {
    const xmlData = `<root>
      <normal>text</normal>
      <dotted.tag>value</dotted.tag>
      <another>text2</another>
    </root>`;

    const expected = {
      "root": {
        "normal": "text",
        "dotted.tag": "value",
        "another": "text2"
      }
    };

    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse dotted tags with unpaired tags", function () {
    const xmlData = `<root>
      <a.b>val</a.b>
      <br>
      <c.d>val2</c.d>
    </root>`;

    const expected = {
      "root": {
        "a.b": "val",
        "br": "",
        "c.d": "val2"
      }
    };

    const parser = new XMLParser({ unpairedTags: ["br"] });
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should correctly parse dotted tags with stopNodes", function () {
    const xmlData = `<root><a.b><p>raw</p></a.b></root>`;

    const expected = {
      "root": {
        "a.b": "<p>raw</p>"
      }
    };

    const parser = new XMLParser({ stopNodes: ["root.a.b"] });
    const result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should not degrade to O(n²) with many dotted tags", function () {
    const n = 5000;
    const xml = '<root>' + '<item><a.b>x</a.b></item>'.repeat(n) + '</root>';

    const parser = new XMLParser();
    const start = performance.now();
    parser.parse(xml);
    const elapsed = performance.now() - start;

    // With the bug, this would take many seconds due to O(n²) jPath growth.
    // With the fix, this should complete well under 2 seconds.
    expect(elapsed).toBeLessThan(2000);
  });
});
