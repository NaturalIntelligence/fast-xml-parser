"use strict";

const {XMLParser, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should parse all values as string, int, boolean, float, hexadecimal", function() {
        const xmlData = `<rootNode>
        <tag>value</tag>
        <boolean>true</boolean>
        <intTag>045</intTag>
        <floatTag>65.34</floatTag>
        <hexadecimal>0x15</hexadecimal>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "boolean":  true,
                "intTag":   45,
                "floatTag": 65.34,
                "hexadecimal" : 21
            }
        };

        const parser = new XMLParser();
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });


    it("should parse only true numbers", function() {
        const xmlData = `<rootNode>
        <tag>value</tag>
        <boolean>true</boolean>
        <intTag>045</intTag>
        <floatTag>65.340</floatTag>
        <long>420926189200190257681175017717</long>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "boolean":  true,
                "intTag":   "045",
                "floatTag": 65.34,
                "long": 4.209261892001902e+29
            }
        };

        const options = {
            numberParseOptions: {
                leadingZeros: false
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
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
            ignoreAttributes: false,
            parseAttributeValue: true,
            numberParseOptions: {
                leadingZeros: false
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse number ending in .0 for parseTrueNumberOnly:true", function () {
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
            ignoreAttributes: false,
            parseAttributeValue: true,
            numberParseOptions: {
                leadingZeros: false
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });



    it("should not parse values to primitive type", function() {
        const xmlData = `<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "boolean":  "true",
                "intTag":   "045",
                "floatTag": "65.34"
            }
        };

        const options = {
            parseTagValue: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse number values of attributes as number", function() {
        const xmlData = `<rootNode><tag int='045' intNegative='-045' float='65.34' floatNegative='-65.34'>value</tag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag": {
                    "#text":   "value",
                    "@_int":   45,
                    "@_intNegative":   -45,
                    "@_float": 65.34,
                    "@_floatNegative": -65.34
                }
            }
        };

        const options = {
            ignoreAttributes:    false,
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse number values as number if flag is set", function() {
        const xmlData = `<rootNode><tag>value</tag><intTag>045</intTag><intTag>0</intTag><floatTag>65.34</floatTag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "intTag":   [45, 0],
                "floatTag": 65.34
            }
        };

        const options = {
            parseTagValue: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should skip tag arguments", function() {
        const xmlData = `<rootNode><tag ns:arg='value'>value</tag><intTag ns:arg='value' ns:arg2='value2' >45</intTag><floatTag>65.34</floatTag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "intTag":   45,
                "floatTag": 65.34
            }
        };

        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should ignore namespace and text node attributes", function() {
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
                "tag":         {
                    "@_arg": "value",
                    "#text": "value"
                },
                "intTag":      {
                    "@_arg":  "value",
                    "@_arg2": "value2",
                    "#text":  45
                },
                "floatTag":    65.34,
                "nsTag":       {
                    "@_attr": "tns"
                    //"#text": ""
                },
                "nsTagNoAttr": ""
            }
        };

        const options = {
            removeNSPrefix:  true,
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        expect(result).toEqual(expected);
    });

    it("should parse empty text Node", function() {
        const xmlData = `<rootNode><tag></tag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag": ""
            }
        };

        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse self closing tags", function() {
        const xmlData = "<rootNode><tag ns:arg='value'/></rootNode>";
        const expected = {
            "rootNode": {
                "tag": {
                    "@_ns:arg": "value"
                }
            }
        };
        
        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,2));
        expect(result).toEqual(expected);
    });

    it("should parse single self closing tag", function() {
        const xmlData = `<tag arg='value'/>`;
        const expected = {
            "tag": {
                "@_arg": "value"
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        expect(result).toEqual(expected);
    });

    it("should parse repeated nodes in array", function() {
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

        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse nested nodes in nested properties", function() {
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

        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse non-text nodes with value for repeated nodes", function() {
        const xmlData = `
<rootNode>
    <parenttag attr1='some val' attr2='another val'>
        <tag>value</tag>
        <tag attr1='val' attr2='234'>45</tag>
        <tag>65.34</tag>
    </parenttag>
    <parenttag attr1='some val' attr2='another val'>
        <tag>value</tag>
        <tag attr1='val' attr2='234'>45</tag>
        <tag>65.34</tag>
    </parenttag>
</rootNode>`;
        const expected = {
            "rootNode": {
                "parenttag": [
                    {
                        "@_attr1": "some val",
                        "@_attr2": "another val",
                        "tag":     [
                            "value",
                            {
                                "@_attr1": "val",
                                "@_attr2": "234",
                                "#text":   45
                            },
                            65.34
                        ]
                    }, {
                        "@_attr1": "some val",
                        "@_attr2": "another val",
                        "tag":     [
                            "value",
                            {
                                "@_attr1": "val",
                                "@_attr2": "234",
                                "#text":   45
                            },
                            65.34
                        ]
                    }
                ]
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should preserve node value", function() {
        const xmlData = `<rootNode attr1=' some val ' name='another val'> some val </rootNode>`;
        const expected = {
            "rootNode": {
                "@_attr1": " some val ",
                "@_name":  "another val",
                "#text":   " some val "
            }
        };

        const options = {
            ignoreAttributes: false,
            trimValues:       false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse with attributes and value when there is single node", function() {
        const xmlData = `<rootNode attr1='some val' attr2='another val'>val</rootNode>`;
        const expected = {
            "rootNode": {
                "@_attr1": "some val",
                "@_attr2": "another val",
                "#text":   "val"
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse different tags", function() {
        const xmlData = `<tag.1>val1</tag.1><tag.2>val2</tag.2>`;
        const expected = {
            "tag.1": "val1",
            "tag.2": "val2"
        };

        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse text value with tag", function() {
        const xmlData = `<score><c1>71<message>23</message>29</c1></score>`;
        const expected = {
            "score": {
                "c1": {
                    "message": 23,
                    "_text":   "7129"
                }
            }
        };

        const options = {
            textNodeName:     "_text",
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse nested elements with attributes", function() {
        const xmlData = `\
<root>
    <Meet date="2017-05-03" type="A" name="Meeting 'A'">
        <Event time="00:05:00" ID="574" Name="Some Event Name">
            <User ID="1">Bob</User>
        </Event>
    </Meet>
</root>`;
        const expected = {
            "root": {
                "Meet": {
                    "@_date": "2017-05-03",
                    "@_type": "A",
                    "@_name": "Meeting 'A'",
                    "Event":  {
                        "@_time": "00:05:00",
                        "@_ID":   "574",
                        "@_Name": "Some Event Name",
                        "User":   {
                            "@_ID":  "1",
                            "#text": "Bob"
                        }
                    }
                }
            }
        };

        const options = {
            ignoreAttributes:      false,
            ignoreNonTextNodeAttr: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse nested elements with attributes wrapped in object", function() {
        const xmlData = `\
<root xmlns="urn:none" xmlns:tns-ns="urn:none">
    <Meet xmlns="urn:none" tns-ns:nsattr="attr" date="2017-05-03" type="A" name="Meeting 'A'">
        <Event time="00:05:00" ID="574" Name="Some Event Name">
            <User ID="1">Bob</User>
        </Event>
    </Meet>
</root>`;
        const expected = {
            "root": {
                "Meet": {
                    "$":     {
                        "nsattr": "attr",
                        "date":   "2017-05-03",
                        "type":   "A",
                        "name":   "Meeting 'A'"
                    },
                    "Event": {
                        "$":    {
                            "time": "00:05:00",
                            "ID":   "574",
                            "Name": "Some Event Name"
                        },
                        "User": {
                            "$":     {
                                "ID": "1"
                            },
                            "#text": "Bob"
                        }
                    }
                }
            }
        };

        const options = {
            attributeNamePrefix: "",
            attributesGroupName:        "$",
            removeNSPrefix:     true,
            ignoreAttributes:    false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse all type of nodes", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/sample.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const expected = {
            "?xml": {
                "@version": "1.0"
            },
            "any_name": {
                "@attr":  "https://example.com/somepath",
                "person": [
                    {
                        "@id":         "101",
                        "phone":       [122233344550, 122233344551],
                        "name":        "Jack",
                        "age":         33,
                        "emptyNode":   "",
                        "booleanNode": [false, true],
                        "selfclosing": [
                            "",
                            {
                                "@with": "value"
                            }
                        ],
                        "married":     {
                            "@firstTime": "No",
                            "@attr":      "val 2",
                            "#_text":     "Yes"
                        },
                        "birthday":    "Wed, 28 Mar 1979 12:13:14 +0300",
                        "address":     [
                            {
                                "city":       "New York",
                                "street":     "Park Ave",
                                "buildingNo": 1,
                                "flatNo":     1
                            }, {
                                "city":       "Boston",
                                "street":     "Centre St",
                                "buildingNo": 33,
                                "flatNo":     24
                            }
                        ]
                    }, {
                        "@id":      "102",
                        "phone":    [122233344553, 122233344554],
                        "name":     "Boris",
                        "age":      34,
                        "married":  {
                            "@firstTime": "Yes",
                            "#_text":     "Yes"
                        },
                        "birthday": "Mon, 31 Aug 1970 02:03:04 +0300",
                        "address":  [
                            {
                                "city":       "Moscow",
                                "street":     "Kahovka",
                                "buildingNo": 1,
                                "flatNo":     2
                            }, {
                                "city":       "Tula",
                                "street":     "Lenina",
                                "buildingNo": 3,
                                "flatNo":     78
                            }
                        ]
                    }
                ]
            }
        };
        const options = {
            ignoreAttributes:      false,
            attributeNamePrefix:   "@",
            textNodeName:          "#_text"
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    /* it("should parse nodes as arrays", function () {
      const fs = require("fs");
      const path = require("path");
      const fileNamePath = path.join(__dirname, "assets/sample.xml");
      const xmlData = fs.readFileSync(fileNamePath).toString();

      const expected = {
        "any_name": [{
          "@attr": ["https://example.com/somepath"],
          "person": [{
            "@id": ["101"],
            "phone": [122233344550, 122233344551],
            "name": ["Jack"],
            "age": [33],
            "emptyNode": [""],
            "booleanNode": [false, true],
            "selfclosing": [
              "",
              {
                "@with": "value"
              }
            ],
            "married": [{
              "@firstTime": "No",
              "@attr": "val 2",
              "#_text": "Yes"
            }],
            "birthday": ["Wed, 28 Mar 1979 12:13:14 +0300"],
            "address": [{
              "city": ["New York"],
              "street": ["Park Ave"],
              "buildingNo": [1],
              "flatNo": [1]
            }, {
              "city": ["Boston"],
              "street": ["Centre St"],
              "buildingNo": [33],
              "flatNo": [24]
            }]
          }, {
            "@id": ["102"],
            "phone": [122233344553, 122233344554],
            "name": ["Boris"],
            "age": [34],
            "married": [{
                "@firstTime": "Yes",
                "#_text": "Yes"
            }],
            "birthday": ["Mon, 31 Aug 1970 02:03:04 +0300"],
            "address": [{
                "city": ["Moscow"],
                "street": ["Kahovka"],
                "buildingNo": [1],
                "flatNo": [2]
            }, {
                "city": ["Tula"],
                "street": ["Lenina"],
                "buildingNo": [3],
                "flatNo": [78]
            }]
          }]
        }]
      };

      const result = parser.parse(xmlData, {
        ignoreAttributes: false,
        ignoreNonTextNodeAttr: false,
        attributeNamePrefix: "@",
        textNodeName: "#_text",
        arrayMode: true
      });
      expect(result).toEqual(expected);
    }); */

    it("should skip namespace", function() {
        const xmlData = `\
<soap-env:Envelope xmlns:soap-env="http://schemas.xmlsoap.org/soap/envelope/" >
    <soap-env:Header>
        <cor:applicationID>dashboardweb</cor:applicationID>
        <cor:providerID>abc</cor:providerID>
    </soap-env:Header>
    <soap-env:Body>
        <man:getOffers>
            <man:customerId>
                <cor:msisdn>123456789</cor:msisdn>
            </man:customerId>
        </man:getOffers>
    </soap-env:Body>
</soap-env:Envelope>`;
        const expected = {
            "Envelope": {
                "Header": {
                    "applicationID": "dashboardweb",
                    "providerID":    "abc"
                },
                "Body":   {
                    "getOffers": {
                        "customerId": {
                            "msisdn": 123456789
                        }
                    }
                }
            }
        };

        const options = {
            removeNSPrefix: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not trim tag value if not allowed ", function() {
        const xmlData = "<rootNode>       123        </rootNode>";
        const expected = {
            "rootNode": "       123        "
        };
        
        const options = {
            parseTagValue: false,
            trimValues:     false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not trim tag value but not parse if not allowed ", function() {
        const xmlData = "<rootNode>       123        </rootNode>";
        const expected = {
            "rootNode": "123"
        };
        
        const options = {
            parseTagValue: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should encode  HTML entities by default", function() {
        const xmlData = "<rootNode>       foo&ampbar&apos;        </rootNode>";
        const expected = {
            "rootNode": "foo&ampbar'"
        };
        
        const options = {
            parseTagValue: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    //Issue #77
    it("should parse node with space in closing node", function() {
        const xmlData = "<?xml version='1.0'?>"
        + "<any_name>"
        + "    <person>"
        + "        <name1>Jack 1</name1 >"
        + "        <name2>Jack 2</name2>"
        + "    </person>"
        + "</any_name>";

        const expected = {
            "?xml": "",
            "any_name": {
                "person": {
                    "name1": "Jack 1",
                    "name2": "Jack 2"
                }
            }
        };
        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse node with text before, after and between of subtags", function() {
        const xmlData = "<tag>before"
        + "    <subtag>subtag text</subtag>"
        + "    middle"
        + "    <self />"
        + "    after self"
        + "    <subtag2>subtag text</subtag2>"
        + "    after"
        + "</tag>";

        const expected = {
            "tag": {
                "#text": "before        middle        after self        after",
                "subtag": "subtag text",
                "self": "",
                "subtag2": "subtag text"
            }
        };

        let result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);

        const options = {
            trimValues:false
        };
        const parser = new XMLParser(options);
        result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate before parsing", function() {
        const xmlData ="<tag>"
        + "    <subtag2>subtag text</subtag2>"
        + "</tag";
        const options = {
            trimValues:true
        };
        const parser = new XMLParser(options);
        expect(() => {
            let result = parser.parse(xmlData, true);
        }).toThrowError(`Closing tag 'tag' doesn't have proper closing.:1:45`)

    });

    it("should validate with options before parsing", function() {
        const xmlData = "<?xml version='1.0'?>"
        + "<tag foo>"
        + "    <subtag2>subtag text</subtag2>"
        + "</tag>";

        const expected = {
            "?xml": "",
            "tag": {
                "subtag2": "subtag text"
            }
        };

        const options = {
            trimValues:true,
            allowBooleanAttributes: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse numbers with leading zeros when `leadingZeros: false`", function() {
        const xmlData = `<rootNode attr1='0045' name='004.5'>.005</rootNode>`;
        const expected = {
            "rootNode": {
                "@_attr1": "0045",
                "@_name":  "004.5",
                "#text":   0.005
            }
        };

        const options = {
            ignoreAttributes: false,
            parseAttributeValue: true,
            numberParseOptions: {
                leadingZeros: false
            }
            
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });
    it("should parse numbers with leading zeros when `leadingZeros: true`", function() {
        const xmlData = `<rootNode attr1='0045' name='004.5'>.005</rootNode>`;
        const expected = {
            "rootNode": {
                "@_attr1": 45,
                "@_name":  4.5,
                "#text":   0.005
            }
        };

        const options = {            
            ignoreAttributes: false,
            parseAttributeValue: true,
            numberParseOptions: {
                leadingZeros: true
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not parse number of specific format if skipLike is set", function() {
        const xmlData = `<rootNode attr1='0045' name='004.5'>0000000005</rootNode>`;
        const expected = {
            "rootNode": {
                "@_attr1": 45,
                "@_name":  4.5,
                "#text":   "0000000005"
            }
        };

        const options = {
            ignoreAttributes: false,
            parseAttributeValue: true,
            numberParseOptions: {
                leadingZeros: true,
                skipLike: /[0-9]{10}/
            }
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should create text node even if there are no attributes or node children", function() {
        const xmlData = `<rootNode>
        <tag>value</tag>
        <tag2 some="attribute">12345</tag2>
        <empty></empty>
        <empty/>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "tag": {
                    "#text": "value"
                },
                "tag2": {
                    "#text": 12345,
                    "@_some": "attribute"
                },
                "empty": [
                    {   "#text": "" },
                    {   "#text": "" }
                ]
            }
        };

        const options = {
            alwaysCreateTextNode : true,
            ignoreAttributes: false,
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse value when trimValues: false && tag value has white spaces", function() {
        const XMLdata = `
        <root attri="   ibu  te   ">
        35       <nested>34</nested>
      </root>`;
        
        const expected = {
            "root": {
                "nested": 34,
                "#text": "\n        35       \n      ",
                "@_attri": "   ibu  te   "
            }
        };
      const options = {
        ignoreAttributes: false,
        // parseTagValue: false,
        trimValues: false
      }
      const parser = new XMLParser(options);
      let result = parser.parse(XMLdata);
    //   console.log(JSON.stringify(result, null,4));
  
      expect(result).toEqual(expected);
    });
    
    it("should parse value when trimValues: true && value has white spaces", function() {
        const XMLdata = `
        <root attri="   ibu  te   ">
        35       <nested>34</nested>
      </root>`;
        
        const expected = {
            "root": {
                "nested": 34,
                "#text": 35,
                "@_attri": "ibu  te"
            }
        };
      const options = {
        ignoreAttributes: false,
        // parseTagValue: false,
        trimValues: true
      }
      const parser = new XMLParser(options);
      let result = parser.parse(XMLdata);
    //   console.log(JSON.stringify(result, null,4));
  
      expect(result).toEqual(expected);
    });
    it("should remove white spaces from values when trimValues: true && parseTagValue: false", function() {
        const XMLdata = `
        <root attri="   ibu  te   ">
        35       <nested>34</nested>
      </root>`;
        
        const expected = {
            "root": {
                "nested": "34",
                "#text": "35",
                "@_attri": "ibu  te"
            }
        };
      const options = {
        ignoreAttributes: false,
        parseTagValue: false,
        // trimValues: false
      }
      const parser = new XMLParser(options);
      let result = parser.parse(XMLdata);
    //   console.log(JSON.stringify(result, null,4));
  
      expect(result).toEqual(expected);
    });
});
