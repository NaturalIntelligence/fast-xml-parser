var Parser = require("../src/j2x");

describe("XMLParser", function () {

      it("should parse to XML with nested tags", function () {
        var jObj = {
            a : {
                b : {
                    c : "val1",
                    d : "val2"
                }
            }
        };
        var parser = new Parser();
        var result = parser.parse(jObj);
        //console.log(result);
        var expected = "<a><b><c>val1</c><d>val2</d></b></a>"
        expect(result).toEqual(expected);
      });

      it("should parse text property to tag value ", function () {
        var jObj = {
            a : {
                b : {
                    "#text" : "val1",
                    d : "val2"
                }
            }
        };
        var parser = new Parser();
        var result = parser.parse(jObj);
        //console.log(result);
        var expected = "<a><b>val1<d>val2</d></b></a>"
        expect(result).toEqual(expected);
      });


      it("should parse to XML with array", function () {
        var jObj = {
            a : {
                b : [
                    "val1",
                    { c : "val2"}
                ]
            }
        };
        var parser = new Parser();
        var result = parser.parse(jObj);
        var expected = "<a><b>val1</b><b><c>val2</c></b></a>";
        expect(result).toEqual(expected);
      });

      it("should parse  attributes properties as tag when options are not given", function () {
        var jObj = {
            a : {
                "@_b" : "val1",
                "@_c" : "val2"
            }
        };
        var parser = new Parser();
        var result = parser.parse(jObj);
        //console.log(result);
        var expected = "<a><@_b>val1</@_b><@_c>val2</@_c></a>";
        expect(result).toEqual(expected);
      });

      it("should parse to XML with attributes", function () {
        var jObj = {
            a : {
                "@_b" : "val1",
                "#text": "textvalue",
                tag: {
                    k: 34
                },
                "@_c" : "val2"
            }
        };
        var parser = new Parser({
            ignoreAttributes : false,
            attributeNamePrefix : "@_"
        });
        var result = parser.parse(jObj);
        //console.log(result);
        var expected = '<a b="val1" c="val2">textvalue<tag><k>34</k></tag></a>';
        expect(result).toEqual(expected);
      });
});