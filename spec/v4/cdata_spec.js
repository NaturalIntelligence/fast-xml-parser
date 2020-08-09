const XMLParser = require("../../src/v4/xmlparser");
//const XmlParsingError = require("../../src/new/XMLParsingError");

describe("namespace", function(){
    it("should parse tag having CDATA", function() {
        const xmlData = `<a>
                <b ab="cd" bc="xy" boolean><![CDATA[<some>Jack</some>]]></b>
                <c><![CDATA[<some>Jack</some>]]>some<![CDATA[Jack]]><e><f>nested</f><f>nested</f></e></c>
        </a>`;
        const expected = {
            "a": {
                "b": {
                    "__@ab":  "cd" ,
                    "__@bc":  "xy" ,
                    "__@boolean" : true,
                    "__CDATA": "<some>Jack</some>"
                },
                "c": {
                    "__CDATA": [
                        "<some>Jack</some>",
                        "Jack"
                    ],
                    "e": {
                        "f": [ "nested", "nested" ]
                    },
                    "__#text": "some"
                }
            }
        };

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse tag having CDATA with arrayMode = true", function() {
        const xmlData = `<a>
        <b ab="cd" bc="xy" boolean><![CDATA[<some>Jack</some>]]></b>
        <c><![CDATA[<some>Jack</some>]]>some<![CDATA[Jack]]><e><f>nested</f><f>nested</f></e></c>
        </a>`;
        const expected = [{
            "a": [{
                    "b": [{
                        "__@ab":  "cd" ,
                        "__@bc":  "xy" ,
                        "__@boolean" : true,
                        "__CDATA": "<some>Jack</some>"
                    }],
                    "c": [{
                            "__CDATA": [
                                "<some>Jack</some>",
                                "Jack"
                            ],
                            "e": [{
                                "f": [ "nested", "nested" ]
                            }],
                            "__#text": "some"
                    }]
            }]
        }];

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
            arrayMode: true,
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    it("should parse tag having CDATA with arrayMode = 'strict'", function() {
        const xmlData = `<a>
        <b ab="cd" bc="xy" boolean><![CDATA[<some>Jack</some>]]></b>
        <c><![CDATA[<some>Jack</some>]]>some<![CDATA[Jack]]><e><f>nested</f><f>nested</f></e></c>
        </a>`;
        const expected = [{
            "a": [{
                "b": [{
                    "__@": [{
                        "ab": [ "cd" ],
                        "bc": [ "xy" ],
                        "boolean" : [true],
                    }],
                    "__CDATA": [ "<some>Jack</some>" ]
                } ],
                "c": [ {
                    "__CDATA": [
                        "<some>Jack</some>",
                        "Jack"
                    ],
                    "e": [{
                        "f": [ "nested", "nested" ]
                    }],
                    "__#text": [ "some" ]
                } ]
            } ]
        }]
        ;

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            attributesGroupName: "__@",
            ignoreAttributes:    false,
            //arrayMode: true,
            arrayMode: 'strict',
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    it("should parse tag having CDATA with preserveOrder = true", function() {
        const xmlData = `<a>
        <b ab="cd" bc="xy" boolean><![CDATA[<some>Jack</some>]]></b>
        <c><![CDATA[<some>Jack</some>]]>some<![CDATA[Jack]]><e><f>nested</f><f>nested</f></e></c>
        </a>`;
        const expected = [
            { "a": [
                { "b": [
                    {"__@ab": "cd" },
                    {"__@bc": "xy" },
                    {"__@boolean" : true},
                    { "__CDATA": "<some>Jack</some>" }
                ]},
                { "c": [
                    { "__CDATA": "<some>Jack</some>" },
                    { "__#text": "some" },
                    { "__CDATA": "Jack" },
                    {"e": [
                        { "f": "nested" },
                        { "f": "nested" }
                    ]}
                ]}
            ]}
        ];

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
            preserveOrder: true,
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    it("should parse tag having CDATA with preserveOrder = 'strict'", function() {
        const xmlData = `<a>
        <b  ab="cd" bc="xy" boolean><![CDATA[<some>Jack</some>]]></b>
        <c><![CDATA[<some>Jack</some>]]>some<![CDATA[Jack]]><e><f>nested</f><f>nested</f></e></c>
        </a>`;
        const expected = [
            { "a": [
                { "b": [
                    {"__@ab": "cd" },
                    {"__@bc": "xy" },
                    {"__@boolean" : true},
                    { "__CDATA": "<some>Jack</some>" }
                ]},
                { "c": [
                    { "__CDATA": "<some>Jack</some>" },
                    { "__#text": "some" },
                    { "__CDATA": "Jack" },
                    {"e": [
                        { "f": [{ "__#text": 'nested' }] },
                        { "f": [{ "__#text": 'nested' }] }
                    ]}
                ]}
            ]}
        ];

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
            preserveOrder: 'strict',
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse CDATA property with custom name", function() {
        const xmlData = `<a>
                <b><![CDATA[<some>Jack</some>]]></b>
                <c><![CDATA[<some>Jack</some>]]>some<![CDATA[Jack]]></c>
        </a>`;
        const expected = {
            "a": {
                "b": {
                    "__@cdata": "<some>Jack</some>"
                },
                "c": {
                    "__@cdata": [
                        "<some>Jack</some>",
                        "Jack"
                    ],
                    "__#text": "some"
                }
            }
        };

        const parser = new XMLParser({
            cdataPropertyName: "__@cdata",
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });


    it("should parse tag having CDATA 2", function() {
        const xmlData = `\
<sql-queries>
    <sql-query id='testquery'><![CDATA[select * from search_urls]]></sql-query>
    <sql-query id='searchinfo'><![CDATA[select * from search_urls where search_urls=?]]>    </sql-query>
    <sql-query id='searchurls'>      <![CDATA[select search_url from search_urls ]]></sql-query>
</sql-queries>`;
        const expected = {
            "sql-queries": {
                "sql-query": [
                    {
                        "__@id":  "testquery",
                        "__CDATA": "select * from search_urls"
                    }, {
                        "__@id":  "searchinfo",
                        "__CDATA": "select * from search_urls where search_urls=?"
                    }, {
                        "__@id":  "searchurls",
                        "__CDATA": "select search_url from search_urls "
                    }
                ]
            }
        };

        const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
        });
        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse tag having CDATA 3", function() {
        const xmlData = `<a>
        <![CDATA[
            Within this Character Data block I can
            use double dashes as much as I want (along with <, &, ', and ")
            *and* %MyParamEntity; will be expanded to the text
            "Has been expanded" ... however, I can't use
            the CEND sequence. If I need to use CEND I must escape one of the
            brackets or the greater-than sign using concatenated CDATA sections.
            ]]>
</a>`;
        const expected = {
            "a": {
                "__CDATA": `
            Within this Character Data block I can
            use double dashes as much as I want (along with <, &, ', and ")
            *and* %MyParamEntity; will be expanded to the text
            "Has been expanded" ... however, I can't use
            the CEND sequence. If I need to use CEND I must escape one of the
            brackets or the greater-than sign using concatenated CDATA sections.
            `
            }
        };

        const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
        });
        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });
    it("should parse tag having CDATA 4", function() {
        const xmlData = `<a>
        <data><![CDATA[This text contains a CEND ]]]]><![CDATA[>]]></data>
        <alternative><![CDATA[This text contains a CEND ]]]><![CDATA[]>]]></alternative>
</a>`;
        const expected = {
            "a": {
                data: {
                    "__CDATA": [
                        "This text contains a CEND ]]",
                        ">"
                    ]
                },
                alternative: {
                    "__CDATA": [
                        "This text contains a CEND ]",
                        "]>"
                    ]
                }
            }
        };

        const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
        });
        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse tag having test along CDATA", function() {
        const xmlData = `<a>
        <b>before<![CDATA[1234]]><![CDATA[2]]></b>
        <c><![CDATA[ some data ]]>middle<![CDATA[3]]></c>
        <c><![CDATA[1234]]><![CDATA[2]]>end</c>
        <d>before<![CDATA[1234]]>middle<![CDATA[2]]>end</d>
</a>`;
        const expected = {
            "a": {
                b: {
                    "__#text": 'before',
                    "__CDATA": [
                        "1234",
                        "2"
                    ]
                },
                c: [
                    {
                        "__#text": 'middle',
                        "__CDATA": [
                            " some data ",
                            "3"
                        ]
                    },{
                        "__CDATA": [
                            "1234",
                            "2"
                        ],
                        //"__#text": "sd"
                        "__#text": 'end'
                    }
                ],
                d: {
                    "__#text": [ 'before', 'middle', 'end' ],
                    "__CDATA": [
                        "1234",
                        "2"
                    ]
                },
            }
        };

        const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
        });
        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(expected).toEqual(result);
    });
    it("should parse tag having text along CDATA", function() {
        const xmlData = `<a>
        <c><![CDATA[1]]><![CDATA[2]]>end</c>
</a>`;
        const expected = {
            "a": {
                c: {
                    "__#text": 'end',
                    "__CDATA": ["1","2"]
                }
            }
        };

        const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
        });
        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    it("should parse repeated tag having text along CDATA", function() {
        const xmlData = `<a>
        <c><![CDATA[1]]><![CDATA[2]]>end</c>
        <c><![CDATA[1]]><![CDATA[2]]>end</c>
</a>`;
        const expected = {
            "a": {
                c: [ {
                    "__#text": 'end',
                    "__CDATA": ["1","2"]
                }, {
                    "__#text": 'end',
                    "__CDATA": ["1","2"]
                }]
            }
        };

        const parser = new XMLParser({
            ignoreAttributes: false,
            allowBooleanAttributes: true,
        });
        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    
});