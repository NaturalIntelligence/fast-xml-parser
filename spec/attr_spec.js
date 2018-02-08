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
            }
        };

        var result = parser.parse(xmlData, {
            attributeNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true
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
                "bug"   :     true,
            }
        };

        var result = parser.parse(xmlData, {
            attributeNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not decode HTML entities / char by default", function () {
        var xmlData = '<element id="7" data="foo\nbar" bug="foo&ampbar&apos;"/>';
        var expected = {
            "element": {
                "id"    :     7,
                "data"     :     "foo bar",
                "bug"   :     "foo&ampbar&apos;",
            }
        };

        var result = parser.parse(xmlData, {
            attributeNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should decode HTML entities / char", function () {
        var xmlData = '<element id="7" data="foo\nbar" bug="foo&ampbar&apos;"/>';
        var expected = {
            "element": {
                "id"    :     7,
                "data"     :     "foo bar",
                "bug"   :     "foo&ampbar'",
            }
        };

        var result = parser.parse(xmlData, {
            attributeNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true,
            decodeHTMLchar: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse Boolean Attributes", function () {
        var xmlData = '<element id="7" data/>';
        var expected = {
            "element": {
                "id"    :     7,
                "data"     :     true
            }
        };

        var result = parser.parse(xmlData, {
            attributeNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes : true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData,{
            allowBooleanAttributes: true
        });
        expect(result).toBe(true);
    });


    it("should not parse attributes with name start with number", function () {
        var xmlData = '<issue 35entity="Mjg2MzY2OTkyNA==" ></issue>';
        
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute 35entity is an invalid name."
            }
        };
        var result = validator.validate(xmlData);

        expect(result).toEqual(expected);
    });

    it("should not parse attributes with invalid char", function () {
        var xmlData = '<issue enti+ty="Mjg2MzY2OTkyNA=="></issue>';
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute enti+ty is an invalid name."
            }
        };

        var result = validator.validate(xmlData);

        expect(result).toEqual(expected);
    });


    it("should not parse attributes in closing tag", function () {
        var xmlData = '<issue></issue invalid="true">';
        var expected = {
            "err": {
                "code": "InvalidTag",
                "msg": "closing tag issue can't have attributes or invalid starting."
            }
        };
        var result = validator.validate(xmlData);

        expect(result).toEqual(expected);
    });

    it("should err for invalid atributes", function () {
        var xmlData = "<rootNode =''></rootNode>";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute '' has no space in starting."
            }
        };
        var result = validator.validate(xmlData);
        expect(result).toEqual(expected);
    });

    it("should validate xml with atributes", function () {
        var xmlData = "<rootNode attr=\"123\"><tag></tag><tag>1</tag><tag>val</tag></rootNode>";
  
        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml atribute has '>' in value", function () {
        var xmlData = "<rootNode attr=\"123>234\"><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with invalid atributes", function () {
        var xmlData = "<rootNode attr=\"123><tag></tag><tag>1</tag><tag>val</tag></rootNode>";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "Attributes for rootNode have open quote"
            }
        };
        result = validator.validate(xmlData);
        expect(result).toEqual(expected);
    });


    it("should not validate xml with invalid attributes when duplicate attributes present", function () {
        var xmlData = "<rootNode  abc='123' abc=\"567\" />";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute abc is repeated."
            }
        };
        result = validator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid attributes when no space between 2 attributes", function () {
        var xmlData = "<rootNode  abc='123'bc='567' />";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute bc has no space in starting."
            }
        };
        result = validator.validate(xmlData);
        expect(result).toEqual(expected);
    });


    it("should not validate a tag with attribute presents without value ", function () {
        var xmlData = "<rootNode ab cd='ef'></rootNode>";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "boolean attribute ab is not allowed."
            }
        };
        var result = validator.validate(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid attributes presents without value", function () {
        var xmlData = "<rootNode  123 abc='123' bc='567' />";
        var expected = {
            "err": {
                "code": "InvalidAttr",
               // "msg": "attribute 123 is an invalid name."
                "msg": "boolean attribute 123 is not allowed."
            }
        };
        result = validator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });



});