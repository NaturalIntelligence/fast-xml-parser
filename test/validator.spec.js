const {validate} = require("../parser");

describe("XMLParser", function() {

    it("should validate simple xml string", function() {
        let xmlData = "<rootNode></rootNode>";

        let result = validate(xmlData);
        expect(result).equal(true);

        xmlData = `<rootNode></rootNode     >`;

        result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate invalid starting tag", function() {
        const xmlData = "< rootNode></rootNode>";
        const expected = {
            "code": "InvalidTag",
            "msg": "Tag  is an invalid name."
        };

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate incomplete xml string", function() {
        const xmlData = "<rootNode>";
        const expected = {
            "code": "InvalidXml",
            "msg": "Invalid [    \"rootNode\"] found."
        };

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should return false for non xml text", function() {
        const xmlData = "rootNode";
        const expected = {code: "InvalidChar", msg: "char r is not expected ."};

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate self closing tags", function() {
        const xmlData = "<rootNode><validtag1  /><validtag2/><validtag3  with='attrib'/></rootNode>";
        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate self closing tags", function() {
        const xmlData = "<rootNode><validtag1/><invalid tag/><validtag3  with='attrib'/></rootNode>";
        const expected = {code: "InvalidAttr", msg: "boolean attribute tag is not allowed."};

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate xml string when closing tag is different", function() {
        const xmlData = "<rootNode></rootnode>";
        const expected = {code: "InvalidTag", msg: "closing tag rootNode is expected inplace of rootnode."};

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate xml string when closing tag is invalid", function() {
        let xmlData = "<rootNode>< /rootnode>";

        let expected = {code: "InvalidTag", msg: "Tag  is an invalid name."};

        let result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        xmlData = "<rootNode></ rootnode>";
        expected = {code: "InvalidTag", msg: "Tag  is an invalid name."};
        result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        xmlData = "<rootNode></rootnode 123>";
        expected = {code: "InvalidTag", msg: "closing tag rootnode can't have attributes or invalid starting."};
        result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate simple xml string with namespace", function() {
        const xmlData = "<root:Node></root:Node>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate xml string with namespace when closing tag is diffrent", function() {
        const xmlData = "<root:Node></root:node>";
        const expected = {code: "InvalidTag", msg: "closing tag root:Node is expected inplace of root:node."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate simple xml string with value", function() {
        const xmlData = "<root:Node>some value</root:Node>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate simple xml string with value but not matching closing tag", function() {
        const xmlData = "<root:Node>some value</root>";
        const expected = {code: "InvalidTag", msg: "closing tag root:Node is expected inplace of root."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate simple xml string with value but no closing tag", function() {
        const xmlData = "<root:Node>some value";
        const expected = {code: "InvalidXml", msg: "Invalid [    \"root:Node\"] found."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate xml with nested tags", function() {
        const xmlData = "<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate xml with wrongly nested tags", function() {
        const xmlData = "<rootNode><tag><tag1></tag>1</tag1><tag>val</tag></rootNode>";
        const expected = {code: "InvalidTag", msg: "closing tag tag1 is expected inplace of tag."};

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate xml with comment", function() {
        const xmlData = "<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should validate xml with comment", function() {
        const xmlData = "<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate xml with comment in a open tag", function() {
        const xmlData = "<rootNode<!-- <tag> -- -->><tag>1</tag><tag>val</tag></rootNode>";
        const expected = {code: "InvalidAttr", msg: "boolean attribute <tag is not allowed."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate xml with non closing comment", function() {
        const xmlData = "<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>";
        const expected = {code: "InvalidXml", msg: "Invalid [    \"rootNode\"] found."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate xml with unclosed tag", function() {
        const xmlData = "<rootNode  abc='123' bc='567'";
        const expected = {code: "InvalidXml", msg: "Invalid [    \"rootNode\"] found."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate xml with CDATA", function() {
        const xmlData = "<name><![CDATA[Jack]]></name>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should validate xml with repeated CDATA", function() {
        const xmlData = "<name><![CDATA[Jack]]><![CDATA[Jack]]></name>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should validate xml when CDATA consist regx or blank data", function() {
        const xmlData = "<name><![CDATA[]]><![CDATA[^[ ].*$]]></name>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    /*it("should return false when tag starts with xml or XML etc", function () {
        const xmlData = "<xmlNode  abc='123' bc='567'>val</xmlNode>";

        result = validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        xmlData = "<XmLNode  abc='123' bc='567'></XmLNode>";

        result = validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        xmlData = "<xMLNode/>";

        result = validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });*/

    it("should return true for valid tag", function() {
        const xmlData = "<ns:start_tag-2.0></ns:start_tag-2.0>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should return false for invalid tag", function() {
        const xmlData = "<2start_tag  abc='123' bc='567'></2start_tag>";
        const expected = {
            "code": "InvalidTag",
            "msg": "Tag 2start_tag is an invalid name."
        };
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should return false for invalid tag", function() {
        const xmlData = "<2start_tag />";
        const expected = {
            "code": "InvalidTag",
            "msg": "Tag 2start_tag is an invalid name."
        };
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate xml data", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/sample.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should validate complex xml data", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/complex.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should validate xml data with CRLF", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/crlf.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should return false for invalid xml", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/invalid.xml");
        const xmlData = fs.readFileSync(fileNamePath).toString();
        const expected = {code: "InvalidTag", msg: "closing tag selfclosing is expected inplace of person."};
        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should return true for valid svg", function() {
        const fs = require("fs");
        const path = require("path");
        const fileNamePath = path.join(__dirname, "assets/by.svg");
        const svgData = fs.readFileSync(fileNamePath).toString();

        const result = validate(svgData);
        expect(result).equal(true);
    });

    it("should validate XML with DOCTYPE", function() {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
                        "<!--open the DOCTYPE declaration -" +
                        "  the open square bracket indicates an internal DTD-->" +
                        "<!DOCTYPE foo [" +
                        "<!--define the internal DTD-->" +
                        "<!ELEMENT foo (#PCDATA)>" +
                        "<!--close the DOCTYPE declaration-->" +
                        "]>" +
                        "<foo>Hello World.</foo>";

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate XML when prolog doesn't start from 1st char", function() {
        const xmlData = "  <?xml version=\"1.0\" standalone=\"yes\" ?><foo>Hello World.</foo>";
        const expected = {
            "code": "InvalidXml",
            "msg": "XML declaration allowed only at the start of the document."
        };

        const result = validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate XML with prolog only", function() {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
                        "<!--some comment -  end in this line-->";
        const expected = {
            "code": "InvalidXml",
            "msg": "Start tag expected."
        };
        const result = validate(xmlData).err;
        expect(result).eql(expected);
    });

    it("should not validate XML with prolog &  DOCTYPE but not any other tag", function() {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
                        "<!--open the DOCTYPE declaration - the open square bracket indicates an internal DTD-->" +
                        "<!DOCTYPE foo [" +
                        "<!--define the internal DTD-->" +
                        "<!ELEMENT foo (#PCDATA)>" +
                        "<!--close the DOCTYPE declaration-->" +
                        "]>";
        const expected = {
            "code": "InvalidXml",
            "msg": "Start tag expected."
        };
        const result = validate(xmlData).err;
        expect(result).eql(expected);
    });

    it("should validate XML PIs", function() {
        var xmlData = "<?xml version=\"1.0\"?>"
                      + "<?mso-contentType?>"
                      + "<h1></h1>"
                      + "<?mso-contentType something=\"val\"?>";

        var result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate XML PIs with invalid values", function() {
        var xmlData = "<?xml version=\"1.0\"?>"
                      + "<?mso-contentType valid=\"value\" invalid=\"?>\" ?>"
                      + "<h1></h1>"
                      + "<?mso-contentType something=\"val\"?>";

        var expected = {code: "InvalidChar", msg: "char \" is not expected ."};

        var result = validate(xmlData).err;
        expect(result).eql(expected);
    });

});


