 var parser = require("../src/parserV2");
var validator = require("../src/validator");

describe("XMLParser", function () {

    /*it("should parse attributes with valid names", function () {
        var xmlData = '<issue _ent-ity.23="Mjg2MzY2OTkyNA==" state="partial" version="1"></issue>';
        var expected = {
            "issue": {
                "_attr" : {
                    "_ent-ity.23"    :     "Mjg2MzY2OTkyNA==",
                    "state"     :     "partial",
                    "version"   :     1,
                    //"#text"     :     ""
                }
            }
        };

        result = parser.parse(xmlData,{
                attrNamePrefix: "",
                attrNodeName:"_attr",
                ignoreAttributes : false,
                parseAttributeValue: true
            }).json;

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

    });


    it("should parse attributes with valid names", function () {
        var xmlData = '<ns:a><b>sometext</b>parenttext</ns:a>';
        var expected ={
            "a": {
                "b":  "sometext",
                "#text": "parenttext"
            }
        };

        var result = parser.parse(xmlData,{
            ignoreNameSpace : true
        }).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse attributes with valid names", function () {
        var xmlData = '<ns:a><b>sometext</b><b>some more text</b>parenttext</ns:a>';
        var expected ={
            "a": {
                "b": [ "sometext","some more text"],
                "#text": "parenttext"
            }
        };

        var result = parser.parse(xmlData,{
            ignoreNameSpace : true
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result.json).toEqual(expected);
    });

    it("should parse repeated self closing tags with attributes", function () {
        var xmlData = "<rootNode><tag ns:arg='value'/><tag ns:arg='value'/></rootNode>";
        var expected = {
            "rootNode": {
                "tag": [{
                    "@_ns:arg": "value"
                },{
                    "@_ns:arg": "value"
                }]
            }
        };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        }).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse repeated tags with empty values", function () {
        var xmlData = "<rootNode><tag ns:arg='value'></tag><tag ns:arg='value'></tag></rootNode>";
        var expected = {
            "rootNode": {
                "tag": ["",""]
            }
        };

        var result = parser.parse(xmlData).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse self closing tags", function () {
        var xmlData = "<rootNode><tag ns:arg='value'/><tag ns:arg='value'/></rootNode>";
        var expected = {
            "rootNode": {
                "tag": ["",""]
            }
        };

        var result = parser.parse(xmlData).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    }); */
    
    /* it("should parse values in array", function () {
        var xmlData = '<ns:a><b>sometext</b>parenttext</ns:a>';
        var expected ={
            "a": {
                "b":  ["sometext" ],
                "#text": ["parenttext"]
            }
        };

        var result = parser.parse(xmlData,{
            ignoreNameSpace : true,
            arrayMode:true
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result.json).toEqual(expected);
    }); */


  /*   it("should parse attributes with valid names", function () {
        var xmlData = '<a><b>sometext<c>value of c<![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></c><d><f>73</f></d><e/></b></a>';
        var expected ={
            "a": {
                "b": {
                    "#text": "sometext",
                    "c":  "value of c<some>Jack</some>Jack",
                    "d": {
                        "f": 73
                    },
                    "e": ""
                }
            }
        };

        var result = parser.parse(xmlData).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse and validate boolean attributes", function () {
        var xmlData = '<a cd/><b cd ></b>';
        var expected = {
                "a"    :     {
                    cd : true
                },
                "b" : {
                    cd : true
                }
        };

        var result = parser.parse(xmlData,{
                attrNamePrefix: "",
                allowBooleanAttributes:true,
                attrPrefix : "",
                ignoreAttributes : false
            }).json;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    }); */

    

  
});