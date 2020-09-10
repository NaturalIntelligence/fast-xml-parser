"use strict";

const parser = require("../src/parser");
const validator = require("../src/validator");
const he = require("he");

describe("XMLParser", function() {
    
    it("should parse attributes having '>' in value", function() {
        const xmlData = `<? xml version = "1.0" encoding = "UTF - 8" ?>
        <testStep type="restrequest" name="test step name (bankId -> Error)" id="90e453d3-30cd-4958-a3be-61ecfe7a7cbe">
              <settings/>
              <encoding>UTF-8</encoding>
        </testStep>`;

        const expected = {
            "testStep": {
                "type": "restrequest",
                "name":       "test step name (bankId -> Error)",
                "id":     "90e453d3-30cd-4958-a3be-61ecfe7a7cbe",
                "settings": "",
                "encoding": "UTF-8"
            }
        };

        let result = parser.parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            //parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse attributes with valid names", function() {
        const xmlData = `
        <a>
            <bug atr="sasa" boolean>val
                <b/>
                <br/>
                <br b/>
                <c>some<!--single line comment--></c>here
            </bug>as well
        </a>`;

        const expected = {
            "a": {
                "#text": "as well",
                "bug": {
                    "#text": "valhere",
                    "@_atr": "sasa",
                    "@_boolean": true,
                    "b": "",
                    "br": [
                        "",
                        {
                            "@_b": true
                        }
                    ],
                    "c": "some"
                }
            }
        };

        let result = parser.parse(xmlData, {
            //attributeNamePrefix: "",
            ignoreAttributes:    false,
            //parseAttributeValue: true,
            allowBooleanAttributes: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    
    it("should parse attributes with valid names", function() {
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
                    "@_attr": "2foo&ampbar&apos;"
                },
                "a:b": 2,
                "a-b:b-a": 2,
                "a:c": "test&amp;\nтест&lt;\ntest",
                "a:el": "<a>&lt;<a/>&lt;b&gt;2</b>]]]]>&amp;a",
                "c:string": {
                    "#text": "&#x441;&#x442;&#x440;&#x430;&#x445;&#x43e;&#x432;&#x430;&#x43d;&#x438;&#x44f;    » &#x43e;&#x442; &#x441;&#x443;&#x43c;&#x43c;&#x44b;     &#x435;&#x433;&#x43e; &#x430;&#x43a;&#x442;&#x438;&#x432;&#x43e;&#x432;",
                    "@_lang": "ru"
                }
            }
        };

        let result = parser.parse(xmlData, {
            //attributeNamePrefix: "",
            ignoreAttributes:    false,
            //parseAttributeValue: true,
            allowBooleanAttributes: true
        }, true);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    
    it("should parse tagName without whitespace chars", function() {
        const xmlData = `<a:root
         attr='df'>val
    </a:root>`;

        const expected = {
            "a:root": {
                "@_attr": "df",
                "#text": "val",
            }
        };

        let result = parser.parse(xmlData, {
            //attributeNamePrefix: "",
            ignoreAttributes:    false,
            //parseAttributeValue: true,
            allowBooleanAttributes: true
        }, true);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = "<?xml version='1.0' standalone='no'?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" ><svg><metadata>test</metadata></svg>";
        const expected = {
            "svg" : {
                "metadata": "test"
            }
        };

        const result = parser.parse(xmlData, {
            ignoreAttributes:       false,
            allowBooleanAttributes: true
        });
        expect(result).toEqual(expected);
    });

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = `<?xml version='1.0' standalone='no'?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
        <svg>
            <metadata>[test]</metadata>
        </svg>`;
        const expected = {
            "svg" : {
                "metadata": "[test]"
            }
        };

        const result = parser.parse(xmlData, {
            ignoreAttributes:       false,
            allowBooleanAttributes: true
        });
        expect(result).toEqual(expected);
    });

    it("should parse XML with undefined as text", function() {
        const xmlData = `<tag><![CDATA[undefined]]><nested>undefined</nested></tag>`;
        const expected = {
            "tag" : {
                "#text": "undefined",
                "nested": "undefined"
            }
        };

        const result = parser.parse(xmlData, {
            ignoreAttributes:       false,
            allowBooleanAttributes: true
        });
        expect(result).toEqual(expected);
    });

    it("should trim \t or \n chars", function() {
        const xmlData = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n" +
        "<MPD\n" +
        "\tavailabilityStartTime=\"2020-02-16T10:52:03.119Z\"\n" +
        "\txmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\">\n" +
        "\t<Period\n" +
        "\t\tid=\"1578477220\">\n" +
        "\t</Period>\n" +
        "</MPD>";
        const expected = {
            "MPD": {
                "$": {
                  "availabilityStartTime": "2020-02-16T10:52:03.119Z",
                  "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance"
                },
                "Period": {
                    "$": {
                        "id": "1578477220"
                    }
                }
            }
        }

        const result = parser.parse(xmlData, {
            ignoreAttributes:       false,
            allowBooleanAttributes: true,
            attrNodeName:"$",
            attributeNamePrefix : "" //TODO attr node prefix should not set when they're grouped
        });
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><tag></tag`;
        expect(() =>{
            parser.parse(xmlData);
        }).toThrowError("Closing Tag is not closed.")
    })
    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><!-- bad `;
        expect(() =>{
            parser.parse(xmlData);
        }).toThrowError("Comment is not closed.")
    })
    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><![CDATA ]`;
        expect(() =>{
            parser.parse(xmlData);
        }).toThrowError("CDATA is not closed.")
    })
    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><!DOCTYPE `;
        expect(() =>{
            parser.parse(xmlData);
        }).toThrowError("DOCTYPE is not closed.")
    })
    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><?pi  `;
        expect(() =>{
            parser.parse(xmlData);
        }).toThrowError("Pi Tag is not closed.")
    })
    
    it("should parse XML when there is a space after tagname", function() {
        const xmlData = `<tag ><![CDATA[undefined]]><nested>undefined</nested></tag>`;
        const expected = {
            "tag" : {
                "#text": "undefined",
                "nested": "undefined"
            }
        };

        const result = parser.parse(xmlData, {
            ignoreAttributes:       false,
            allowBooleanAttributes: true
        },true);
        expect(result).toEqual(expected);
    });
});
