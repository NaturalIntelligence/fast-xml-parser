var parser = require("../src/parser");
var nimnparser = require("../src/nimndata");
var nimn = require("nimnjs");

describe("XMLParser", function () {

    /* it("should parse to XML with different data types to nimnjs", function () {
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
        console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData);
        var nimnData = parser.convert2nimn(node,schema);
        console.log(nimnData);

        //expect(nimndataExpected).toEqual(nimnData);
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
        console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData);
        var nimnData = parser.convert2nimn(node,schema);
        console.log(nimnData);

        //expect(nimndataExpected).toEqual(nimnData);
    }); */

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
        console.log(nimndataExpected);
        
        var node = parser.getTraversalObj(xmlData,{
            ignoreAttributes: false,
            trimValues: false
        });
        var nimnData = parser.convert2nimn(node,schema,{
            ignoreAttributes: false,
            trimValues: false
        });
        console.log(nimnData);

    });

});

