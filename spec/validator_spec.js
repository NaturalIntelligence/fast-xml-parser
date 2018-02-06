var validator = require("../src/validator");

describe("XMLParser", function () {

    it("should validate simple xml string", function () {
        var xmlData = "<rootNode></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);

        xmlData = "<rootNode></rootNode     >";

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate invalid starting tag", function () {
        var xmlData = "< rootNode></rootNode>";
        var expected = {
            "code": "InvalidTag",
            "msg": "Tag  is an invalid name."
        }

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate incomplete xml string", function () {
        var xmlData = "<rootNode>";
        var expected = {
            "code": "InvalidXml",
            "msg": 'Invalid [    "rootNode"] found.'
        }

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should return false for non xml text", function () {
        var xmlData = "rootNode";
        var expected = { code: 'InvalidChar', msg: 'char r is not expected .' }

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate self closing tags", function () {
        var xmlData = "<rootNode><validtag1  /><validtag2/><validtag3  with='attrib'/></rootNode>";
        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate self closing tags", function () {
        var xmlData = "<rootNode><validtag1/><invalid tag/><validtag3  with='attrib'/></rootNode>";
        var expected = { code: 'InvalidAttr', msg: 'boolean attribute tag is not allowed.' };

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });


    it("should not validate xml string when closing tag is different", function () {
        var xmlData = "<rootNode></rootnode>";
        var expected = { code: 'InvalidTag', msg: 'closing tag rootNode is expected inplace of rootnode.' };

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml string when closing tag is invalid", function () {
        var xmlData = "<rootNode>< /rootnode>";

        var expected = { code: 'InvalidTag', msg: "Tag  is an invalid name." };

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        xmlData = "<rootNode></ rootnode>";
        expected = { code: 'InvalidTag', msg: "Tag  is an invalid name." };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        xmlData = "<rootNode></rootnode 123>";
        expected = { code: 'InvalidTag', msg: "closing tag rootnode can't have attributes or invalid starting." };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate simple xml string with namespace", function () {
        var xmlData = "<root:Node></root:Node>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml string with namespace when closing tag is diffrent", function () {
        var xmlData = "<root:Node></root:node>";
        var expected = { code: 'InvalidTag', msg: 'closing tag root:Node is expected inplace of root:node.' };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate simple xml string with value", function () {
        var xmlData = "<root:Node>some value</root:Node>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate simple xml string with value but not matching closing tag", function () {
        var xmlData = "<root:Node>some value</root>";
        var expected = { code: 'InvalidTag', msg: 'closing tag root:Node is expected inplace of root.' };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate simple xml string with value but no closing tag", function () {
        var xmlData = "<root:Node>some value";
        var expected = { code: 'InvalidXml', msg: 'Invalid [    "root:Node"] found.' };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });


    it("should validate xml with nested tags", function () {
        var xmlData = "<rootNode><tag></tag><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with wrongly nested tags", function () {
        var xmlData = "<rootNode><tag><tag1></tag>1</tag1><tag>val</tag></rootNode>";
        var expected = { code: 'InvalidTag', msg: 'closing tag tag1 is expected inplace of tag.' };

        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml with comment", function () {
        var xmlData = "<rootNode><!-- <tag> - - --><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });


    it("should validate xml with comment", function () {
        var xmlData = "<rootNode><!-- <tag> - - \n--><tag>1</tag><tag>val</tag></rootNode>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });


    it("should not validate xml with comment in a open tag", function () {
        var xmlData = "<rootNode<!-- <tag> -- -->><tag>1</tag><tag>val</tag></rootNode>";
        var expected = { code: 'InvalidAttr', msg: 'boolean attribute <tag is not allowed.' };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with non closing comment", function () {
        var xmlData = "<rootNode ><!-- <tag> -- <tag>1</tag><tag>val</tag></rootNode>";
        var expected = { code: 'InvalidXml', msg: 'Invalid [    "rootNode"] found.' };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with unclosed tag", function () {
        var xmlData = "<rootNode  abc='123' bc='567'";
        var expected = { code: 'InvalidXml', msg: 'Invalid [    "rootNode"] found.' };
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml with CDATA", function () {
        var xmlData = "<name><![CDATA[Jack]]></name>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml with repeated CDATA", function () {
        var xmlData = "<name><![CDATA[Jack]]><![CDATA[Jack]]></name>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml when CDATA consist regx or blank data", function () {
        var xmlData = "<name><![CDATA[]]><![CDATA[^[ ].*$]]></name>";

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    /*it("should return false when tag starts with xml or XML etc", function () {
        var xmlData = "<xmlNode  abc='123' bc='567'>val</xmlNode>";

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
        var xmlData = "<ns:start_tag-2.0></ns:start_tag-2.0>";

        result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false for invalid tag", function () {
        var xmlData = "<2start_tag  abc='123' bc='567'></2start_tag>";
        var expected = {
            "code": "InvalidTag",
            "msg": "Tag 2start_tag is an invalid name."
        }
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should return false for invalid tag", function () {
        var xmlData = "<2start_tag />";
        var expected = {
            "code": "InvalidTag",
            "msg": "Tag 2start_tag is an invalid name."
        }
        result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml data", function () {
         var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/sample.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate complex xml data", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/complex.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml data with CRLF", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/crlf.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should return false for invalid xml", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/invalid.xml");
        var xmlData = fs.readFileSync(fileNamePath).toString();
        var expected = { code: 'InvalidTag', msg: 'closing tag selfclosing is expected inplace of person.' };
        var result = validator.validate(xmlData).err;
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should return true for valid svg", function () {
        var fs = require("fs");
        var path = require("path");
        var fileNamePath = path.join(__dirname, "assets/by.svg");
        var svgData = fs.readFileSync(fileNamePath).toString();

        var result = validator.validate(svgData);
        expect(result).toBe(true);
    });

});


