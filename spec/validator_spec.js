var validator = require("../bin/validator");

describe("XMLParser", function () {

    it("should validate simple xml string", function () {
        var xmlData = "<rootNode></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);

        xmlData = "<rootNode></rootNode     >";

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate invalid starting tag", function () {
        var xmlData = "< rootNode></rootNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate incomplete xml string", function () {
        var xmlData = "<rootNode>";
        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should return false for non xml text", function () {
        var xmlData = "rootNode";
        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should validate self closing tags", function () {
        var xmlData = "<rootNode/>";
        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml string when closing tag is different", function () {
        var xmlData = "<rootNode></rootnode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate xml string when closing tag is invalid", function () {
        var xmlData = "<rootNode>< /rootnode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);

        xmlData = "<rootNode></ rootnode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);

        xmlData = "<rootNode></rootnode 123>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should validate simple xml string with namespace", function () {
        var xmlData = "<root:Node></root:Node>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml string with namespace when closing tag is diffrent", function () {
        var xmlData = "<root:Node></root:node>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should validate simple xml string with value", function () {
        var xmlData = "<root:Node>some value</root:Node>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate simple xml string with value but not matching closing tag", function () {
        var xmlData = "<root:Node>some value</root>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate simple xml string with value but no closing tag", function () {
        var xmlData = "<root:Node>some value";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });


    it("should validate xml with nested tags", function () {
        var xmlData = "<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with wrongly nested tags", function () {
        var xmlData = "<rootNode><tag><tag1></tag>1</tag1><tag>val</tag></rootNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should return false for invalid atributes", function () {
        var xmlData = "<rootNode =''></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should validate xml with atributes", function () {
        var xmlData = "<rootNode attr=\"123\"><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with invalid atributes", function () {
        var xmlData = "<rootNode attr=\"123><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should validate xml with comment", function () {
        var xmlData = "<rootNode><!-- <tag> -- --><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with non closing comment", function () {
        var xmlData = "<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });


    it("should not validate xml with invalid attributes when duplicate attributes present", function () {
        var xmlData = "<rootNode  abc='123' abc=\"567\" />";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate xml with invalid attributes when no space between 2 attributes", function () {
        var xmlData = "<rootNode  abc='123'bc='567' />";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate xml with invalid attributes when an attribute without value present", function () {
        var xmlData = "<rootNode  123 abc='123' bc='567' />";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate xml with unclosed tag", function () {
        var xmlData = "<rootNode  abc='123' bc='567'";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should validate xml with CDATA", function () {
        var xmlData = "<name><![CDATA[Jack]]></name>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml with repeated CDATA", function () {
        var xmlData = "<name><![CDATA[Jack]]><![CDATA[Jack]]></name>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml data", function () {
         var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/sample.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate complex xml data", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/complex.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false for invalid xml", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/invalid.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

});


