"use strict";

const {XMLBuilder} = require("../src/fxp");
const he = require("he");

describe("XMLBuilder", function() {

    it("should parse to XML with nested tags", function() {
        const jObj = {
            a: {
                b: {
                    c: "val1",
                    d: "val2"
                }
            }
        };
        const builder = new XMLBuilder;
        const result = builder.build(jObj);
        // console.log(result);
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
        const builder = new XMLBuilder;
        const result = builder.build(jObj);
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
        const builder = new XMLBuilder;
        const result = builder.build(jObj);
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
        const builder = new XMLBuilder;
        const result = builder.build(jObj);
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
        const builder = new XMLBuilder;
        const result = builder.build(jObj);
        //console.log(result);
        const expected = `<a><@_b>val1</@_b><@_c>val2</@_c></a>`;
        expect(result).toEqual(expected);
    });

    //Note: attribute should not be set to an array
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
        const builder = new XMLBuilder({
                                      ignoreAttributes:    false,
                                      attributeNamePrefix: "@_"
                                  });
        const result = builder.build(jObj);
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
        const builder = new XMLBuilder({
                                      ignoreAttributes:    false,
                                      attributeNamePrefix: "@_",
                                      attributesGroupName:        "@"
                                  });
        const result = builder.build(jObj);
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
        const builder = new XMLBuilder({
                                      ignoreAttributes: false
                                  });
        const result = builder.build(jObj);
        //console.log(result);
        const expected = `<a><@><b>val1</b><c>val2</c></@>textvalue<tag><k>34</k></tag></a>`;
        expect(result).toEqual(expected);
    });

    it("should parse null values to self closing tag", function() {
        const jObj = {
            a: null
        };
        const builder = new XMLBuilder;
        const result = builder.build(jObj);
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
                "#text":   "textvalue>",
                tag:       {
                    k:      34,
                    g:      "",
                    nested: {
                        "@": {
                            b: "val>1",
                            c: "val<2"
                        }
                    }
                }
            }
        };
        const builder = new XMLBuilder({
                                      attributeNamePrefix: "",
                                      attributesGroupName:     "@",
                                      encodeHTMLchar:   true,
                                      suppressEmptyNode: true,
                                      processEntities:false
                                  });
        const result = builder.build(jObj);
        // console.log(result);
        const expected = `<a b="val>1" c="val<2"><notattr>val</notattr>textvalue><tag><k>34</k><g/><nested b="val>1" c="val<2"/></tag></a>`;
        expect(result).toEqual(expected);
    });

    it("should format when parsing to XML", function() {
        const jObj = {
            a: {
                "@":       {
                    b: "val>1",
                    c: "val<2"
                },
                "#text":   "textvalue>",
                tag:       {
                    k: 34,
                    g: "35 g>"
                },
                element: {
                    subelement: {
                      "#text": "foo",
                      "@": {"staticMessage": "bar"}
                    }
                },
            }
        };
        const builder = new XMLBuilder({
            attributesGroupName:   "@",
            encodeHTMLchar: true,
            format:         true,
        });
        const result = builder.build(jObj);
        const expected = `
        <a b="val&gt;1" c="val&lt;2">
            textvalue&gt;  <tag>
                <k>34</k>
                <g>35 g&gt;</g>
            </tag>
            <element>
                <subelement staticMessage="bar">foo</subelement>
            </element>
        </a>`;

        // console.log(result);
        //console.log(expected);
        // expect(result).toEqual(expected);
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
    });

    it("should format when parsing to XML when nodes have only a text prop", function() {
      const jObj = {
        a: {
          "@": {
            b: "val>1",
            c: "val<2"
          },
          "#text": "textvalue>",
          tag: {
            k: 34,
            g: "35 g>"
          },
          element: {
            subelement: {
              "#text": "foo",
              "@": {"staticMessage": "bar"}
            }
          },
          only_text_array: [
            {
              '#text': 'text value'
            }
          ],
          only_text_obj: {
            '#text': 'another text val'
          }
      }
    };
    const builder = new XMLBuilder({
      attributesGroupName: "@",
      encodeHTMLchar: true,
      format: true,
    });
    const result = builder.build(jObj);
    const expected = `<a b="val&gt;1" c="val&lt;2">
    textvalue&gt;
  <tag>
    <k>34</k>
    <g>35 g&gt;</g>
  </tag>
  <element>
    <subelement staticMessage="bar">foo</subelement>
  </element>
  <only_text_array>text value</only_text_array>
  <only_text_obj>another text val</only_text_obj>
</a>
`;
    // console.log(result);
    expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
  });

  it("should not double encode tag values for an array node", function() {
    const jObj = {
      a: {
        element: {
          subelement: {
            "#text": "foo & bar",
            "@": {"staticMessage": "bar"}
          }
        },
        only_text_array: [
          {
            '#text': 'text & value'
          }
        ],
        regular_array: [
          {
            '#text': 'text & value',
            '@': {
              'f': 'abc'
            }
          }
        ],
        only_text_obj: {
          '#text': 'another text & val'
        }
      }
    };
    const builder = new XMLBuilder({
      attributesGroupName: "@",
      processEntities: false,
      format: true,
      tagValueProcessor: (tagName, a) => { a = '' + a; return he.encode(a, { useNamedReferences: true }) },
      attributeValueProcessor: (attrName, a) => he.encode(a, { isAttributeValue: true, useNamedReferences: true }),
      attributeNamePrefix: '',
      ignoreAttributes: false,
      suppressEmptyNode: true
    });
    const result = builder.build(jObj);
    const expected = `<a>
  <element>
    <subelement staticMessage="bar">foo &amp; bar</subelement>
  </element>
  <only_text_array>text &amp; value</only_text_array>
  <regular_array f="abc">text &amp; value</regular_array>
  <only_text_obj>another text &amp; val</only_text_obj>
</a>
`;
    // console.log(result);
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
        const builder = new XMLBuilder({
            attributeNamePrefix: "",
            attributesGroupName:        "$",
            textNodeName:        "_",
            ignoreAttributes:    false,
            format:              false,
            indentBy:            "\t",
            suppressEmptyNode:    true
        });
        const result = builder.build(jObj);
        const expected = '<root><element aaa="aaa" bbb="bbb">1</element><element2 aaa="aaa2" bbb="bbb2"><subelement aaa="sub_aaa"/></element2><date>test</date></root>';
        // console.log(result);
        // console.log(expected);
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
        const builder = new XMLBuilder({
            attributeNamePrefix: "",
            attributesGroupName:        "$",
            textNodeName:        "_",
            ignoreAttributes:    false,
            cdataPropName:        "$cdata",
            cdataPositionChar:   "\\c",
            format:              false,
            indentBy:            "\t",
            suppressEmptyNode:    true,
            tagValueProcessor: function(tagName,a) {
                return a;
            },
        });
        const result = builder.build(jObj);
        const expected = '<root><element><date>'+dateVar.toString()+'</date></element><element2 aaa="aaa2" bbb="bbb2"><subelement aaa="sub_aaa"/></element2><date>'+dateVar.toString()+'</date></root>';
        //console.log(result);
        //console.log(expected);
        expect(result).toEqual(expected);
    });

    it("should parse js array to valid XML", function() {
        const cars = [
            {
                "color": "purple",
                "type": "minivan",
                "registration": "2020-02-03",
                "capacity": 7
              },
              {
                "color": "orange",
                "type": "SUV",
                "registration": "2021-05-17",
                "capacity": 4
              },
              {
                "color": "green",
                "type": "coupe",
                "registration": "2019-11-13",
                "capacity": 2
              }
        
        ];
        const builder = new XMLBuilder({
          arrayNodeName: "car"
        });
        const result = builder.build(cars);
        const expected = '<car><color>purple</color><type>minivan</type><registration>2020-02-03</registration><capacity>7</capacity></car><car><color>orange</color><type>SUV</type><registration>2021-05-17</registration><capacity>4</capacity></car><car><color>green</color><type>coupe</type><registration>2019-11-13</registration><capacity>2</capacity></car>';
        // console.log(result);
        //console.log(expected);
        expect(result).toEqual(expected);
    });
    it("should call tagValue processor", function() {

        const xmlBuilder = new XMLBuilder({
          format: true,
          tagValueProcessor: (tagName, tagValue) => tagValue.toUpperCase()
        });

        const expected = `
        <root>
          <test>HELLO</test>
        </root>
        `;
        const result = xmlBuilder.build({ root: { test: 'hello' } });
        expect(result.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
      });
});
