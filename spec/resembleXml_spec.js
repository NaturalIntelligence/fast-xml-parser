"use strict";

const parser = require("../src/parser");
const validator = require("../src/validator");
const he = require("he");

describe("XMLParser", function() {
    it("1. support parsing from xml to json with resembleXml mode", function() {
        const xmlData = `<issue i1="i1v"><title t1="t1v">test 1</title></issue>`;
        const expected = {
          "nodeName": "issue",
          "attr": {
            "i1": "i1v"
          },
          "children": [
            {
              "nodeName": "title",
              "attr": {
                "t1": "t1v"
              },
              "val": "test 1"
            }
          ]
        };

        let result = parser.parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            attrNodeName: "attr",
            parseAttributeValue: true,
            resembleXml: true
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
        });

  it("2. support parsing from xml to json with resembleXml mode and stopNode", function() {
    const xmlData = `<issue><title>test 1</title><fix1><p>p 1</p><div class="show">div 1</div></fix1></issue>`;
    const expected = {
      "nodeName": "issue",
      "children": [
        {
          "nodeName": "title",
          "val": "test 1"
        },
        {
          "nodeName": "fix1",
          "val": "<p>p 1</p><div class=\"show\">div 1</div>"
        }
      ]
    };

    let result = parser.parse(xmlData, {
      attributeNamePrefix: "",
      ignoreAttributes:    false,
      parseAttributeValue: true,
      resembleXml: true,
      stopNodes: ["fix1"]
    });

    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = validator.validate(xmlData);
    expect(result).toBe(true);
  });

  it("3. parse from xml to json and back to xml", function() {
    const xmlData = `<issue i1="i1v"><title t1="t1v">test 1</title></issue>`;
    const expected = {
      "nodeName": "issue",
      "attr": {
        "i1": "i1v"
      },
      "children": [
        {
          "nodeName": "title",
          "attr": {
            "t1": "t1v"
          },
          "val": "test 1"
        }
      ]
    };

    let result = parser.parse(xmlData, {
      attributeNamePrefix: "",
      ignoreAttributes:    false,
      attrNodeName: "attr",
      parseAttributeValue: true,
      resembleXml: true
    });
    var defaultOptions = {
      resembleXml: true
    }
    var j2xParser = new parser.j2xParser(defaultOptions)
    var xml = j2xParser.parse(result);
    //console.log(xml);
    expect(xml).toEqual(xmlData);
  });
});
