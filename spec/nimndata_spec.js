var parser = require("../src/parser");
var nimn = require("nimnjs");

describe("XMLParser", function () {

    it("should parse to XML with different data types to nimnjs", function () {
        var xmlData = "<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>";
        var jsonData = {
            "rootNode": {
                "tag": "value",
                "boolean":true,
                "intTag": 45,
                "floatTag": 65.34
            }
        };
        var schema = {
            "rootNode": {
                "tag": "string",
                "boolean":"boolean",
                "intTag": "number",
                "floatTag": "number"
            }
        };

        //var jsonStr = parser.parse(xmlData);
        
        var nimnParser = new nimn();
        nimnParser.addDataHandler("boolean");
        nimnParser.addSchema(schema);
        var nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData);
        var nimnData = parser.convertTonimn(node,schema);
        //console.log(nimnData);

        expect(nimndataExpected).toEqual(nimnData);
    });

    it("should parse repeated nodes in array", function () {
        var xmlData = "<rootNode>" +
            "<name>amit</name>" +
            "<name>kumar</name>" +
            "<name>gupta</name>" +
            "</rootNode>";
        var jsonData = {
            "rootNode": {
                "name": ["amit", "kumar", "gupta"]
            }
        };
        var schema = {
            "rootNode": {
                "name": ["string"]
            }
        };
        //var jsonStr = parser.parse(xmlData);
        
        var nimnParser = new nimn();
        nimnParser.addSchema(schema);
        var nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData);
        var nimnData = parser.convertTonimn(node,schema);
        //console.log(nimnData);

        expect(nimndataExpected).toEqual(nimnData);
    }); 

    it("should preserve node value", function () {
        var xmlData = "<rootNode attr1=' some val ' name='another val'> some val </rootNode>";
        var jsonData = {
            "rootNode": {
                "@_attr1": " some val ",
                "@_name": "another val",
                "#text": " some val "
            }
        };

        var schema = {
            "rootNode": {
                "@_attr1": "string",
                "@_name": "string",
                "#text": "string"
            }
        };

        var nimnParser = new nimn();
        nimnParser.addSchema(schema);
        var nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData,{
            ignoreAttributes: false,
            trimValues: false
        });
        var nimnData = parser.convertTonimn(node,schema,{
            ignoreAttributes: false,
            trimValues: false
        });
        //console.log(nimnData);

        expect(nimndataExpected).toEqual(nimnData);
    });

    it("should not parse text value with tag", function () {
        var xmlData = "<score><c1>71<message>23</message>29</c1></score>";
        var jsonData = {
            "score": {
                "c1": {
                    "message" : 23,
                    "_text" : "7129"
                }
            }
        };
        var schema = {
            "score": {
                "c1": {
                    "message" : "number",
                    "_text" : "string"
                }
            }
        };

        var nimnParser = new nimn();
        nimnParser.addSchema(schema);
        var nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData,{
            textNodeName : "_text",
            ignoreAttributes : false
        });
        var nimnData = parser.convertTonimn(node,schema,{
            textNodeName : "_text",
            ignoreAttributes : false
        });
        //console.log(nimnData);

        expect(nimndataExpected).toEqual(nimnData);
    });

    it("should parse all type of nodes", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/sample.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var jsonData = {
            "any_name": {
                "@attr": "https://example.com/somepath",
                "person": [{
                    "@id": "101",
                    "phone": [122233344550, 122233344551],
                    "name": "Jack",
                    "age": 33,
                    "emptyNode": "",
                    "booleanNode": [false, true],
                    "selfclosing": [
                        {},
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

        var schema = {
            "any_name": {
                "@attr": "string",
                "person": [{
                    "@id": "string",
                    "phone": ["number"],
                    "name": "string",
                    "age": "number",
                    "emptyNode": "string",
                    "booleanNode": ["boolean"],
                    "selfclosing": [{ "@with": "string" }],
                    "married": {
                        "@firstTime": "string",
                        "@attr": "string",
                        "#_text": "string"
                    },
                    "birthday": "date",
                    "address": [{
                        "city": "string",
                        "street": "string",
                        "buildingNo": "number",
                        "flatNo": "number"
                    }]
                }]
            }
        };

        var nimnParser = new nimn();
        nimnParser.addDataHandler("boolean");
        nimnParser.addSchema(schema);
        var nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);
        
        var options = {
            ignoreAttributes: false,
            ignoreNonTextNodeAttr: false,
            attributeNamePrefix: "@",
            textNodeName: "#_text",
        };
        var node = parser.getTraversalObj(xmlData,options);
        var nimnData = parser.convertTonimn(node,schema,options);
        //console.log(nimnData);

        expect(nimndataExpected).toEqual(nimnData);
    });
    
});

