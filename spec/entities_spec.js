const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("XMLParser Entities", function() {

    it("should parse attributes with valid names, default entities", function() {
        const xmlData = `<a:root xmlns:a="urn:none" xmlns:a-b="urn:none">
        <a:a attr="2foo&ampbar&apos;">1</a:a>
        <a:b>2</a:b>
        <a-b:b-a>2</a-b:b-a>
        <a:c>test&amp;\r\nтест&lt;\r\ntest</a:c>
        <a:el><![CDATA[<a>&lt;<a/>&lt;b&gt;2</b>]]]]>\r\n<![CDATA[]]]]><![CDATA[>&amp;]]>a</a:el>
        <c:string lang="ru">\
    &#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;\
    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b; \
    &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;\
    </c:string>
    </a:root>`;

        const expected = {
            "a:root": {
                "@_xmlns:a": "urn:none",
                "@_xmlns:a-b": "urn:none",
                "a:a": {
                    "#text": 1,
                    "@_attr": "2foo&ampbar'"
                },
                "a:b": 2,
                "a-b:b-a": 2,
                "a:c": "test&\nтест<\ntest",
                "a:el": "<a><<a/><b>2</b>]]]]>&a",
                "c:string": {
                    "#text": "&#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b;     &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;",
                    "@_lang": "ru"
                }
            }
        };

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData, true);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = "<?xml version='1.0' standalone='no'?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" ><svg><metadata>test</metadata></svg>";
        const expected = {
            "?xml": {
                "@_version": "1.0",
                "@_standalone": "no"
            },
            "svg" : {
                "metadata": "test"
            }
        };

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData, true);

        expect(result).toEqual(expected);
    });

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = `<?xml version='1.0' standalone='no'?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
        <svg>
            <metadata>[test]</metadata>
        </svg>`;
        const expected = {
            "?xml": {
                "@_version": "1.0",
                "@_standalone": "no"
            },
            "svg" : {
                "metadata": "[test]"
            }
        };

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData, true);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });

    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><!DOCTYPE `;
        expect(() =>{
            const parser = new XMLParser();
            parser.parse(xmlData);
        }).toThrowError("Unclosed DOCTYPE")
    })

    it("should parse XML with DOCTYPE", function() {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration -" +
            "  the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>" +
            "<foo>Hello World.</foo>";

        const expected = {
            "?xml": "",
            foo: "Hello World."
        };
        
        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse attributes having '>' in value", function() {
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "&#xA0;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        
        <note>
            <to>Tove</to>
            <from>Jani</from>
            <heading>Reminder</heading>
            <body attr="&writer;">Don't forget me this weekend!</body>
            <footer>&writer;&nbsp;&copyright;</footer>
        </note> `;

        const expected = {
            "?xml": {
                "version": "1.0",
                "encoding": "UTF-8"
            },
            "note": {
                "to": "Tove",
                "from": "Jani",
                "heading": "Reminder",
                "body": {
                    "#text": "Don't forget me this weekend!",
                    "attr": "Writer: Donald Duck."
                },
                "footer": "Writer: Donald Duck.&nbsp;Copyright: W3Schools."
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });
    it("should parse dynamic entity", function() {
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "writer;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        
        <note>
            <heading>Reminder</heading>
            <body attr="&writer;">Don't forget me this weekend!</body>
            <footer>&writer;&&nbsp;&copyright;</footer>
        </note> `;

        const expected = {
            "?xml": {
                "version": "1.0",
                "encoding": "UTF-8"
            },
            "note": {
                "heading": "Reminder",
                "body": {
                    "#text": "Don't forget me this weekend!",
                    "attr": "Writer: Donald Duck."
                },
                "footer": "Writer: Donald Duck.Writer: Donald Duck.Copyright: W3Schools."
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });

    it("should allow !ATTLIST & !NOTATION", function() {
        const xmlData = `<?xml version="1.0"?>
        <!DOCTYPE code [
          <!ELEMENT code (#PCDATA)>
          <!NOTATION vrml PUBLIC "VRML 1.0">
          <!ATTLIST code lang NOTATION (vrml) #REQUIRED>
        ]>
        <code lang="vrml">Some VRML instructions</code>`;

        const expected = {
            "?xml": {
                "version": "1.0"
            },
            "code": {
                "lang": 'vrml',
                "#text": 'Some VRML instructions'
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });

    it("should build by decoding defaul entities", function() {
        const jsObj = {
            "note": {
                "@heading": "Reminder > \"Alert",
                "body": {
                    "#text": " 3 < 4",
                    "attr": "Writer: Donald Duck."
                },
            }
        };

        const expected = `
        <note heading="Reminder &gt; &quot;Alert">
            <body>
             3 &lt; 4
             <attr>Writer: Donald Duck.</attr>
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
            // processEntities: true
        };
        const builder = new XMLBuilder(options);
        const result = builder.build(jsObj);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
    it("should build by decoding defaul entities in prserve mode", function() {
        const jsObj = [
            {
                "note": [
                    {
                        "body": [
                            {
                                "#text": "3 < 4"
                            },
                            {
                                "attr": [
                                    {
                                        "#text": "Writer: Donald Duck."
                                    }
                                ]
                            }
                        ]
                    }
                ],
                ":@": {
                    "@heading": "Reminder > \"Alert"
                }
            }
        ];

        const expected = `
        <note heading="Reminder &gt; &quot;Alert">
            <body>
             3 &lt; 4
             <attr>Writer: Donald Duck.</attr>
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
            preserveOrder: true,
            // processEntities: false
        };

        const parser = new XMLParser(options);
        let result = parser.parse(expected);
        // console.log(JSON.stringify(result,null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(jsObj);
        // console.log(result);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });

    it("should parse HTML entities when htmlEntities:true", function() {
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "writer;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        
        <note>
            <heading>Reminder</heading>
            <body attr="&writer;">Don't forget me this weekend!&reg;</body>
            <footer>&writer;&&nbsp;&copyright;&inr;</footer>
        </note> `;

        const expected = {
            "?xml": {
                "version": "1.0",
                "encoding": "UTF-8"
            },
            "note": {
                "heading": "Reminder",
                "body": {
                    "#text": "Don't forget me this weekend!®",
                    "attr": "Writer: Donald Duck."
                },
                "footer": "Writer: Donald Duck.Writer: Donald Duck.Copyright: W3Schools.₹"
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            processEntities: true,
            htmlEntities: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result).toEqual(expected);
    });
});

describe("XMLParser External Entites", function() {
    it("should throw error when an entity value has '&'", function() {
        const parser = new XMLParser();
        expect( () => {
            parser.addEntity("#xD", "&\r");
        }).toThrowError("Entity value can't have '&'");
    });

    it("should throw error when an entity identifier has '&'", function() {
        const parser = new XMLParser();
        expect( () => {
            parser.addEntity("&#xD", "\r");
        }).toThrowError("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    });
    
    it("should throw error when an entity identifier has ';'", function() {
        const parser = new XMLParser();
        expect( () => {
            parser.addEntity("#xD;", "\r");
        }).toThrowError("An entity must be set without '&' and ';'. Eg. use '#xD' for '&#xD;'");
    });
    
    it("should set and parse for valid entity set externally", function() {
        const xmlData = `<note>&unknown;&#xD;last</note> `;

        const parser = new XMLParser();
        parser.addEntity("#xD", "\r\n");
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result.note).toEqual(`&unknown;\r\nlast`);
    });
    
    it("External Entity can change the behaviour of default entites", function() {
        const xmlData = `<note>&gt;last</note> `;

        const parser = new XMLParser();
        parser.addEntity("gt", "<>");
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result.note).toEqual(`<>last`);
    });
    
    it("Same external Entity can be set by multiple times", function() {
        const xmlData = `<note>&gt;last</note> `;

        const parser = new XMLParser();
        parser.addEntity("gt", "<>");
        parser.addEntity("gt", "><");
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));

        expect(result.note).toEqual(`><last`);
    });
    it("should build by decoding '&' prserve mode", function() {
        const jsObj = [
            {
                "note": [
                    {
                        "body": [
                            { "#text": "(3 & 4) < 5" },
                            { "attr": [ { "#text": "Writer: Donald Duck." } ] }
                        ]
                    }
                ],
                ":@": {
                    "@heading": "Reminder > \"Alert"
                }
            }
        ];

        const expected = `
        <note heading="Reminder &gt; &quot;Alert">
            <body>
             (3 &amp; 4) &lt; 5
             <attr>Writer: Donald Duck.</attr>
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
            preserveOrder: true,
            // processEntities: false
        };

        const parser = new XMLParser(options);
        let result = parser.parse(expected);
        // console.log(JSON.stringify(result,null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(jsObj);
        // console.log(result);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
    it("should build by decoding '&'", function() {
        const jsObj = {
            "note": {
                "body": {
                    "attr": "Writer: Donald Duck.",
                    "#text": "(3 & 4) < 5"
                },
                "@heading": "Reminder > \"Alert"
            }
        };

        const expected = `
        <note heading="Reminder &gt; &quot;Alert">
            <body>
            <attr>Writer: Donald Duck.</attr>
             (3 &amp; 4) &lt; 5
            </body>
        </note>`;

        const options = {
            attributeNamePrefix: "@",
            ignoreAttributes:    false,
        };

        const parser = new XMLParser(options);
        let result = parser.parse(expected);
        // console.log(JSON.stringify(result,null,4));
        // expect(expected).toEqual(jsObj);

        const builder = new XMLBuilder(options);
        const output = builder.build(jsObj);
        // console.log(output);
        expect(output.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });
});