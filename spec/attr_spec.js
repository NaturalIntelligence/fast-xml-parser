var parser = require("../src/parser");
var validator = require("../src/validator");

describe("XMLParser", function () {


    it("should parse attributes with valid names", function () {
        var xmlData = '<issue _ent-ity.23="Mjg2MzY2OTkyNA==" state="partial" version="1"></issue>';
        var expected = {
            "issue": {
                "_ent-ity.23"    :     "Mjg2MzY2OTkyNA==",
                "state"     :     "partial",
                "version"   :     1,
                "#text"     :     ""
            }
        };

        var result = parser.parse(xmlData, {
            attrPrefix:"",
            ignoreTextNodeAttr: false,
            ignoreNonTextNodeAttr: false,
            textAttrConversion: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse attributes with newline char", function () {
        var xmlData = '<element id="7" data="foo\nbar" bug="true"/>';
        var expected = {
            "element": {
                "id"    :     7,
                "data"     :     "foo bar",
                "bug"   :     "true",
            }
        };

        var result = parser.parse(xmlData, {
            attrPrefix:"",
            ignoreTextNodeAttr: false,
            ignoreNonTextNodeAttr: false,
            textAttrConversion: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });
    //1. can start with _, or letter
    //2. can contain :,-,_,.,a-z,a-Z,0-9


    it("should not parse attributes with name start with number", function () {
        var xmlData = '<issue 35entity="Mjg2MzY2OTkyNA==" ></issue>';
        
        var result = validator.validate(xmlData);

        expect(result).toEqual(false);
    });

    it("should not parse attributes with invalid char", function () {
        var xmlData = '<issue enti+ty="Mjg2MzY2OTkyNA=="></issue>';
        
        var result = validator.validate(xmlData);

        expect(result).toEqual(false);
    });


    it("should not parse attributes in closing tag", function () {
        var xmlData = '<issue></issue invalid="true">';
        
        var result = validator.validate(xmlData);

        expect(result).toEqual(false);
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

    it("should not validate xml atribute has '>' in value", function () {
        var xmlData = "<rootNode attr=\"123>234\"><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with invalid atributes", function () {
        var xmlData = "<rootNode attr=\"123><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

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

});