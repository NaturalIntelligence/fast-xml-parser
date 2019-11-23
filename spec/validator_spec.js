"use strict";

const validator = require("../src/validator");

describe("XMLParser", function () {
    it("should validate simple xml string", function () {
        let xmlData = "<rootNode></rootNode>";

        let result = validator.validate(xmlData);
        expect(result).toBe(true);

        xmlData = `<rootNode></rootNode     >`;

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate invalid starting tag", function () {
        const xmlData = "< rootNode></rootNode>";
        const expected = {
            "code": "InvalidTag",
            "msg": "There is an unnecessary space between tag name and backward slash '</ ..'.",
            "line": 1
        };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate incomplete xml string", function () {
        const xmlData = "<rootNode>";
        const expected = {
            "code": "InvalidXml",
            "msg": "Invalid '[    \"rootNode\"]' found.",
            "line": 1
        };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate invalid starting tag for following characters", function() {
        const xmlData = "<rootNode#@aa></rootNode#@aa>";
        const expected = {
            "code": "InvalidTag",
            "msg":  "Tag 'rootNode#@aa' is an invalid name.",
            "line": 1
        };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should return false for non xml text", function() {
        const xmlData = "rootNode";
        const expected = { code: "InvalidChar", msg: "char 'r' is not expected.", line: 1 };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(expected);
    });

    it("should validate self closing tags", function() {
        const xmlData = "<rootNode><validtag1  /><validtag2/><validtag3  with='attrib'/><validtag4 />text<validtag5/>text</rootNode>";
        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not consider these as self closing tags", function() {
        let xmlData = "<rootNode><validtag1/><invalid tag/><validtag3  with='attrib'/></rootNode>";
        let expected = {code: "InvalidAttr", msg: "boolean attribute 'tag' is not allowed.", line: 1};

        let result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);


        xmlData = "<rootNode><notSelfClosing/ ></rootNode>";
        expected = {code: "InvalidAttr", msg: "Attribute '/' has no space in starting.", line: 1};

        result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });


    it("should not validate xml string when closing tag is different", function () {
        const xmlData = "<rootNode></rootnode>";
        const expected = { code: "InvalidTag", msg: "Closing tag 'rootNode' is expected inplace of 'rootnode'.", line: 1 };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml string when closing tag is invalid", function () {
        let xmlData = "<rootNode>< /rootnode>";

        let expected = { code: "InvalidTag", msg: "There is an unnecessary space between tag name and backward slash '</ ..'.", line: 1 };

        let result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        xmlData = "<rootNode></ rootnode>";
        expected = { code: "InvalidTag", msg: "There is an unnecessary space between tag name and backward slash '</ ..'.", line: 1 };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        xmlData = "<rootNode></rootnode 123>";
        expected = { code: "InvalidTag", msg: "Closing tag 'rootnode' can't have attributes or invalid starting.", line: 1 };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate simple xml string with namespace", function () {
        const xmlData = "<root:Node></root:Node>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml string with namespace when closing tag is diffrent", function () {
        const xmlData = "<root:Node></root:node>";
        const expected = { code: "InvalidTag", msg: "Closing tag 'root:Node' is expected inplace of 'root:node'.", line: 1 };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate simple xml string with value", function () {
        const xmlData = "<root:Node>some value</root:Node>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate simple xml string with value but not matching closing tag", function () {
        const xmlData = "<root:Node>some value</root>";
        const expected = { code: "InvalidTag", msg: "Closing tag 'root:Node' is expected inplace of 'root'.", line: 1 };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate simple xml string with value but no closing tag", function () {
        const xmlData = "<root:Node>some value";
        const expected = { code: "InvalidXml", msg: "Invalid '[    \"root:Node\"]' found.", line: 1 };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml with nested tags", function () {
        const xmlData = "<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with wrongly nested tags", function () {
        const xmlData = "<rootNode><tag><tag1></tag>1</tag1><tag>val</tag></rootNode>";
        const expected = { code: "InvalidTag", msg: "Closing tag 'tag1' is expected inplace of 'tag'.", line: 1 };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml with comment", function () {
        const xmlData = "<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml with comment", function () {
        const xmlData = "<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with comment in a open tag", function() {
        const xmlData = "<rootNode<!-- <tag> -- -->><tag>1</tag><tag>val</tag></rootNode>";        
        const expected = {code: "InvalidTag", msg: "Tag 'rootNode<!--' is an invalid name.", line: 1};
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with comment in a open tag", function() {
        const xmlData = "<rootNode <!-- <tag> -- --> ><tag>1</tag><tag>val</tag></rootNode>";
        const expected = {code: "InvalidAttr", msg: "boolean attribute '<!--' is not allowed.", line: 1};
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should correctly identify self closing tags", function() {
        let xmlData = "<rootNode><in/valid></in/valid></rootNode>";
        let expected = {code: "InvalidTag", msg: "Tag 'in/valid' is an invalid name.", line: 1};
        let result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
        xmlData = "<rootNode><in#valid/></rootNode>";
        expected = {code: "InvalidTag", msg: "Tag 'in#valid' is an invalid name.", line: 1};
        result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it("should not validate xml with non closing comment", function() {
        const xmlData = "<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>";
        const expected = { code: "InvalidXml", msg: "Invalid '[    \"rootNode\"]' found.", line: 1 };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with unclosed tag", function () {
        const xmlData = "<rootNode  abc='123' bc='567'";
        const expected = { code: "InvalidXml", msg: "Invalid '[    \"rootNode\"]' found.", line: 1 };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml with CDATA", function () {
        const xmlData = "<name><![CDATA[Jack]]></name>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml with repeated CDATA", function () {
        const xmlData = "<name><![CDATA[Jack]]><![CDATA[Jack]]></name>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml when CDATA consist regx or blank data", function () {
        const xmlData = "<name><![CDATA[]]><![CDATA[^[ ].*$]]></name>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    /*it("should return false when tag starts with xml or XML etc", function () {
        const xmlData = "<xmlNode  abc='123' bc='567'>val</xmlNode>";

        result = validator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        xmlData = "<XmLNode  abc='123' bc='567'></XmLNode>";

        result = validator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        xmlData = "<xMLNode/>";

        result = validator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });*/

    it("should return true for valid tag", function () {
        const xmlData = "<ns:start_tag-2.0></ns:start_tag-2.0>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false for invalid tag", function () {
        const xmlData = "<2start_tag  abc='123' bc='567'></2start_tag>";
        const expected = {
            "code": "InvalidTag",
            "msg": "Tag '2start_tag' is an invalid name.",
            "line": 1
        };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should return false for invalid tag", function () {
        const xmlData = "<2start_tag />";
        const expected = {
            "code": "InvalidTag",
            "msg": "Tag '2start_tag' is an invalid name.",
            line: 1
        };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml data", function () {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/sample.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate complex xml data", function () {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/complex.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml data with CRLF", function () {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/crlf.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false for invalid xml", function () {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/invalid.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();
        const expected = { code: "InvalidTag", msg: "Closing tag 'selfclosing' is expected inplace of 'person'.", line: 27 };
        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should return true for valid svg", function () {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/by.svg");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = validator.validate(svgData);
        expect(result).toBe(true);
    });

    it("should validate XML with DOCTYPE", function () {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration -" +
            "  the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>" +
            "<foo>Hello World.</foo>";

        const result = validator.validate(xmlData);
        expect(result).toBe(true);
    });


    it("should fail for XML with ! which is not a comment, DOCTYPE or CDATA", function () {
        const xmlData = "<test><!bla></!bla></test>";
        const expected = {
            "code": "InvalidTag",
            "msg": "Tag '!bla' is an invalid name.",
            "line": 1
        };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate XML when prolog doesn't start from 1st char", function () {
        const xmlData = "  <?xml version=\"1.0\" standalone=\"yes\" ?><foo>Hello World.</foo>";
        const expected = {
            "code": "InvalidXml",
            "msg": "XML declaration allowed only at the start of the document.",
            "line": 1
        };

        const result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate XML with prolog only", function () {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--some comment -  end in this line-->";
        const expected = {
            "code": "InvalidXml",
            "msg": "Start tag expected.",
            line: 1

        };
        const result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it("should not validate XML with prolog &  DOCTYPE but not any other tag", function () {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration - the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>";
        const expected = {
            "code": "InvalidXml",
            "msg": "Start tag expected.",
            line: 1
        };
        const result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it("should validate XML PIs", function () {
        var xmlData = '<?xml version="1.0"?>'
            + '<?mso-contentType?>'
            + '<h1></h1>'
            + '<?mso-contentType something="val"?>';

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate XML PIs with invalid values", function () {
        var xmlData = '<?xml version="1.0"?>'
            + '<?mso-contentType valid="value" invalid="?>" ?>'
            + '<h1></h1>'
            + '<?mso-contentType something="val"?>';


        var expected = { code: 'InvalidChar', msg: 'char \'"\' is not expected.', line: 1 }

        var result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it('should validate xml with a "length" attribute', function () {
        const xmlData = '<name length="1"></name>';

        var result = validator.validate(xmlData);
        expect(result).toEqual(true);
    });

    it("should not validate xml with repeated attributes", function () {
        const xmlData = '<name length="bar" length="baz"></name>';

        var expected = { code: 'InvalidAttr', msg: "Attribute 'length' is repeated.", line: 1 }

        var result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it('should validate xml with a tag attribute splitted on more lines', () => {
        const xmlData = `
<name
attribute1="attribute1"
attribute2="attribute2"
/>
    `;

        var result = validator.validate(xmlData);
        expect(result).toEqual(true);
    });

    it('should validate xml not properly closed', () => {
        const xmlData = `
<name
attribute1="attribute1"
attribute2="attribute2"
></name
    `;

        const expected = { code: "InvalidTag", msg: "Closing tag 'name' doesn't have proper closing.", line: 6 };
        var result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it('should detect error line when having multiple attributes', () => {
        const xmlData = `<urlset t
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    </urlset>`;

        const expected = { code: "InvalidAttr", msg: "boolean attribute 't' is not allowed.", line: 1 };
        var result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });

    it('should detect error line when having multiple attributes 2', () => {
        const xmlData = `<urlset
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd http://www.google.com/schemas/sitemap-image/1.1 http://www.google.com/schemas/sitemap-image/1.1/sitemap-image.xsd"
        xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        t>
    </urlset>`;

        const expected = { code: "InvalidAttr", msg: "boolean attribute 't' is not allowed.", line: 5 };
        var result = validator.validate(xmlData).err;
        expect(result).toEqual(expected);
    });
});
