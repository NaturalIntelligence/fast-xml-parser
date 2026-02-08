
import XMLParser from "../../src/v6/XMLParser.js";
import JsObjOutputBuilder from "../../src/v6/OutputBuilders/JsObjBuilder.js";
import numberParser from "../../src/v6/valueParsers/number.js";

describe("XMLParser v6", function () {

  it("should parse all values as string, int, boolean, float, hexadecimal", function () {
    const xmlData = `<rootNode>
        <tag>value</tag>
        <boolean>true</boolean>
        <intTag>045</intTag>
        <floatTag>65.34</floatTag>
        <hexadecimal>0x15</hexadecimal>
        </rootNode>`;
    const expected = {
      "rootNode": {
        "tag": "value",
        "boolean": true,
        "intTag": 45,
        "floatTag": 65.34,
        "hexadecimal": 21
      }
    };

    const parser = new XMLParser();
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse only true numbers", function () {
    const xmlData = `<rootNode>
        <tag>value</tag>
        <boolean>true</boolean>
        <intTag>045</intTag>
        <floatTag>65.340</floatTag>
        <long>420926189200190257681175017717</long>
        </rootNode>`;
    const expected = {
      "rootNode": {
        "tag": "value",
        "boolean": true,
        "intTag": "045",
        "floatTag": 65.34,
        "long": 4.209261892001902e+29
      }
    };

    const options = {
      tags: {
        valueParsers: [
          "boolean",
          new numberParser({
            hex: true,
            leadingZeros: false,
            eNotation: true
          })
        ]
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse number ending in .0 for parseTrueNumberOnly:false", function () {
    const xmlData = `<rootNode>
        <floatTag0>0.0</floatTag0>
        <floatTag1>1.0</floatTag1>
        <floatTag2>2.0000</floatTag2>
        <floatTag3 float="3.00"/>
        </rootNode>`;
    const expected = {
      "rootNode": {
        "floatTag0": 0,
        "floatTag1": 1,
        "floatTag2": 2,
        "floatTag3": {
          "@_float": 3
        }
      }
    };

    const options = {
      attributes: {
        ignore: false,
        valueParsers: ["number"] // parse attributes as numbers
      },
      tags: {
        valueParsers: [
          new numberParser({
            leadingZeros: false
          })
        ]
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should not parse values to primitive type", function () {
    const xmlData = `<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>`;
    const expected = {
      "rootNode": {
        "tag": "value",
        "boolean": "true",
        "intTag": "045",
        "floatTag": "65.34"
      }
    };

    const options = {
      tags: {
        valueParsers: [] // No value parsers
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse number values of attributes as number", function () {
    const xmlData = `<rootNode><tag int='045' intNegative='-045' float='65.34' floatNegative='-65.34'>value</tag></rootNode>`;
    const expected = {
      "rootNode": {
        "tag": {
          "#text": "value",
          "@_int": 45,
          "@_intNegative": -45,
          "@_float": 65.34,
          "@_floatNegative": -65.34
        }
      }
    };

    const options = {
      attributes: {
        ignore: false,
        valueParsers: ["number"]
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should skip tag arguments", function () {
    const xmlData = `<rootNode><tag ns:arg='value'>value</tag><intTag ns:arg='value' ns:arg2='value2' >45</intTag><floatTag>65.34</floatTag></rootNode>`;
    const expected = {
      "rootNode": {
        "tag": "value",
        "intTag": 45,
        "floatTag": 65.34
      }
    };

    const options = {
      attributes: {
        ignore: true // skip attributes
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should ignore namespace and text node attributes", function () {
    const xmlData = `\
<root:node>
    <tag ns:arg='value'>value</tag>
    <intTag ns:arg='value' ns:arg2='value2' >45</intTag>
    <floatTag>65.34</floatTag>
    <nsTag xmlns:tns-ns='urn:none' tns-ns:attr='tns'></nsTag>
    <nsTagNoAttr xmlns:tns-ns='urn:none'></nsTagNoAttr>
</root:node>`;

    const expected = {
      "node": {
        "tag": {
          "@_arg": "value",
          "#text": "value"
        },
        "intTag": {
          "@_arg": "value",
          "@_arg2": "value2",
          "#text": 45
        },
        "floatTag": 65.34,
        "nsTag": {
          "@_attr": "tns"
          //"#text": ""
        },
        "nsTagNoAttr": ""
      }
    };

    const options = {
      removeNSPrefix: true,
      attributes: {
        ignore: false
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    expect(result).toEqual(expected);
  });

  it("should parse empty text Node", function () {
    const xmlData = `<rootNode><tag></tag></rootNode>`;
    const expected = {
      "rootNode": {
        "tag": ""
      }
    };

    const parser = new XMLParser();
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse self closing tags", function () {
    const xmlData = "<rootNode><tag ns:arg='value'/></rootNode>";
    const expected = {
      "rootNode": {
        "tag": {
          "@_ns:arg": "value"
        }
      }
    };

    const options = {
      attributes: {
        ignore: false
      }
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

    expect(result).toEqual(expected);
  });

  it("should parse repeated nodes in array", function () {
    const xmlData = `\
<rootNode>
    <tag>value</tag>
    <tag>45</tag>
    <tag>65.34</tag>
</rootNode>`;
    const expected = {
      "rootNode": {
        "tag": ["value", 45, 65.34]
      }
    };

    const parser = new XMLParser();
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse nested nodes in nested properties", function () {
    const xmlData = `\
<rootNode>
    <parenttag>
        <tag>value</tag>
        <tag>45</tag>
        <tag>65.34</tag>
    </parenttag>
</rootNode>`;
    const expected = {
      "rootNode": {
        "parenttag": {
          "tag": ["value", 45, 65.34]
        }
      }
    };

    const parser = new XMLParser();
    let result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

});
