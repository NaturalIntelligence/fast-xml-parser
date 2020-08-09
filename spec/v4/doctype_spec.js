const XMLParser = require("../../src/v4/xmlparser");

describe("should parse DOCTYPE tag", function () {

    const parser = new XMLParser();
    //console.log(JSON.stringify(json,null,4))

    it("when internal DOCTYPE with tag and comments", function() {
        const xmlData = "<!--open the DOCTYPE declaration -" +
                        "  the open square bracket indicates an internal DTD-->" +
                        "<!DOCTYPE foo [" +
                        "<!--define the internal DTD-->" +
                        "<!ELEMENT foo (#PCDATA)>" +
                        "<!--close the DOCTYPE declaration-->" +
                        "]>" +
                        "<foo>Hello World.</foo>";

        const expected = {
            foo: "Hello World."
        };

        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("when internal DOCTYPE with tag and comments and XML pi tag", function() {
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
            foo: "Hello World."
        };

        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("throw error without element tag but XML Pi tag presents", function() {

        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
                        "<!--open the DOCTYPE declaration -" +
                        "  the open square bracket indicates an internal DTD-->" +
                        "<!DOCTYPE foo [" +
                        "<!--define the internal DTD-->" +
                        "<!ELEMENT foo (#PCDATA)>" +
                        "<!--close the DOCTYPE declaration-->" +
                        "]>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("No element found.")

    });
    
   
    it("when external DOCTYPE with tag and comments", function() {
        const xmlData = '<!--open the DOCTYPE declaration - -->' + 
                       '<!DOCTYPE chapter' + 
                        'PUBLIC "-//OASIS//DTD DocBook XML//EN" "../dtds/docbookx.dtd">' + 
                        '<chapter>' + 
                            '<title>Chapter 1</title>' +
                        '</chapter>';

        const expected = {
            chapter: {
                "title" : "Chapter 1"
            }
        };

        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("when DOCTYPE in multiple lines", function() {
        const xmlData = `
        <!--open the DOCTYPE declaration - -->
        <!DOCTYPE chapter
        PUBLIC "-//OASIS//DTD DocBook XML//EN" "../dtds/docbookx.dtd">
        <chapter>
            <title>Chapter 1</title>
        </chapter>`;

        const expected = {
            chapter: {
                "title" : "Chapter 1"
            }
        };

        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("throw error when doctype is not ending", function() {
        const xmlData = `
        <!--open the DOCTYPE declaration - -->
        <!DOCTYPE chapter
        PUBLIC "-//OASIS//DTD DocBook XML//EN" "../dtds/docbookx.dtd"
        <chapter>
            <title>Chapter 1</title>
        </chapter>`;

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Closing tag '</chapter>' is not expected. Matching opening tag is not present.")

    });

});