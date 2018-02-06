var parser = require("../src/parserV2");
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
            attrNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true
        }).json;

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should trim attributes value", function () {
        var xmlData = "<rootNode  abc='123    ' bc='     567' />";
        var expected = {
            "rootNode": {
                "abc": "123    ",
                "bc": "     567"
            }
        };
        var result = parser.parse(xmlData,{
            attrNamePrefix: "",
            ignoreAttributes: false,
            allowBooleanAttributes: true,
            trimValues: false
        }).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
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
            attrNamePrefix:"",
            ignoreAttributes: false,
            parseAttributeValue: true
        }).json;

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    //1. can start with _, or letter
    //2. can contain :,-,_,.,a-z,a-Z,0-9


    it("should not parse attributes with name start with number", function () {
        var xmlData = '<issue 35entity="Mjg2MzY2OTkyNA==" ></issue>';
        
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute 35entity is an invalid name."
            }
        };

        var result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
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
        var result = parser.parse(xmlData);

        expect(result).toEqual(expected);
    });


    it("should not parse attributes in closing tag", function () {
        var xmlData = '<issue></issue invalid="true">';
        var expected = {
            "err": {
                "code": "InvalidTag",
                "msg": "closing tag issue can't have attributes."
            }
        };
        var result = parser.parse(xmlData);

        expect(result).toEqual(expected);
    });

    it("should return false for invalid atributes", function () {
        var xmlData = "<rootNode =''></rootNode>";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute '' has no space in starting."
            }
        };
        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    
    it("should validate xml atribute has '>' in value", function () {
        var xmlData = "<rootNode attr=\"123>234\"><tag></tag><tag>1</tag><tag>val</tag></rootNode>";
        var expected = {
            "json": {
                "rootNode": {
                    "@_attr": "123>234",
                    "tag": [
                        "",
                        1,
                        "val"
                    ]
                }
            }
        };
        var result = parser.parse(xmlData,{
            ignoreAttributes:false
        });
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid atributes", function () {
        var xmlData = "<rootNode attr=\"123><tag></tag><tag>1</tag><tag>val</tag></rootNode>";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "Attributes for rootNode have open quote"
            }
        };
        var result = parser.parse(xmlData);
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
        var result = parser.parse(xmlData);
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
        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });


    it("should not validate a tag with boolean attribute ", function () {
        var xmlData = "<rootNode ab cd='ef'></rootNode>";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "boolean attribute ab is not allowed."
            }
        };
        var result = parser.parse(xmlData);
        expect(result).toEqual(expected);
    });

    it("should  validate a tag with boolean attribute if allowed ", function () {
        var xmlData = "<rootNode ab cd='ef'></rootNode>";
        var expected = {
            "rootNode": {
                "ab": true,
                "cd": "ef"
            }
        };
        var result = parser.parse(xmlData,{
            attrNamePrefix: "",
            ignoreAttributes:false,
            allowBooleanAttributes: true
        }).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid boolean attributes", function () {
        var xmlData = "<rootNode  123 abc='123' bc='567' />";
        var expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute 123 is an invalid name."
            }
        };
        var result = parser.parse(xmlData,{
            allowBooleanAttributes: true
        });
        expect(result).toEqual(expected);
    });

    

});