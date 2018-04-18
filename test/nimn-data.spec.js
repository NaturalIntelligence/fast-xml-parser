const {getTraversalObj, convertToNimn} = require("../parser");
const Nimn = require("nimnjs");

describe("XMLParser", function() {
    it("should parse to XML with different data types to nimnjs", function() {
        const xmlData = "<rootNode><tag>value</tag><boolean>true</boolean><intTag>045</intTag><floatTag>65.34</floatTag></rootNode>";
        const jsonData = {
            "rootNode": {
                "tag": "value",
                "boolean": true,
                "intTag": 45,
                "floatTag": 65.34
            }
        };
        const schema = {
            "rootNode": {
                "tag": "string",
                "boolean": "boolean",
                "intTag": "number",
                "floatTag": "number"
            }
        };

        //const jsonStr = parser.parse(xmlData);

        const nimnParser = new Nimn();
        nimnParser.addDataHandler("boolean");
        nimnParser.addSchema(schema);
        const nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);

        const node = getTraversalObj(xmlData);
        const nimnData = convertToNimn(node, schema);
        //console.log(nimnData);

        expect(nimndataExpected).eql(nimnData);
    });

    it("should parse repeated nodes in array", function() {
        const xmlData = "<rootNode>" +
                        "<name>amit</name>" +
                        "<name>kumar</name>" +
                        "<name>gupta</name>" +
                        "</rootNode>";
        const jsonData = {
            "rootNode": {
                "name": ["amit", "kumar", "gupta"]
            }
        };
        const schema = {
            "rootNode": {
                "name": ["string"]
            }
        };
        //const jsonStr = parser.parse(xmlData);

        const nimnParser = new Nimn();
        nimnParser.addSchema(schema);
        const nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);

        const node = getTraversalObj(xmlData);
        const nimnData = convertToNimn(node, schema);
        //console.log(nimnData);

        expect(nimndataExpected).eql(nimnData);
    });

    it("should preserve node value", function() {
        const xmlData = "<rootNode attr1=' some val ' name='another val'> some val </rootNode>";
        const jsonData = {
            "rootNode": {
                "@_attr1": " some val ",
                "@_name": "another val",
                "#text": " some val "
            }
        };

        const schema = {
            "rootNode": {
                "@_attr1": "string",
                "@_name": "string",
                "#text": "string"
            }
        };

        const nimnParser = new Nimn();
        nimnParser.addSchema(schema);
        const nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);

        const node = getTraversalObj(xmlData, {
            ignoreAttributes: false,
            trimValues: false
        });
        const nimnData = convertToNimn(node, schema, {
            ignoreAttributes: false,
            trimValues: false
        });
        //console.log(nimnData);

        expect(nimndataExpected).eql(nimnData);
    });

    it("should not parse text value with tag", function() {
        const xmlData = "<score><c1>71<message>23</message>29</c1></score>";
        const jsonData = {
            "score": {
                "c1": {
                    "message": 23,
                    "_text": "7129"
                }
            }
        };
        const schema = {
            "score": {
                "c1": {
                    "message": "number",
                    "_text": "string"
                }
            }
        };

        const nimnParser = new Nimn();
        nimnParser.addSchema(schema);
        const nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);

        const node = getTraversalObj(xmlData, {
            textNodeName: "_text",
            ignoreAttributes: false
        });
        const nimnData = convertToNimn(node, schema, {
            textNodeName: "_text",
            ignoreAttributes: false
        });
        //console.log(nimnData);

        expect(nimndataExpected).eql(nimnData);
    });

    it("should parse all type of nodes", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/sample.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const jsonData = {
            "any_name": {
                "@attr": "https://example.com/somepath",
                "person": [
                    {
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
                        "address": [
                            {
                                "city": "New York",
                                "street": "Park Ave",
                                "buildingNo": 1,
                                "flatNo": 1
                            }, {
                                "city": "Boston",
                                "street": "Centre St",
                                "buildingNo": 33,
                                "flatNo": 24
                            }
                        ]
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
                        "address": [
                            {
                                "city": "Moscow",
                                "street": "Kahovka",
                                "buildingNo": 1,
                                "flatNo": 2
                            }, {
                                "city": "Tula",
                                "street": "Lenina",
                                "buildingNo": 3,
                                "flatNo": 78
                            }
                        ]
                    }
                ]
            }
        };

        const schema = {
            "any_name": {
                "@attr": "string",
                "person": [
                    {
                        "@id": "string",
                        "phone": ["number"],
                        "name": "string",
                        "age": "number",
                        "emptyNode": "string",
                        "booleanNode": ["boolean"],
                        "selfclosing": [{"@with": "string"}],
                        "married": {
                            "@firstTime": "string",
                            "@attr": "string",
                            "#_text": "string"
                        },
                        "birthday": "date",
                        "address": [
                            {
                                "city": "string",
                                "street": "string",
                                "buildingNo": "number",
                                "flatNo": "number"
                            }
                        ]
                    }
                ]
            }
        };

        const nimnParser = new Nimn();
        nimnParser.addDataHandler("boolean");
        nimnParser.addSchema(schema);
        const nimndataExpected = nimnParser.encode(jsonData);
        //console.log(nimndataExpected);

        const options = {
            ignoreAttributes: false,
            ignoreNonTextNodeAttr: false,
            attributeNamePrefix: "@",
            textNodeName: "#_text"
        };
        const node = getTraversalObj(xmlData, options);
        const nimnData = convertToNimn(node, schema, options);
        //console.log(nimnData);

        expect(nimndataExpected).eql(nimnData);
    });

});

