"use strict";

const {XMLParser, XMLValidator} = require("../src/fxp");
const he = require("he");

describe("XMLParser", function() {

    it("should decode HTML entities if allowed", function() {
        const xmlData = "<rootNode>       foo&ampbar&apos;        </rootNode>";
        const expected = {
            "rootNode": "foo&bar'"
        };

        const options = {
            parseTagValue: false,
            decodeHTMLchar: true,
            tagValueProcessor : (name,a) => he.decode(a)
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should decode HTML entities / char", function() {
        const xmlData = `<element id="7" data="foo bar" bug="foo&ampbar&apos;"/>`;
        const expected = {
            "element": {
                "id":   7,
                "data": "foo bar",
                "bug":  "foo&ampbar'"
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            decodeHTMLchar:      true,
            attributeValueProcessor: (name, a) => he.decode(a, {isAttributeValue: true})
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("tag value processor should be called with value and tag name", function() {
        const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                start
                <name1>Jack 1</name1 >
                middle
                <name2>35</name2>
                end
            </person>
        </any_name>`;

        const expected = {
            "?xml": '',
            "any_name": {
                "person": {
                    "#text": "startmiddleend",
                    "name1": "Jack 1",
                    "name2": 35
                }
            }
        };

        const resultMap = {}
        const options = {
            tagValueProcessor: (tagName, val) => {
                if(resultMap[tagName]){
                    resultMap[tagName].push(val)
                }else{
                    resultMap[tagName] = [val];
                }
                return val;
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        // console.log(JSON.stringify(resultMap,null,4));
        expect(result).toEqual(expected);
        expect(resultMap).toEqual({
            "person": [
                "start",
                "middle",
                "end"
            ],
            "name1": [
                "Jack 1"
            ],
            "name2": [
                "35"
            ]
        });
    });

    it("result should not change/parse values if tag processor returns nothing", function() {
        const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                start
                <name1>Jack 1</name1 >
                middle
                <name2>35</name2>
                end
            </person>
        </any_name>`;

        const expected = {
            "?xml": '',
            "any_name": {
                "person": {
                    "name1": "Jack 1",
                    "name2": "35",
                    "#text": "startmiddleend"
                }
            }
        }
        
        const options = {
            tagValueProcessor: (tagName, val) => {}          
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("result should have constant value returned by tag processor", function() {
        const xmlData = `<?xml version='1.0'?>
        <any_name>
            <person>
                <name1>Jack 1</name1 >
                <name2>35</name2>
            </person>
        </any_name>`;

        const expected = {
            "?xml": '',
            "any_name": {
                "person": {
                    "name1": "fxp",
                    "name2": "fxp"
                }
            }
        };

        const options = {
            tagValueProcessor: (tagName, val) => {
                return "fxp"
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("attribute parser should be called with  atrribute name and value", function() {
        const xmlData = `<element id="7" data="foo bar" bug="foo n bar"/>`;
        const expected = {
            "element": {
                "id":   7,
                "data": "foo bar",
                "bug":  "foo n bar"
            }
        };

        const resultMap = {}

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            decodeHTMLchar:      true,
            attributeValueProcessor: (name, val) => {
                if(resultMap[name]){
                    resultMap[name].push(val)
                }else{
                    resultMap[name] = [val];
                }
                return val;
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(resultMap,null,4));
        expect(result).toEqual(expected);

        expect(resultMap).toEqual({
            "id": [
                "7"
            ],
            "data": [
                "foo bar"
            ],
            "bug": [
                "foo n bar"
            ]
        });
    });

    it("should call tagValue processor without CDATA with correct parameters", function() {

        const expectedValues = [
            "a wow root.a true true",
            "a text root.a false true",
            "a after root.a true false",
            "a wow again root.a true false",
            "c unlimited root.a.c true true",
            "b wow phir se root.b true true",
        ];

        const XMLdata = `
        <root a="nice" checked>
          <a a="2" >wow</a>
          <a a="2" ><![CDATA[text]]>after </a>
          <a a="2" >
            wow again
            <c a="2" > unlimited </c>
          </a>
          <b a="2" >wow phir se</b>
      </root>`;
  
      const tagValueProcessorCalls = [];
      const options = {
        ignoreAttributes: false,
        preserveOrder: true,
        tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
        //   console.log(tagName, tagValue, jPath, hasAttributes, isLeafNode);
        tagValueProcessorCalls.push(`${tagName} ${tagValue} ${jPath} ${hasAttributes} ${isLeafNode}`);
          // if(isLeafNode) return tagValue;
          // else return "";
          return tagValue;
        }
      }
      const parser = new XMLParser(options);
      let result = parser.parse(XMLdata);
    //   console.log(JSON.stringify(result, null,4));
    
    expect(tagValueProcessorCalls).toEqual(expectedValues);
    });
    
    // it("should call tagValue processor with CDATA with correct parameters", function() {

    //     const expectedValues = [
            
    //         "a wow root.a true true",
    //         "#CDATA text root.a.#CDATA false true",
    //         "a after root.a true false",
    //         "a wow again root.a true false",
    //         "c unlimited root.a.c true true",
    //         "b wow phir se root.b true true",
    //     ];

    //     const XMLdata = `
    //     <root a="nice" checked>
    //       <a a="2" >wow</a>
    //       <a a="2" ><![CDATA[text]]>after </a>
    //       <a a="2" >
    //         wow again
    //         <c a="2" > unlimited </c>
    //       </a>
    //       <b a="2" >wow phir se</b>
    //   </root>`;
  
    //   const tagValueProcessorCalls = [];
    //   const options = {
    //     ignoreAttributes: false,
    //     preserveOrder: true,
    //     cdataPropName: "#CDATA",
    //     tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
    //     //   console.log(tagName, tagValue, jPath, hasAttributes, isLeafNode);
    //     tagValueProcessorCalls.push(`${tagName} ${tagValue} ${jPath} ${hasAttributes} ${isLeafNode}`);
    //       // if(isLeafNode) return tagValue;
    //       // else return "";
    //       return tagValue;
    //     }
    //   }
    //   const parser = new XMLParser(options);
    //   let result = parser.parse(XMLdata);
    // //   console.log(JSON.stringify(result, null,4));
  
    //   expect(tagValueProcessorCalls).toEqual(expectedValues);
    // });

    it("should call tagValue processor for whitespace only values but not empty when trimValues:false", function() {

        const expectedValues = [
            "root    root true false"
        ];

        const XMLdata = `<root a="nice" checked>  <a a="2" ></a></root>`;
  
      const tagValueProcessorCalls = [];
      const options = {
        ignoreAttributes: false,
        preserveOrder: true,
        cdataPropName: "#CDATA",
        tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
        //   console.log(tagName, tagValue, jPath, hasAttributes, isLeafNode);
        tagValueProcessorCalls.push(`${tagName} ${tagValue} ${jPath} ${hasAttributes} ${isLeafNode}`);
          // if(isLeafNode) return tagValue;
          // else return "";
          return tagValue;
        },
        trimValues: false
      }
      const parser = new XMLParser(options);
      let result = parser.parse(XMLdata);
    //   console.log(JSON.stringify(result, null,4));
  
      expect(tagValueProcessorCalls).toEqual(expectedValues);
    });
});