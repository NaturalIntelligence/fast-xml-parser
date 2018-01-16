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

    it("should validate xml with comment", function () {
        var xmlData = "<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });


    it("should validate xml with comment", function () {
        var xmlData = "<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });


    it("should not validate xml with comment in a open tag", function () {
        var xmlData = "<rootNode<!-- <tag> -- -->><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should not validate xml with non closing comment", function () {
        var xmlData = "<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>";

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

    it("should validate xml when CDATA consist regx or blank data", function () {
        var xmlData = "<name><![CDATA[]]><![CDATA[^[ ].*$]]></name>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false when tag starts with xml or XML etc", function () {
        var xmlData = "<xmlNode  abc='123' bc='567'>val</xmlNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);

        xmlData = "<XmLNode  abc='123' bc='567'></XmLNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);

        xmlData = "<xMLNode/>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should return true for valid tag", function () {
        var xmlData = "<ns:start_tag-2.0></ns:start_tag-2.0>";

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false for invalid tag", function () {
        var xmlData = "<2start_tag  abc='123' bc='567'></2start_tag>";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
    });

    it("should return false for invalid tag", function () {
        var xmlData = "<2start_tag />";

        result = validator.validate(xmlData);
        expect(result).toBe(false);
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

  it("should return true for valid svg", function () {
    var fs = require("fs");
    var path = require("path");
    var fileNamePath = path.join(__dirname, "assets/by.svg");
    var svgData = fs.readFileSync(fileNamePath).toString();

    var result = validator.validate(svgData);
    expect(result).toBe(true);
  });

});


