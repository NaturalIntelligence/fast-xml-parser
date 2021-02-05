"use strict";

const fs = require("fs");
const path = require("path");
const validator = require("../src/validator");

function validate(xmlData, error, line = 1) {
    const result = validator.validate(xmlData);
    if (error) {

        const keys = Object.keys(error);
        const expected = {
            code: keys[0],
            msg: error[keys[0]],
            line
        };
        expect(result.err).toEqual(expected);
    } else {
        expect(result).toBe(true);
    }
}

function validateFile(fileName, ...args) {
    const fileNamePath = path.join(__dirname, "assets/" + fileName);
    validate(fs.readFileSync(fileNamePath).toString(), ...args);
}

describe("XMLParser", function () {
    it("should validate simple xml string", function () {
        validate("<rootNode></rootNode>");
        validate(`<rootNode></rootNode     >`);
    });

    it("should not validate invalid starting tag", function () {
        validate("< rootNode></rootNode>", {
            InvalidTag: "There is an unnecessary space between tag name and backward slash '</ ..'."
        });
    });

    it("should not validate incomplete xml string", function () {
        validate("<rootNode>", {
            InvalidXml: "Invalid '[    \"rootNode\"]' found."
        });
    });

    it("should not validate invalid starting tag for following characters", function () {
        validate("<rootNode#@aa></rootNode#@aa>", {
            InvalidTag: "Tag 'rootNode#@aa' is an invalid name."
        });
    });

    it("should return false for non xml text", function () {
        validate("rootNode", {
            InvalidChar: "char 'r' is not expected."
        });
    });

    it("should validate self closing tags", function () {
        validate("<rootNode><validtag1  /><validtag2/><validtag3  with='attrib'/><validtag4 />text<validtag5/>text</rootNode>");
    });

    it("should not consider these as self closing tags", function () {
        validate("<rootNode><validtag1/><invalid tag/><validtag3  with='attrib'/></rootNode>", {
            InvalidAttr: "boolean attribute 'tag' is not allowed."
        });
        validate("<rootNode><notSelfClosing/ ></rootNode>", {
            InvalidAttr: "Attribute '/' has no space in starting."
        });
    });


    it("should not validate xml string when closing tag is different", function () {
        validate("<rootNode></rootnode>", {
            InvalidTag: "Closing tag 'rootNode' is expected inplace of 'rootnode'."
        });
    });

    it("should not validate xml string when closing tag is invalid", function () {
        validate("<rootNode>< /rootnode>", {
            InvalidTag: "There is an unnecessary space between tag name and backward slash '</ ..'."
        });
        validate("<rootNode></ rootnode>", {
            InvalidTag: "There is an unnecessary space between tag name and backward slash '</ ..'."
        });
        validate("<rootNode></rootnode 123>", {
            InvalidTag: "Closing tag 'rootnode' can't have attributes or invalid starting."
        });
    });

    it("should validate simple xml string with namespace", function () {
        validate("<root:Node></root:Node>");
    });

    it("should not validate xml string with namespace when closing tag is diffrent", function () {
        validate("<root:Node></root:node>", {
            InvalidTag: "Closing tag 'root:Node' is expected inplace of 'root:node'."
        });
    });

    it("should validate simple xml string with value", function () {
        validate("<root:Node>some value</root:Node>");
    });

    it("should not validate simple xml string with value but not matching closing tag", function () {
        validate("<root:Node>some value</root>", {
            InvalidTag: "Closing tag 'root:Node' is expected inplace of 'root'."
        });
    });

    it("should not validate simple xml string with value but no closing tag", function () {
        validate("<root:Node>some value", {
            InvalidXml: "Invalid '[    \"root:Node\"]' found."
        });
    });

    it("should validate xml with nested tags", function () {
        validate("<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>");
    });

    it("should not validate xml with wrongly nested tags", function () {
        validate("<rootNode><tag><tag1></tag>1</tag1><tag>val</tag></rootNode>", {
            InvalidTag: "Closing tag 'tag1' is expected inplace of 'tag'."
        });
    });

    it("should validate xml with comment", function () {
        validate("<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>");
    });

    it("should validate xml with comment", function () {
        validate("<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>");
    });

    it("should not validate xml with comment in a open tag", function () {
        validate("<rootNode<!-- <tag> -- -->><tag>1</tag><tag>val</tag></rootNode>", {
            InvalidTag: "Tag 'rootNode<!--' is an invalid name."
        });
    });

    it("should not validate xml with comment in a open tag", function () {
        validate("<rootNode <!-- <tag> -- --> ><tag>1</tag><tag>val</tag></rootNode>", {
            InvalidAttr: "boolean attribute '<!--' is not allowed."
        });
    });

    it("should correctly identify self closing tags", function () {
        validate("<rootNode><in/valid></in/valid></rootNode>", {
            InvalidTag: "Tag 'in/valid' is an invalid name."
        });
        validate("<rootNode><in#valid/></rootNode>", {
            InvalidTag: "Tag 'in#valid' is an invalid name."
        });
    });

    it("should not validate xml with non closing comment", function () {
        validate("<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>", {
            InvalidXml: "Invalid '[    \"rootNode\"]' found."
        });
    });

    it("should not validate xml with unclosed tag", function () {
        validate("<rootNode  abc='123' bc='567'", {
            InvalidXml: "Invalid '[    \"rootNode\"]' found."
        });
    });

    it("should validate xml with CDATA", function () {
        validate("<name><![CDATA[Jack]]></name>");
    });

    it("should validate xml with repeated CDATA", function () {
        validate("<name><![CDATA[Jack]]><![CDATA[Jack]]></name>");
    });

    it("should validate xml when CDATA consist regx or blank data", function () {
        validate("<name><![CDATA[]]><![CDATA[^[ ].*$]]></name>");
    });

    it("should return false when tag starts with xml or XML etc", function () {
        /* const error = (tag) => ({
            InvalidTag: `Tag '${tag}' is an invalid name.`
        });
        validate("<xmlNode  abc='123' bc='567'>val</xmlNode>", error("xmlNode"));
        validate("<XmLNode  abc='123' bc='567'></XmLNode>", error("XmLNode"));
        validate("<xMLNode/>", error("xMLNode")); */
    });

    it("should return true for valid tag", function () {
        validate("<ns:start_tag-2.0></ns:start_tag-2.0>");
    });

    it("should return false for invalid tag", function () {
        validate("<2start_tag  abc='123' bc='567'></2start_tag>", {
            InvalidTag: "Tag '2start_tag' is an invalid name."
        });
    });

    it("should return false for invalid tag", function () {
        validate("<2start_tag />", {
            InvalidTag: "Tag '2start_tag' is an invalid name."
        });
    });

    it("should validate xml data", function () {
        validateFile("sample.xml");
    });

    it("should validate complex xml data", function () {
        validateFile("complex.xml");
    });

    it("should validate xml data with CRLF", function () {
        validateFile("crlf.xml");
    });

    it("should return false for invalid xml", function () {
        validateFile("invalid.xml", {
            InvalidTag: "Closing tag 'selfclosing' is expected inplace of 'person'."
        }, 27);
    });

    it("should return true for valid svg", function () {
        validateFile("by.svg");
    });

    it("should validate XML with DOCTYPE", function () {
        validate("<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration -" +
            "  the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>" +
            "<foo>Hello World.</foo>");
    });


    it("should fail for XML with ! which is not a comment, DOCTYPE or CDATA", function () {
        validate("<test><!bla></!bla></test>", {
            InvalidTag: "Tag '!bla' is an invalid name."
        });
    });

    it("should not validate XML when prolog doesn't start from 1st char", function () {
        validate("  <?xml version=\"1.0\" standalone=\"yes\" ?><foo>Hello World.</foo>", {
            InvalidXml: "XML declaration allowed only at the start of the document."
        });
    });

    it("should not validate XML with prolog only", function () {
        validate("<?xml version=\"1.0\" standalone=\"yes\" ?><!--some comment -  end in this line-->", {
            InvalidXml: "Start tag expected."
        });
    });

    it("should not validate XML with prolog &  DOCTYPE but not any other tag", function () {
        validate("<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration - the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>", {
                InvalidXml: "Start tag expected."
            });
    });

    it("should validate XML PIs", function () {
        validate('<?xml version="1.0"?>' +
            '<?mso-contentType?>' +
            '<h1></h1>' +
            '<?mso-contentType something="val"?>');
    });
    
    it("should validate XML PIs", function () {
        validate('<h1><?mso?> abc</h1>');
    });

    it("should validate XML PIs", function () {
        const xml = `<?xml version="1.0"?>
        <content><?tibcochar ?> something</content>`;
        validate(xml);
    });

    it("should not validate XML PIs with invalid values", function () {
        validate('<?xml version="1.0"?>' +
            '<?mso-contentType valid="value" invalid="?>" ?>' +
            '<h1></h1>' +
            '<?mso-contentType something="val"?>', {
                InvalidChar: "char '\"' is not expected."
            });
    });

    it('should validate xml with a "length" attribute', function () {
        validate('<name length="1"></name>');
    });

    it("should not validate xml with repeated attributes", function () {
        validate('<name length="bar" length="baz"></name>', {
            InvalidAttr: "Attribute 'length' is repeated."
        });
    });

    it('should validate xml with a tag attribute splitted on more lines', () => {
        validate(`
<name
attribute1="attribute1"
attribute2="attribute2"
/>
    `);
    });

    it('should validate xml not properly closed', () => {
        validate(`
<name
attribute1="attribute1"
attribute2="attribute2"
></name
    `, {
            InvalidTag: "Closing tag 'name' doesn't have proper closing."
        }, 6);
    });

    it('should detect error line when having multiple attributes', () => {
        validate(`<urlset t
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    </urlset>`, {
            InvalidAttr: "boolean attribute 't' is not allowed."
        });
    });

    it('should detect error line when having multiple attributes 2', () => {
        validate(`<urlset
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        t>
    </urlset>`, {
            InvalidAttr: "boolean attribute 't' is not allowed."
        }, 5);
    });

    it('should validate value with ampersand', function () {
        const error = {
            InvalidChar: "char '&' is not expected."
        };
        validate('<rootNode>jekyll &amp; hyde</rootNode>');
        validate('<rootNode>jekyll &#123; hyde</rootNode>');
        validate('<rootNode>jekyll &#x1945abcdef; hyde</rootNode>');
        validate('<rootNode>jekyll &#x1ah; hyde</rootNode>', error);
        validate('<rootNode>jekyll &#1a; hyde</rootNode>', error);
        validate('<rootNode>jekyll &#123 hyde</rootNode>', error);
        validate('<rootNode>jekyll &#1abcd hyde</rootNode>', error);
        validate('<rootNode>jekyll & hyde</rootNode>', error);
        validate('<rootNode>jekyll &aa</rootNode>', error);
        validate('<rootNode>jekyll &abcdefghij1234567890;</rootNode>');
        validate('<rootNode>jekyll &abcdefghij1234567890a;</rootNode>', error); // limit to 20 chars
    });
});

describe("should not validate XML documents with multiple root nodes", () => {
    it('when root nodes are repeated', () => {
        validate(`<xml></xml><xml></xml>`, {
            InvalidXml: 'Multiple possible root nodes found.'
        });
    });

    it('when root nodes are different', () => {
        validate('<xml></xml><xml2></xml2>', {
            InvalidXml: 'Multiple possible root nodes found.'
        });
    });

    it('when root nodes have more nested tags', () => {
        validate(`<test>
        <nested>
        </nested>
        </test>
        <xml2>
        </xml2>`, {
            InvalidXml: 'Multiple possible root nodes found.'
        }, 5);
    });
});
