"use strict";

const Parser = require("../src/parser").j2xParser;
const he = require("he");

describe("XMLParser", function() {

    it("should parse to XML with nested tags", function() {
        const jObj = {
            a: {
                b: {
                    c: "val1",
                    d: "val2"
                }
            }
        };
        const parser = new Parser();
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><b><c>val1</c><d>val2</d></b></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse text property to tag value ", function() {
        const jObj = {
            a: {
                b: {
                    "#text": "val1",
                    d:       "val2"
                }
            }
        };
        const parser = new Parser();
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><b>val1<d>val2</d></b></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse to XML with array", function() {
        const jObj = {
            a: {
                b: [
                    "val1",
                    {c: "val2"}
                ]
            }
        };
        const parser = new Parser();
        const result = parser.parse(jObj);
        const expected = `<a><b>val1</b><b><c>val2</c></b></a>`;
        expect(result).toEqual(expected);
    });

    it("should supress undefined nodes", function() {
        const jObj = {
            a: {
                b: [
                    undefined,
                    "val1",
                    {
                        c: "val2",
                        d: undefined,
                        e: "val3"
                    }
                ]
            }
        };
        const parser = new Parser();
        const result = parser.parse(jObj);
        const expected = "<a><b>val1</b><b><c>val2</c><e>val3</e></b></a>";
        expect(result).toEqual(expected);
    });

    it("should parse  attributes properties as tag when options are not given", function() {
        const jObj = {
            a: {
                "@_b": "val1",
                "@_c": "val2"
            }
        };
        const parser = new Parser();
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><@_b>val1</@_b><@_c>val2</@_c></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse to XML with attributes", function() {
        const jObj = {
            a: {
                "@_b":   "val1",
                "#text": "textvalue",
                tag:     {
                    k: 34
                },
                "@_c":   "val2"
            }
        };
        const parser = new Parser({
                                      ignoreAttributes:    false,
                                      attributeNamePrefix: "@_"
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a b="val1" c="val2">textvalue<tag><k>34</k></tag></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse to XML with attributes as separate node", function() {
        const jObj = {
            a: {
                "@":     {
                    b: "val1",
                    c: "val2"
                },
                "#text": "textvalue",
                tag:     {
                    k: 34
                }
            }
        };
        const parser = new Parser({
                                      ignoreAttributes:    false,
                                      attributeNamePrefix: "@_",
                                      attrNodeName:        "@"
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a b="val1" c="val2">textvalue<tag><k>34</k></tag></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse grouped attributes as tag name when options are not set", function() {
        const jObj = {
            a: {
                "@":     {
                    b: "val1",
                    c: "val2"
                },
                "#text": "textvalue",
                tag:     {
                    k: 34
                }
            }
        };
        const parser = new Parser({
                                      ignoreAttributes: false
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><@><b>val1</b><c>val2</c></@>textvalue<tag><k>34</k></tag></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse to XML with cdata", function() {
        const jObj = {
            a: {
                "@":       {
                    b: "val1",
                    c: "val2"
                },
                "#text":   "textvalue\\c",
                "__cdata": "this text is from CDATA",
                tag:       {
                    k: 34
                }
            }
        };
        const parser = new Parser({
                                      cdataTagName: "__cdata"
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><@><b>val1</b><c>val2</c></@>textvalue<![CDATA[this text is from CDATA]]><tag><k>34</k></tag></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse to XML with multiple cdata", function() {
        const jObj = {
            a: {
                "@":       {
                    b: "val1",
                    c: "val2"
                },
                "#text":   "text\\cvalue\\c",
                tag:       {
                    k: 34
                },
                "__cdata": [
                    "this text is from CDATA",
                    "this is another text"
                ]
            }
        };
        const parser = new Parser({
                                      cdataTagName: "__cdata"
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><@><b>val1</b><c>val2</c></@><tag><k>34</k></tag>text<![CDATA[this text is from CDATA]]>value<![CDATA[this is another text]]></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse to XML with multiple cdata but textnode is not present", function() {
        const jObj = {
            a: {
                "@":       {
                    b: "val1",
                    c: "val2"
                },
                tag:       {
                    k: 34
                },
                "__cdata": [
                    "this text is from CDATA",
                    "this is another text"
                ]
            }
        };
        const parser = new Parser({
                                      cdataTagName: "__cdata"
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a><@><b>val1</b><c>val2</c></@><tag><k>34</k></tag><![CDATA[this text is from CDATA]]><![CDATA[this is another text]]></a>`;
        expect(result).toEqual(expected);
    });

    it("should encode HTML char when parsing to XML", function() {
        const jObj = {
            a: {
                "@":       {
                    b: "val>1",
                    c: "val<2"
                },
                "#text":   "text\\cvalue>\\c",
                tag:       {
                    k: 34,
                    g: "35 g>"
                },
                "__cdata": [
                    "this text is > from CDATA",
                    "this is another text"
                ]
            }
        };
        const parser = new Parser({
                                      cdataTagName:   "__cdata",
                                      attrNodeName:   "@",
                                      encodeHTMLchar: true,
                                      tagValueProcessor: a=> { a= ''+ a; return he.encode(a, { useNamedReferences: true}) },
                                      attrValueProcessor: a=> he.encode(a, {isAttributeValue: true, useNamedReferences: true})
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a b="val&gt;1" c="val&lt;2"><tag><k>34</k><g>35 g&gt;</g></tag>text<![CDATA[this text is > from CDATA]]>value&gt;<![CDATA[this is another text]]></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse null values to self closing tag", function() {
        const jObj = {
            a: null
        };
        const parser = new Parser();
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a/>`;
        expect(result).toEqual(expected);
    });

    it("should supress empty node to self closing node when parsing to XML", function() {
        const jObj = {
            a: {
                "notattr" : "val",
                "@":       {
                    b: "val>1",
                    c: "val<2"
                },
                "#text":   "text\\cvalue>\\c",
                tag:       {
                    k:      34,
                    g:      "",
                    nested: {
                        "@": {
                            b: "val>1",
                            c: "val<2"
                        }
                    }
                },
                "__cdata": [
                    "this text is > from CDATA",
                    ""
                ]
            }
        };
        const parser = new Parser({
                                      cdataTagName:     "__cdata",
                                      attributeNamePrefix: "",
                                      attrNodeName:     "@",
                                      encodeHTMLchar:   true,
                                      supressEmptyNode: true,
                                      tagValueProcessor: a=> { a= ''+ a; return he.encode(a, { useNamedReferences: true}) },
                                      attrValueProcessor: a=> he.encode(a, {isAttributeValue: true, useNamedReferences: true})
                                  });
        const result = parser.parse(jObj);
        //console.log(result);
        const expected = `<a b="val&gt;1" c="val&lt;2"><notattr>val</notattr><tag><k>34</k><g/><nested b="val&gt;1" c="val&lt;2"/></tag>text<![CDATA[this text is > from CDATA]]>value&gt;<![CDATA[]]></a>`;
        expect(result).toEqual(expected);
    });

    it("should format when parsing to XML", function() {
        const jObj = {
            a: {
                "@":       {
                    b: "val>1",
                    c: "val<2"
                },
                "#text":   "text\\cvalue>\\c",
                tag:       {
                    k: 34,
                    g: "35 g>"
                },
                "__cdata": [
                    "this text is > from CDATA",
                    "this is another text"
                ],
                element: {
                    subelement: {
                      "#text": "foo",
                      "@": {"staticMessage": "bar"}
                    }
                },
            }
        };
        const parser = new Parser({
                                      cdataTagName:   "__cdata",
                                      attrNodeName:   "@",
                                      encodeHTMLchar: true,
                                      format:         true,
                                      tagValueProcessor: a=> { a= ''+ a; return he.encode(a, { useNamedReferences: true}) },
                                      attrValueProcessor: a=> he.encode(a, {isAttributeValue: true, useNamedReferences: true})
                                  });
        const result = parser.parse(jObj);
        const expected = `<a b="val&gt;1" c="val&lt;2">
  <tag>
    <k>34</k>
    <g>35 g&gt;</g>
  </tag>
  text<![CDATA[this text is > from CDATA]]>value&gt;<![CDATA[this is another text]]>
  <element>
    <subelement staticMessage="bar">foo</subelement>
  </element>
</a>
`;
        //console.log(result);
        //console.log(expected);
        expect(result).toEqual(expected);
    });


    it("should format when parsing to XML", function() {
        const jObj = {
            root: {
                element:  {
                    $: {
                        aaa: "aaa",
                        bbb: "bbb"
                    },
                    _: 1
                },
                element2: {
                    $:          {
                        aaa: "aaa2",
                        bbb: "bbb2"
                    },
                    subelement: {$: {aaa: "sub_aaa"}}
                },
                date:"test"
            }
        };
        const parser = new Parser({
            attributeNamePrefix: "",
            attrNodeName:        "$",
            textNodeName:        "_",
            ignoreAttributes:    false,
            cdataTagName:        "$cdata",
            cdataPositionChar:   "\\c",
            format:              false,
            indentBy:            "\t",
            supressEmptyNode:    true
        });
        const result = parser.parse(jObj);
        const expected = '<root><element aaa="aaa" bbb="bbb">1</element><element2 aaa="aaa2" bbb="bbb2"><subelement aaa="sub_aaa"/></element2><date>test</date></root>';
        //console.log(result);
        //console.log(expected);
        expect(result).toEqual(expected);
    });

    it("should pars to XML from js object with date object", function() {
        const dateVar = new Date();
        const jObj = {
            root: {
                element:  {
                    "date" : dateVar
                },
                element2: {
                    $:          {
                        aaa: "aaa2",
                        bbb: "bbb2"
                    },
                    subelement: {$: {aaa: "sub_aaa"}}
                },
                date: dateVar
            }
        };
        const parser = new Parser({
            attributeNamePrefix: "",
            attrNodeName:        "$",
            textNodeName:        "_",
            ignoreAttributes:    false,
            cdataTagName:        "$cdata",
            cdataPositionChar:   "\\c",
            format:              false,
            indentBy:            "\t",
            supressEmptyNode:    true,
            tagValueProcessor: function(a) {
                return a;
            },
        });
        const result = parser.parse(jObj);
        const expected = '<root><element><date>'+dateVar.toString()+'</date></element><element2 aaa="aaa2" bbb="bbb2"><subelement aaa="sub_aaa"/></element2><date>'+dateVar.toString()+'</date></root>';
        //console.log(result);
        //console.log(expected);
        expect(result).toEqual(expected);
    });

});
