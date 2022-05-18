"use strict";

const {XMLParser, XMLValidator} = require("../src/fxp");
const he = require("he");

describe("XMLParser StopNodes", function() {
    it("1a. should support single stopNode", function() {
        const xmlData = `<issue><title>test 1</title><fix1><p>p 1</p><div class="show">div 1</div></fix1></issue>`;
        const expected = {
            "issue": {
                "title": "test 1",
                "fix1": "<p>p 1</p><div class=\"show\">div 1</div>"
            }
        };

        const options = {
          attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            stopNodes: ["issue.fix1"]
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("1b. 3. should support more than one stopNodes, with or without attr", function() {
        const xmlData = `<issue><title>test 1</title><fix1 lang="en"><p>p 1</p><div class="show">div 1</div></fix1><fix2><p>p 2</p><div class="show">div 2</div></fix2></issue>`;
        const expected = {
            "issue": {
              "title": "test 1",
              "fix1": {
                "#text": "<p>p 1</p><div class=\"show\">div 1</div>",
                "lang": "en"
              },
              "fix2": "<p>p 2</p><div class=\"show\">div 2</div>"
            }
        };

        const options = {
          attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            stopNodes: ["issue.fix1", "issue.fix2"]
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

  it("1c. have two stopNodes, one within the other", function() {
    const xmlData = `<issue><title>test 1</title><fix1 lang="en"><p>p 1</p><fix2><p>p 2</p><div class="show">div 2</div></fix2><div class="show">div 1</div></fix1></issue>`;
    const expected = {
      "issue": {
        "title": "test 1",
        "fix1": {
          "#text": "<p>p 1</p><fix2><p>p 2</p><div class=\"show\">div 2</div></fix2><div class=\"show\">div 1</div>",
          "lang": "en"
        }
      }
    };

    const options = {
      attributeNamePrefix: "",
        ignoreAttributes:    false,
        parseAttributeValue: true,
        stopNodes: ["issue.fix1", "issue.fix2"]
  };
  const parser = new XMLParser(options);
  let result = parser.parse(xmlData);

    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

    result = XMLValidator.validate(xmlData);
    expect(result).toBe(true);
  });

    it("2a. stop node has nothing in it", function() {
        const xmlData = `<issue><title>test 1</title><fix1></fix1></issue>`;
        const expected = {
            "issue": {
				"title": "test 1",
				"fix1": ""
			}
        };

        const options = {
          attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            stopNodes: ["issue.fix1", "issue.fix2"]
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("2b. stop node is self-closing", function() {
      const xmlData = `<issue><title>test 1</title><fix1/></issue>`;
      const expected = {
        "issue": {
          "title": "test 1",
          "fix1": ""
        }
      };

      const options = {
        attributeNamePrefix: "",
          ignoreAttributes:    false,
          parseAttributeValue: true,
          stopNodes: ["issue.fix1", "issue.fix2"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);

      //console.log(JSON.stringify(result,null,4));
      expect(result).toEqual(expected);

      result = XMLValidator.validate(xmlData);
      expect(result).toBe(true);
    });

    it("5. stopNode at root level", function() {
        const xmlData = `<fix1><p>p 1</p><div class="show">div 1</div></fix1>`;
        const expected = {
            "fix1": "<p>p 1</p><div class=\"show\">div 1</div>"
        };

        const options = {
          attributeNamePrefix: "",
            ignoreAttributes:    false,
            stopNodes: ["fix1", "fix2"]
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).toBe(true);
    });
    
    it("should skip all nodes of given name irrespective of their level", function() {
        const xmlData = `
        <root>
          <fix1>
            <p>p 1</p>
            <div class="show">div 1</div>
          </fix1>
          <another>
            <fix1>
              <nested>str</nested>
            </fix1>
          </another>
        </root>`;
        const expected = {
          "root": {
              "fix1": "\n            <p>p 1</p>\n            <div class=\"show\">div 1</div>\n          ",
              "another": {
                  "fix1": "\n              <nested>str</nested>\n            "
              }
          }
      };

        const options = {
          attributeNamePrefix: "",
            ignoreAttributes:    false,
            stopNodes: ["*.fix1", "fix2"]
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).toBe(true);
    });

    it("should call tagValueProcessor for stop Node", function() {
      const XMLdata = `
      <products capture-installed="true">
      <script/>
      <product>
      <pid>8</pid>
      <modelno>6273033</modelno>
      <name>
      <![CDATA[ Big Red Truck ]]>
      </name>
      <category>
      <![CDATA[ Toys]]>
      </category>
      <currency>USD</currency>
      <price>
        <actualprice>19.20</actualprice>
      </price>
    </product>
      `;
  
      const expected = {
            "products": {
                "script": "",
                "product": {
                    "pid": "8",
                    "modelno": "6273033",
                    "name": " Big Red Truck ",
                    "category": " Toys",
                    "currency": "USD",
                    "price": "19.20"
                }
            }
        };
    
        const options = {
          ignoreAttributes: true,
          stopNodes: [
            "products.product.price"
          ],
          tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
            if(jPath === 'products.product.price'){
              // console.log(tagName, tagValue, jPath, hasAttributes, isLeafNode);
              return /([0-9]+\.[0-9]+)/.exec(tagValue)[1]
            }
          },
          // preserveOrder: true,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));
  
        expect(expected).toEqual(result);
  });

  it("should skip self-closing stop nodes", function() {
      const XMLdata = `<root><foo name="bar"></foo><bar name="bar"/></root>`;
  
      const expected = [{
          root: [
            { foo: [ { '#text': '' } ] },
            { bar: [ { '#text': '' } ] }
          ]
      }];
    
        const options = {
          // ignoreAttributes: true,
          stopNodes: ["*.foo", "*.bar"],
          preserveOrder: true,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));
  
        expect(expected).toEqual(result);
  });
  it("should skip unpaired stop nodes", function() {
      const XMLdata = `<root><foo name="bar"></foo><bar name="bar"></root>`;
  
      const expected = [{
          root: [
            { foo: [ { '#text': '' } ] },
            { bar: [ { '#text': '' } ] }
          ]
      }];
    
        const options = {
          // ignoreAttributes: true,
          stopNodes: ["*.foo", "*.bar"],
          unpairedTags: ["bar"],
          preserveOrder: true,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));
  
        expect(expected).toEqual(result);
  });

  it("should not incorrectly close the stop node if the same tag name appears inside", function() {
        const xmlData = `<issue><title>test 1</title><fix1><p>p 1</p><div class="show">div 1</div><other><fix1>more</fix1></other></fix1><last>something</last></issue>`;
        const expected = {
          issue: {
            title: 'test 1',
            fix1: '<p>p 1</p><div class="show">div 1</div><other><fix1>more</fix1></other>',
            last: 'something'
          },
        };

        const options = {
          attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            stopNodes: ["issue.fix1"]
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
  });
});
