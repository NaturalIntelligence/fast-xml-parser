const XMLParser = require("../../src/v4/xmlparser");

describe("Comments", function(){
    it("should ignore comment", function() {
        const xmlData = `<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag": [1, "val"]
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
    it("should ignore multiline comment", function() {
        const xmlData = `<rootNode><!-- <tag> - - \n --><tag>1</tag><tag>val</tag></rootNode>`;
        const expected = {
            "rootNode": {
                "tag": [1, "val"]
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
    it("should parse ignoring valid comment", function() {
        const xmlData = `<!--
        Within this comment I can use ]]>
        and other reserved characters like <
        &, ', and ", but %MyParamEntity; will not be expanded
        (if I retrieve the text of this node it will contain
        %MyParamEntity; and not "Has been expanded")
        and I can't place two dashes next to each other.
        --><tag></tag>`;

        const expected = {
            "tag": ''
        };

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    //TODO: Error: no element found
    it("should not parse a document with only comment", function() {
        const xmlData = `<!-- comment -->`;

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        });

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("No element found.")

    });

    it("should not parse a document with a comment has -- inside", function() {
        const xmlData = `<!-- comment -- -->`;

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        });

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Comment tag is not well formed. '--' are not allowed inside. <!-- comment -...")
    });

    it("should parse an invalid comment as text value for a tag", function() {
        const xmlData = `<tag>< ab comment ></tag>`;

        const expected = {
            "tag": "<!-- comment -- >"
        };

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        });
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Invalid character '<'. You should use '&lt;' instead")
        
    });

    it("should validate XML with repeated multiline CDATA and comments", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "../assets/mixed.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const expected = {
            "ns:root": {
                "ptag":         [
                    {
                        "__@attr":    "val",
                        "__@boolean": true,
                        "nestedtag": "nesteddata",
                        "__#text":     ["some data","after"]
                    },{
                        "__CDATA": [
                            "\n        <nestedtag>\n            nested cdata 1<!--single line comment-->\n        </nestedtag>\n    ",
                            "\n        <nestedtag>\n            nested cdata 2<!--multi line\n             comment-->\n        </nestedtag>\n    ",
                            "\n        <nestedtag>\n            nested cdata 3\n        </nestedtag>\n    "
                        ],
                        "__#text":     ["before text","middle", "after", "end"]
                    }
                ],
                "__@xmlns:soap": "http://schemas.xmlsoap.org/soap/envelope/"
            }
        };

        const parser = new XMLParser({
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
            removeNSPrefix: false,
            ignoreXmlnsAttributes: false,
        });
        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
});