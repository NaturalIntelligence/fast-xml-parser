var parser = require("../src/parser");
var validator = require("../src/validator");

describe("XMLParser", function () {

	it("should parse tag having CDATA", function () {
        var xmlData = "<?xml version='1.0'?>"
                       + "<any_name>"
                       +    "<person>"
                       +        "<phone>+122233344550</phone>"
                       +        "<name><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>"
                       +        "<name><![CDATA[<some>Mohan</some>]]></name>"
                       +        "<blank><![CDATA[]]></blank>"
                       +        "<regx><![CDATA[^[ ].*$]]></regx>"
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
						            "name": [
						                "<some>Jack</some>Jack",
						                "<some>Mohan</some>"
						            ],
                        "blank" : "",
                        "regx" : "^[ ].*$"
						        }
						    }
						};

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        //console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

	it("should parse tag having CDATA 2", function () {
        var xmlData = "<sql-queries>"
					 + 	"<sql-query id='testquery'><![CDATA[select * from search_urls]]></sql-query>"
					 + 	"<sql-query id='searchinfo'><![CDATA[select * from search_urls where search_urls=?]]></sql-query>"
					 + 	"<sql-query id='searchurls'><![CDATA[select search_url from search_urls ]]></sql-query>"
					 +"</sql-queries>";
        var expected = {
                        "sql-queries": {
                            "sql-query": [ {
                            	"@_id": "testquery",
                                "#text": "select * from search_urls"
                            },{
                            	"@_id": "searchinfo",
                                "#text": "select * from search_urls where search_urls=?"
                            },{
                            	"@_id": "searchurls",
                                "#text": "select search_url from search_urls "
                            }]
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });


    it("should parse tag having whitespaces before / after CDATA", function () {
        var xmlData =  "<xml>"
                    + " <a>text</a>"
                    + " <b>\n       text    \n</b>"
                    + " <c>     <![CDATA[text]]>    </c>"
                    + " <d><![CDATA[text]]></d>"
                    + "</xml>";
        var expected = {
                        "xml": {
                            "a": "text",
                            "b": "text",
                            "c": "text",
                            "d": "text"
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should ignore comment", function () {
        var xmlData = "<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>";

        var expected = {
                        "rootNode": {
                            "tag": [1, "val"]
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        expect(result).toEqual(expected);

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should ignore multiline comments", function () {
        var xmlData = "<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>";

        var expected = {
                        "rootNode": {
                            "tag": [1, "val"]
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        expect(result).toEqual(expected);

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse tag having text before / after CDATA", function () {
        var xmlData =  "<xml>"
                    + " <a>text</a>"
                    + " <b>\n       text    \n</b>"
                    + " <c>     <![CDATA[text]]>after    </c>"
                    + " <d>before<![CDATA[text]]>   after  t</d>"
                    + "</xml>";
        var expected = {
                        "xml": {
                            "a": "text",
                            "b": "text",
                            "c": "textafter",
                            "d": "beforetextafter  t"
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse tag value if having CDATA", function () {
        var xmlData =  "<xml>"
                    + " <a>text</a>"
                    + " <b>\n       text    \n</b>"
                    + " <c>     <![CDATA[text]]>after    </c>"
                    + " <d>23<![CDATA[]]>   24</d>"
                    + "</xml>";
        var expected = {
                        "xml": {
                            "a": "text",
                            "b": "text",
                            "c": "textafter",
                            "d": "2324"
                        }
                    };

        var result = parser.parse(xmlData, {
            ignoreAttributes: false
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

});
