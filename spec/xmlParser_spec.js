var parser = require("../bin/parser");

describe("XMLParser", function () {

    it("should parse all values as string,int, or float", function () {
        var xmlData = "<rootNode><tag>value</tag><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>";
        var expected = {
            "rootNode": {
                "tag": "value",
                "intTag": 45,
                "floatTag": 65.34
            }
        };

        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse all values as string", function () {
        var xmlData = "<rootNode><tag>value</tag><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>";
        var expected = {
            "rootNode": {
                "tag": "value",
                "intTag": "045",
                "floatTag": "65.34"
            }
        };

        var result = parser.parse(xmlData, {
            textNodeConversion : false
        });
        expect(result).toEqual(expected);
    });

    it("should skip tag arguments", function () {
        var xmlData = "<rootNode><tag ns:arg='value'>value</tag><intTag ns:arg='value' ns:arg2='value2' >45</intTag><floatTag>65.34</floatTag></rootNode>";
        var expected = {
            "rootNode": {
                "tag": "value",
                "intTag": 45,
                "floatTag": 65.34
            }
        };

        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should ignore namespace and text node attributes", function () {
        var xmlData = "<root:node><tag ns:arg='value'>value</tag><intTag ns:arg='value' ns:arg2='value2' >45</intTag><floatTag>65.34</floatTag></root:node>";
        var expected = {
            "node": {
                "tag": {
                    "@_arg":"value",
                    "#text": "value"
                },
                "intTag": {
                    "@_arg":"value",
                    "@_arg2":"value2",
                    "#text": 45
                },
                "floatTag": 65.34
            }
        };

        var result = parser.parse(xmlData,{ ignoreNameSpace : true, ignoreTextNodeAttr : false});
        expect(result).toEqual(expected);
    });

    it("should parse empty text Node", function () {
        var xmlData = "<rootNode><tag></tag></rootNode>";
        var expected = {
            "rootNode": {
                "tag": ""
            }
        };

        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse self closing tags", function () {
        var xmlData = "<rootNode><tag ns:arg='value'/></rootNode>";
        var expected = {
            "rootNode": {
                "tag": {
                    "@_ns:arg": "value"
                }
            }
        };

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse single self closing tag", function () {
        var xmlData = "<tag arg='value'/>";
        var expected = {
                "tag": {
                    "@_arg": "value"
                }
        };

        //console.log(parser.getTraversalObj(xmlData));
        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse tag having CDATA", function () {
        var xmlData = "<?xml version='1.0'?>"
                       + "<any_name>"
                       +    "<person>"
                       +        "<phone>+122233344550</phone>"
                       +        "<name><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>"
                       +        "<phone>+122233344551</phone>"
                       +    "</person>"
                       + "</any_name>";
        var expected = {
                        "any_name": {
                            "person": {
                                "phone": [
                                    122233344550,
                                    122233344551
                                ],
                                "name": "<some>Jack</some>Jack"
                            }
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse repeated nodes in array", function () {
        var xmlData = "<rootNode>" +
            "<tag>value</tag>" +
            "<tag>45</tag>" +
            "<tag>65.34</tag>" +
            "</rootNode>";
        var expected = {
            "rootNode": {
                "tag": ["value", 45, 65.34]
            }
        };

        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse nested nodes in nested properties", function () {
        var xmlData = "<rootNode>" +
            "<parenttag>" +
            "<tag>value</tag>" +
            "<tag>45</tag>" +
            "<tag>65.34</tag>" +
            "</parenttag>" +
            "</rootNode>";
        var expected = {
            "rootNode": {
                "parenttag": {
                    "tag": ["value", 45, 65.34]
                }
            }
        };

        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse text nodes with value", function () {
        var xmlData = "<rootNode>" +
            "<parenttag attr1='some val' attr2='another val'>" +
            "<tag attr1='val'>value</tag>" +
            "<tag attr1='val' attr2='234'>45</tag>" +
            "<tag>65.34</tag>" +
            "</parenttag>" +
            "</rootNode>";
        var expected = {
            "rootNode": {
                "parenttag": {
                    "tag": [{
                        "@_attr1": "val",
                        "#text": "value"
                    }, {
                        "@_attr1": "val",
                        "@_attr2": "234",
                        "#text": 45
                    }, 65.34]
                }
            }
        };

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse non-text nodes with value", function () {
        var xmlData = "<rootNode>" +
            "<parenttag attr1='some val' attr2='another val'>" +
            "<tag>value</tag>" +
            "<tag attr1='val' attr2='234'>45</tag>" +
            "<tag>65.34</tag>" +
            "</parenttag>" +
            "</rootNode>";
        var expected = {
            "rootNode": {
                "parenttag": {
                    "@_attr1": "some val",
                    "@_attr2": "another val",
                    "tag": ["value", 45, 65.34]
                }
            }
        };

        var result = parser.parse(xmlData, {
            ignoreNonTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse non-text nodes with value for repeated nodes", function () {
        var xmlData = "<rootNode>" +
            "<parenttag attr1='some val' attr2='another val'>" +
            "<tag>value</tag>" +
            "<tag attr1='val' attr2='234'>45</tag>" +
            "<tag>65.34</tag>" +
            "</parenttag>" +
            "<parenttag attr1='some val' attr2='another val'>" +
            "<tag>value</tag>" +
            "<tag attr1='val' attr2='234'>45</tag>" +
            "<tag>65.34</tag>" +
            "</parenttag>" +
            "</rootNode>";
        var expected = {
            "rootNode": {
                "parenttag": [{
                    "@_attr1": "some val",
                    "@_attr2": "another val",
                    "tag": ["value", 45, 65.34]
                }, {
                    "@_attr1": "some val",
                    "@_attr2": "another val",
                    "tag": ["value", 45, 65.34]
                }]
            }
        };

        var result = parser.parse(xmlData, {
            ignoreNonTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should preserve node value", function () {
        var xmlData = "<rootNode attr1=' some val ' attr2='another val'> some val </rootNode>";
        var expected = {
            "rootNode": {
                "@_attr1": " some val ",
                "@_attr2": "another val",
                "#text": " some val "
            }
        };

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse with attributes and value when there is single node", function () {
        var xmlData = "<rootNode attr1='some val' attr2='another val'>val</rootNode>";
        var expected = {
            "rootNode": {
                "@_attr1": "some val",
                "@_attr2": "another val",
                "#text": "val"
            }
        };

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
    });

    it("should parse all type of nodes", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/sample.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var expected = {
            "any_name": {
                "@attr": "https://example.com/somepath",
                "person": [{
                    "@id": "101",
                    "phone": [122233344550, 122233344551],
                    "name": "Jack",
                    "age": 33,
                    "emptyNode": "",
                    "booleanNode": ["false", "true"],
                    "selfclosing": [
                        "",
                        {
                            "@with": "value"
                        }
                    ],
                    "married": {
                        "@firstTime": "No",
                        "@attr": "val 2",
                        "#_text": "Yes"
                    },
                    "birthday": "Wed, 28 Mar 1979 12:13:14 +0300",
                    "address": [{
                        "city": "New York",
                        "street": "Park Ave",
                        "buildingNo": 1,
                        "flatNo": 1
                    }, {
                        "city": "Boston",
                        "street": "Centre St",
                        "buildingNo": 33,
                        "flatNo": 24
                    }]
                }, {
                    "@id": "102",
                    "phone": [122233344553, 122233344554],
                    "name": "Boris",
                    "age": 34,
                    "married": {
                        "@firstTime": "Yes",
                        "#_text": "Yes"
                    },
                    "birthday": "Mon, 31 Aug 1970 02:03:04 +0300",
                    "address": [{
                        "city": "Moscow",
                        "street": "Kahovka",
                        "buildingNo": 1,
                        "flatNo": 2
                    }, {
                        "city": "Tula",
                        "street": "Lenina",
                        "buildingNo": 3,
                        "flatNo": 78
                    }]
                }]
            }
        };

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false,
            ignoreNonTextNodeAttr: false,
            attrPrefix: "@",
            textNodeName: "#_text",
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should intermediate traversable JS object which can later covert to JSON", function () {
        var xmlData = "<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        var tobj = parser.getTraversalObj(xmlData);
        expect(tobj.parent).toBe(undefined);
        expect(tobj.tagname).toBe("!xml");
        expect(tobj.child.length).toBe(1);
        expect(tobj.child[0].parent.tagname).toBe("!xml");
        expect(tobj.child[0].tagname).toBe("rootNode");
        expect(tobj.child[0].val).toBe(undefined);
        expect(tobj.child[0].child.length).toBe(3);
        expect(tobj.child[0].child[0].parent).toBe(tobj.child[0].child[1].parent);
        expect(tobj.child[0].child[1].parent).toBe(tobj.child[0].child[2].parent);
        expect(tobj.child[0].child[0].val).toBe("");
        expect(tobj.child[0].child[1].val).toBe(1);
        expect(tobj.child[0].child[2].val).toBe("val");

        var expected = {
            "rootNode": {
                "tag": ["",1,"val"]
            }
        };
        var jsobj = parser.convertToJson(tobj);
        expect(jsobj).toEqual(expected);
    });


    it("should skip namespace", function () {
        var xmlData = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" >'
            +'   <soapenv:Header>'
            +'      <cor:applicationID>dashboardweb</cor:applicationID>'
            +'      <cor:providerID>abc</cor:providerID>'
            +'   </soapenv:Header>'
            +'   <soapenv:Body>'
            +'      <man:getOffers>'
            +'         <man:customerId>'
            +'            <cor:msisdn>123456789</cor:msisdn>'
            +'         </man:customerId>'
            +'      </man:getOffers>'
            +'   </soapenv:Body>'
            +'</soapenv:Envelope>';
        var expected = {
            "Envelope": {
                "Header": {
                    "applicationID": "dashboardweb",
                    "providerID": "abc"
                },
                "Body": {
                    "getOffers": {
                        "customerId": {
                            "msisdn": 123456789
                        }
                    }
                }
            }
        };

        var result = parser.parse(xmlData,{ ignoreNameSpace : true});
        expect(result).toEqual(expected);
    });

});
