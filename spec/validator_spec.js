"use strict";

const fs = require("fs");
const path = require("path");
const validator = require("../src/validator");

function validate(xmlData, options, error, line = 1) {
    const result = validator.validate(xmlData, options);
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

function validateIgnoringNS(xmlData, error, line) {
    validate(xmlData, { ignoreNameSpace: true }, error, line);
}

function validateWithNS(xmlData, error, line) {
    validate(xmlData, null, error, line);
}

function validateFile(fileName, ...args) {
    const fileNamePath = path.join(__dirname, "assets/" + fileName);
    validateIgnoringNS(fs.readFileSync(fileNamePath).toString(), ...args);
}

describe("XMLParser", function () {
    it("should validate simple xml string", function () {
        validateIgnoringNS("<rootNode></rootNode>");
        validateIgnoringNS(`<rootNode></rootNode     >`);
    });

    it("should not validate invalid starting tag", function () {
        validateIgnoringNS("< rootNode></rootNode>", {
            InvalidTag: "There is an unnecessary space between tag name and backward slash '</ ..'."
        });
    });

    it("should not validate incomplete xml string", function () {
        validateIgnoringNS("<rootNode>", {
            InvalidXml: "Invalid '[    {        \"name\": \"rootNode\"    }]' found."
        });
    });

    it("should not validate invalid starting tag for following characters", function () {
        validateIgnoringNS("<rootNode#@aa></rootNode#@aa>", {
            InvalidTag: "Tag 'rootNode#@aa' is an invalid name."
        });
    });

    it("should return false for non xml text", function () {
        validateIgnoringNS("rootNode", {
            InvalidChar: "char 'r' is not expected."
        });
    });

    it("should validate self closing tags", function () {
        validateIgnoringNS("<rootNode><validtag1  /><validtag2/><validtag3  with='attrib'/><validtag4 />text<validtag5/>text</rootNode>");
    });

    it("should not consider these as self closing tags", function () {
        validateIgnoringNS("<rootNode><validtag1/><invalid tag/><validtag3  with='attrib'/></rootNode>", {
            InvalidAttr: "boolean attribute 'tag' is not allowed."
        });
        validateIgnoringNS("<rootNode><notSelfClosing/ ></rootNode>", {
            InvalidAttr: "Attribute '/' has no space in starting."
        });
    });


    it("should not validate xml string when closing tag is different", function () {
        validateIgnoringNS("<rootNode></rootnode>", {
            InvalidTag: "Closing tag 'rootNode' is expected inplace of 'rootnode'."
        });
    });

    it("should not validate xml string when closing tag is invalid", function () {
        validateIgnoringNS("<rootNode>< /rootnode>", {
            InvalidTag: "There is an unnecessary space between tag name and backward slash '</ ..'."
        });
        validateIgnoringNS("<rootNode></ rootnode>", {
            InvalidTag: "There is an unnecessary space between tag name and backward slash '</ ..'."
        });
        validateIgnoringNS("<rootNode></rootnode 123>", {
            InvalidTag: "Closing tag 'rootnode' can't have attributes or invalid starting."
        });
    });
    
    it("should validate tag with namespace", function () {
        validateWithNS("<root:Node xmlns:root='urn:none'></root:Node>");
    });

    it("should validate attribute with namespace", function () {
        validateWithNS("<rootNode xmlns:ns='urn:none'><tag ns:attr='value' /></rootNode>");
    });

    it("should not validate namespace attribute with empty URI", function () {
        validateWithNS("<root:Node xmlns:root=''></root:Node>", {
            InvalidAttr: "Invalid URI for namespace root"
        });
    });

    it("should validate all namespaces defined in a tag", function () {
        validateWithNS(`<rootNode xmlns:ns1='urn:none' xmlns:ns2='urn:none'>
        <ns1:tag>
        <ns2:child></ns2:child>
        </ns1:tag>
        </rootNode>`);
    });

    it("should validate self closing tag with namespace", function () {
        validateWithNS("<rootNode><ns:tag type='self' xmlns:ns='urn:none'/></rootNode>");
    });

    it("should validate attributes in self closing tag with namespace", function () {
        validateWithNS("<rootNode><ns:tag ns:type='self' xmlns:ns='urn:none'/></rootNode>");
    });

    it("should not validate other tags with namespace when namespace is defined in self closing tag", function () {
        validateWithNS("<rootNode><ns:tag type='self' xmlns:ns='urn:none'/><ns:testTag></ns:testTag></rootNode>", {
            InvalidTag: "Namespace prefix 'ns' is not defined for 'ns:testTag'"
        });
    });

    it("should not validate attributes outside self closing tag with namespace definition", function () {
        validateWithNS("<rootNode><tag type='self' xmlns:ns='urn:none'/><testTag ns:attr='value'></testTag></rootNode>", {
            InvalidAttr: "Namespace prefix 'ns' is not defined for 'ns:attr'"
        });
    });

    it("should not validate tags with namespace when namespace is defined in a sibling tag", function () {
        validateWithNS("<rootNode><tag1 type='self' xmlns:ns='urn:none'><ns:child1 /></tag1><tag2><ns:child2 /></tag2></rootNode>", {
            InvalidTag: "Namespace prefix 'ns' is not defined for 'ns:child2'"
        });
    });

    it("should not validate tag when namespace is not defined", function () {
        validateWithNS("<root:Node></root:Node>", {
            InvalidTag: "Namespace prefix 'root' is not defined for 'root:Node'"
        });
    });

    it("should not validate attribute when namespace is not defined", function () {
        validateWithNS("<rootNode ns:attr='value'></rootNode>", {
            InvalidAttr: "Namespace prefix 'ns' is not defined for 'ns:attr'"
        });
    });

    it("should not validate tag when namespace is defined later", function () {
        validateWithNS(`<root:Node>
        <tag xmlns:root="urn:none">
        </tag>
        </root:Node>`, {
            InvalidTag: "Namespace prefix 'root' is not defined for 'root:Node'"
        });
    });

    it("should not validate attribute when namespace is defined later", function () {
        validateWithNS(`<rootNode>
        <tag1 ns:attr="value">
        </tag1>
        <tag2 xmlns:ns="urn:none">
        </tag2>
        </rootNode>`, {
            InvalidAttr: "Namespace prefix 'ns' is not defined for 'ns:attr'"
        }, 2);
    });

    it("should not validate tag when multiple namespace prefixes are present", function () {
        validateWithNS("<root:ns:Node></root:ns:Node>", {
            InvalidTag: "'root:ns:Node' cannot have multiple namespace prefixes"
        });
    });

    it("should not validate attribute when multiple namespace prefixes are present", function () {
        validateWithNS("<rootNode xmlns:ns1='urn:none' xmlns:ns2='urn:none'><tag ns1:ns2:attr='value' /></rootNode>", {
            InvalidAttr: "'ns1:ns2:attr' cannot have multiple namespace prefixes"
        });
    });

    it("should not validate attributes with same name and same namespace prefix", function () {
        validateWithNS("<rootNode xmlns:ns1='urn:none' xmlns:ns2='a'><tag ns1:attr='value' ns1:attr='value2' /></rootNode>", {
            InvalidAttr: "Attribute 'attr' in namespace 'urn:none' is repeated."
        });
    });

    it("should not validate attributes with same name and same namespace", function () {
        validateWithNS("<rootNode xmlns:ns1='urn:none' xmlns:ns2='urn:none'><tag ns1:attr='value' ns2:attr='value2' /></rootNode>",{
            InvalidAttr: "Attribute 'attr' in namespace 'urn:none' is repeated."
        });
    });

    it("should validate attributes with same name and different namespace", function () {
        validateWithNS("<rootNode xmlns:ns1='urn:none' xmlns:ns2='a'><tag ns1:attr='value' ns2:attr='value2' /></rootNode>");
    });

    it("should not validate xml string with namespace when closing tag is diffrent", function () {
        validateIgnoringNS("<root:Node></root:node>", {
            InvalidTag: "Closing tag 'root:Node' is expected inplace of 'root:node'."
        });
    });

    it("should validate simple xml string with value", function () {
        validateIgnoringNS("<root:Node>some value</root:Node>");
    });

    it("should not validate simple xml string with value but not matching closing tag", function () {
        validateIgnoringNS("<root:Node>some value</root>", {
            InvalidTag: "Closing tag 'root:Node' is expected inplace of 'root'."
        });
    });

    it("should not validate simple xml string with value but no closing tag", function () {
        validateIgnoringNS("<root:Node>some value", {
            InvalidXml: "Invalid '[    {        \"name\": \"root:Node\"    }]' found."
        });
    });

    it("should validate xml with nested tags", function () {
        validateIgnoringNS("<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>");
    });

    it("should not validate xml with wrongly nested tags", function () {
        validateIgnoringNS("<rootNode><tag><tag1></tag>1</tag1><tag>val</tag></rootNode>", {
            InvalidTag: "Closing tag 'tag1' is expected inplace of 'tag'."
        });
    });

    it("should validate xml with comment", function () {
        validateIgnoringNS("<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>");
    });

    it("should validate xml with comment", function () {
        validateIgnoringNS("<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>");
    });

    it("should not validate xml with comment in a open tag", function () {
        validateIgnoringNS("<rootNode<!-- <tag> -- -->><tag>1</tag><tag>val</tag></rootNode>", {
            InvalidTag: "Tag 'rootNode<!--' is an invalid name."
        });
    });

    it("should not validate xml with comment in a open tag", function () {
        validateIgnoringNS("<rootNode <!-- <tag> -- --> ><tag>1</tag><tag>val</tag></rootNode>", {
            InvalidAttr: "boolean attribute '<!--' is not allowed."
        });
    });

    it("should correctly identify self closing tags", function () {
        validateIgnoringNS("<rootNode><in/valid></in/valid></rootNode>", {
            InvalidTag: "Tag 'in/valid' is an invalid name."
        });
        validateIgnoringNS("<rootNode><in#valid/></rootNode>", {
            InvalidTag: "Tag 'in#valid' is an invalid name."
        });
    });

    it("should not validate xml with non closing comment", function () {
        validateIgnoringNS("<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>", {
            InvalidXml: "Invalid '[    {        \"name\": \"rootNode\"    }]' found."
        });
    });

    it("should not validate xml with unclosed tag", function () {
        validateIgnoringNS("<rootNode  abc='123' bc='567'", {
            InvalidXml: "Invalid '[    {        \"name\": \"rootNode\"    }]' found."
        });
    });

    it("should validate xml with CDATA", function () {
        validateIgnoringNS("<name><![CDATA[Jack]]></name>");
    });

    it("should validate xml with repeated CDATA", function () {
        validateIgnoringNS("<name><![CDATA[Jack]]><![CDATA[Jack]]></name>");
    });

    it("should validate xml when CDATA consist regx or blank data", function () {
        validateIgnoringNS("<name><![CDATA[]]><![CDATA[^[ ].*$]]></name>");
    });

    it("should return false when tag starts with xml or XML etc", function () {
        /* const error = (tag) => ({
            InvalidTag: `Tag '${tag}' is an invalid name.`
        });
        validateIgnoringNS("<xmlNode  abc='123' bc='567'>val</xmlNode>", error("xmlNode"));
        validateIgnoringNS("<XmLNode  abc='123' bc='567'></XmLNode>", error("XmLNode"));
        validateIgnoringNS("<xMLNode/>", error("xMLNode")); */
    });

    it("should return true for valid tag", function () {
        validateIgnoringNS("<ns:start_tag-2.0></ns:start_tag-2.0>");
    });

    it("should return false for invalid tag", function () {
        validateIgnoringNS("<2start_tag  abc='123' bc='567'></2start_tag>", {
            InvalidTag: "Tag '2start_tag' is an invalid name."
        });
    });

    it("should return false for invalid tag", function () {
        validateIgnoringNS("<2start_tag />", {
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
        validateIgnoringNS("<?xml version=\"1.0\" standalone=\"yes\" ?>" +
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
        validateIgnoringNS("<test><!bla></!bla></test>", {
            InvalidTag: "Tag '!bla' is an invalid name."
        });
    });

    it("should not validate XML when prolog doesn't start from 1st char", function () {
        validateIgnoringNS("  <?xml version=\"1.0\" standalone=\"yes\" ?><foo>Hello World.</foo>", {
            InvalidXml: "XML declaration allowed only at the start of the document."
        });
    });

    it("should not validate XML with prolog only", function () {
        validateIgnoringNS("<?xml version=\"1.0\" standalone=\"yes\" ?><!--some comment -  end in this line-->", {
            InvalidXml: "Start tag expected."
        });
    });

    it("should not validate XML with prolog &  DOCTYPE but not any other tag", function () {
        validateIgnoringNS("<?xml version=\"1.0\" standalone=\"yes\" ?>" +
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
        validateIgnoringNS('<?xml version="1.0"?>' +
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
        validateIgnoringNS('<?xml version="1.0"?>' +
            '<?mso-contentType valid="value" invalid="?>" ?>' +
            '<h1></h1>' +
            '<?mso-contentType something="val"?>', {
                InvalidChar: "char '\"' is not expected."
            });
    });

    it('should validate xml with a "length" attribute', function () {
        validateIgnoringNS('<name length="1"></name>');
    });

    it("should not validate xml with repeated attributes", function () {
        validateIgnoringNS('<name length="bar" length="baz"></name>', {
            InvalidAttr: "Attribute 'length' is repeated."
        });
    });

    it("should not validate attributes with same name and different namespace prefix, if namespace is ignored", function () {
        validateIgnoringNS("<rootNode xmlns:ns1='urn:none' xmlns:ns2=''><tag ns1:attr='value' ns2:attr='value2'></rootNode>", {
            InvalidAttr: "Attribute 'attr' is repeated."
        });
    });

    it('should validate xml with a tag attribute splitted on more lines', () => {
        validateIgnoringNS(`
<name
attribute1="attribute1"
attribute2="attribute2"
/>
    `);
    });

    it('should validate xml not properly closed', () => {
        validateIgnoringNS(`
<name
attribute1="attribute1"
attribute2="attribute2"
></name
    `, {
            InvalidTag: "Closing tag 'name' doesn't have proper closing."
        }, 6);
    });

    it('should detect error line when having multiple attributes', () => {
        validateIgnoringNS(`<urlset t
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    </urlset>`, {
            InvalidAttr: "boolean attribute 't' is not allowed."
        });
    });

    it('should detect error line when having multiple attributes 2', () => {
        validateIgnoringNS(`<urlset
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
        validateIgnoringNS('<rootNode>jekyll &amp; hyde</rootNode>');
        validateIgnoringNS('<rootNode>jekyll &#123; hyde</rootNode>');
        validateIgnoringNS('<rootNode>jekyll &#x1945abcdef; hyde</rootNode>');
        validateIgnoringNS('<rootNode>jekyll &#x1ah; hyde</rootNode>', error);
        validateIgnoringNS('<rootNode>jekyll &#1a; hyde</rootNode>', error);
        validateIgnoringNS('<rootNode>jekyll &#123 hyde</rootNode>', error);
        validateIgnoringNS('<rootNode>jekyll &#1abcd hyde</rootNode>', error);
        validateIgnoringNS('<rootNode>jekyll & hyde</rootNode>', error);
        validateIgnoringNS('<rootNode>jekyll &aa</rootNode>', error);
        validateIgnoringNS('<rootNode>jekyll &abcdefghij1234567890;</rootNode>');
        validateIgnoringNS('<rootNode>jekyll &abcdefghij1234567890a;</rootNode>', error); // limit to 20 chars
    });
});

describe("should not validate XML documents with multiple root nodes", () => {
    it('when root nodes are repeated', () => {
        validateIgnoringNS(`<xml></xml><xml></xml>`, {
            InvalidXml: 'Multiple possible root nodes found.'
        });
    });

    it('when root nodes are different', () => {
        validateIgnoringNS('<xml></xml><xml2></xml2>', {
            InvalidXml: 'Multiple possible root nodes found.'
        });
    });

    it('when root nodes have more nested tags', () => {
        validateIgnoringNS(`<test>
        <nested>
        </nested>
        </test>
        <xml2>
        </xml2>`, {
            InvalidXml: 'Multiple possible root nodes found.'
        }, 5);
    });
});
