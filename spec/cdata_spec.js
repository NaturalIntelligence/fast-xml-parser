"use strict";

const {XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {
    it("should parse multiline tag value when tags without spaces", function() {
        const xmlData = `<root><person>lastname
firstname
patronymic</person></root>`;


        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        const expected = {
            "root": {
                "person": "lastname\nfirstname\npatronymic"
            }
        };

        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });
    it("should parse tag having CDATA", function() {
        const xmlData = `
<any_name>
    <person>
        <phone>+122233344550</phone>
        <name><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>
        <name><![CDATA[<some>Mohan</some>]]></name>
        <blank><![CDATA[]]></blank>
        <regx><![CDATA[^[ ].*$]]></regx>
        <phone>+122233344551</phone>
    </person>
</any_name>`;
        const expected = {
            "any_name": {
                "person": {
                    "phone": [
                        122233344550,
                        122233344551
                    ],
                    "name":  [
                        `<some>Jack</some>Jack`,
                        `<some>Mohan</some>`
                    ],
                    "blank": "",
                    "regx":  "^[ ].*$"
                }
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should build XML with CDATA for repeated values without parseOrder", function() {
        const input = {
            "any_name": {
                "person": {
                    "phone": [
                        122233344550,
                        122233344551,
                        ""
                    ],
                    "name":  [
                        `<some>Jack</some>Jack`,
                        `<some>Mohan</some>`
                    ],
                    "blank": "",
                    "regx":  "^[ ].*$"
                }
            }
        };
        const expected = `
        <any_name>
            <person>
                <![CDATA[122233344550]]>
                <![CDATA[122233344551]]>
                <![CDATA[]]>
                <name><some>Jack</some>Jack</name>
                <name><some>Mohan</some></name>
                <blank></blank>
                <regx>^[ ].*$</regx>
            </person>
        </any_name>`;
        
        const options = {
            processEntities:false,
            format: true,
            ignoreAttributes: false,
            cdataPropName: "phone"
        };

        const builder = new XMLBuilder(options);
        const xmlOutput = builder.build(input);
        // console.log(xmlOutput);
        expect(xmlOutput.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
    
    it("should build XML with CDATA for single value without parseOrder", function() {
        const input = {
            "any_name": {
                "person": {
                    "phone": [
                        122233344550,
                        122233344551,
                        ""
                    ],
                    "name":  [
                        `<some>Jack</some>Jack`,
                        `<some>Mohan</some>`
                    ],
                    "blank": "",
                    "regx":  "^[ ].*$"
                }
            }
        };
        const expected = `
        <any_name>
            <person>
                <phone>122233344550</phone>
                <phone>122233344551</phone>
                <phone></phone>
                <name><some>Jack</some>Jack</name>
                <name><some>Mohan</some></name>
                <blank></blank>
                <![CDATA[^[ ].*$]]>
            </person>
        </any_name>`;
        
        const options = {
            processEntities:false,
            format: true,
            ignoreAttributes: false,
            cdataPropName: "regx"
        };

        const builder = new XMLBuilder(options);
        const xmlOutput = builder.build(input);
        // console.log(xmlOutput);
        expect(xmlOutput.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });

    it("should parse tag having CDATA 2", function() {
        const xmlData = `\
<sql-queries>
    <sql-query id='testquery'><![CDATA[select * from search_urls]]></sql-query>
    <sql-query id='searchinfo'><![CDATA[select * from search_urls where search_urls=?]]></sql-query>
    <sql-query id='searchurls'><![CDATA[select search_url from search_urls ]]></sql-query>
</sql-queries>`;
        const expected = {
            "sql-queries": {
                "sql-query": [
                    {
                        "@_id":  "testquery",
                        "#text": "select * from search_urls"
                    }, {
                        "@_id":  "searchinfo",
                        "#text": "select * from search_urls where search_urls=?"
                    }, {
                        "@_id":  "searchurls",
                        "#text": "select search_url from search_urls "
                    }
                ]
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);

        expect(result).toBe(true);
    });

    it("should parse tag having whitespaces before / after CDATA", function() {
        const xmlData = `\
<xml>
    <a>text</a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>    </c>
    <d><![CDATA[text]]></d>
</xml>`;
        const expected = {
            "xml": {
                "a": "text",
                "b": "text",
                "c": "text",
                "d": "text"
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should ignore comment", function() {
        const xmlData = `<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>`;

        const expected = {
            "rootNode": {
                "tag": [1, "val"]
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should ignore multiline comments", function() {
        const xmlData = "<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>";

        const expected = {
            "rootNode": {
                "tag": [1, "val"]
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse tag having text before / after CDATA", function() {
        const xmlData = `\
<xml>
    <a>text</a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>before<![CDATA[text]]>   after  t</d>
</xml>`;
        const expected = {
            "xml": {
                "a": "text",
                "b": "text",
                "c": "textafter",
                "d": "beforetextafter  t"
            }
        };

        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse tag value if having CDATA", function() {
        const xmlData = `\
<xml>
    <a>text</a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>23<![CDATA[]]>   24</d>
</xml>`;
        const expected = {
            "xml": {
                "a": "text",
                "b": "text",
                "c": "textafter",
                "d": "2324"
            }
        };

        
        const options = {
            ignoreAttributes: false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse CDATA as separate tag", function() {
        const xmlData = `\
<xml>
    <a><![CDATA[text]]></a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>23<![CDATA[]]>   24</d>
</xml>`;
        const expected = {
            "xml": {
                "a": {
                    "__cdata": "text"
                },
                "b": "text",
                "c": {
                    "#text":   "after",
                    "__cdata": "text"
                },
                "d": {
                    "#text":   "2324",
                    "__cdata": ""
                }
            }
        };

        const options = {
            ignoreAttributes: false,
            cdataPropName:     "__cdata"
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse CDATA as separate tag without preserving cdata position", function() {
        const xmlData = `\
<xml>
    <a><![CDATA[text]]></a>
    <b>\n       text    \n</b>
    <c>     <![CDATA[text]]>after    </c>
    <d>23<![CDATA[]]>   24</d>
</xml>`;
        const expected = {
            "xml": {
                "a": {
                    "__cdata": "text"
                },
                "b": "text",
                "c": {
                    "#text":   "after",
                    "__cdata": "text"
                },
                "d": {
                    "#text":   "2324",
                    "__cdata": ""
                }
            }
        };

        const options = {
            ignoreAttributes: false,
            cdataPropName:     "__cdata"
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate XML with repeated multiline CDATA and comments", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/mixed.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const expected = {
            "?xml": {
                "@_version": "1.0",
                "@_standalone": "yes"
            },
            "ns:root": {
                "ptag":         [
                    {
                        "nestedtag": "nesteddata",
                        "@_attr":    "val",
                        "@_boolean": true,
                        "#text":     "some dataafter"
                    },
                    "before text\n        <nestedtag>\n            nested cdata 1<!--single line comment-->\n        </nestedtag>\n    middle\n        <nestedtag>\n            nested cdata 2<!--multi line\n             comment-->\n        </nestedtag>\n    after\n        <nestedtag>\n            nested cdata 3\n        </nestedtag>\n    end"
                ],
                "@_xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/"
            }
        };

        const options = {
            ignoreAttributes: false,
            allowBooleanAttributes: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    
    it("should parse CDATA with 0", function() {
        const xmlData = `<a> <![CDATA[0]]> </a>`;

        const expected = { a: { '##cdata': '0' } };

        const options = {
            cdataPropName: "##cdata",
            // preserveOrder: true
        };

        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not process entities in CDATA", function() {
        const xmlData =`<xml><![CDATA[&lt;text&gt;]]></xml>`;

        const expected = { xml: '&lt;text&gt;' };

        const options = {
            ignoreAttributes: false,
        };

        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
});
