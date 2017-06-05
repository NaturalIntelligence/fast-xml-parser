var parser = require("../bin/parser");

describe("XMLParser", function () {

	it("should parse tag having CDATA", function () {
        var xmlData = "<?xml version='1.0'?>"
                       + "<any_name>"
                       +    "<person>"
                       +        "<phone>+122233344550</phone>"
                       +        "<name><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>"
                       +        "<name><![CDATA[<some>Mohan</some>]]></name>"
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
						            ]
						        }
						    }
						};

        var result = parser.parse(xmlData, {
            ignoreTextNodeAttr: false
        });
        expect(result).toEqual(expected);
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
            ignoreTextNodeAttr: false
        });

        expect(result).toEqual(expected);
    });
});