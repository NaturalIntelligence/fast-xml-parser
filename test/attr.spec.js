const he = require("he");
const {parse, validate} = require("../parser");

describe("XMLParser", function() {
    it("should parse attributes with valid names", function() {
        const xmlData = `<issue _ent-ity.23="Mjg2MzY2OTkyNA==" state="partial" version="1"></issue>`;
        const expected = {
            "issue": {
                "_ent-ity.23": "Mjg2MzY2OTkyNA==",
                "state": "partial",
                "version": 1
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should parse attributes with newline char", function() {
        const xmlData = `<element id="7" data="foo\nbar" bug="true"/>`;
        const expected = {
            "element": {
                "id": 7,
                "data": "foo bar",
                "bug": true
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not decode HTML entities / char by default", function() {
        const xmlData = `<element id="7" data="foo\nbar" bug="foo&ampbar&apos;"/>`;
        const expected = {
            "element": {
                "id": 7,
                "data": "foo bar",
                "bug": "foo&ampbar&apos;"
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseAttributeValue: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should decode HTML entities / char", function() {
        const xmlData = `<element id="7" data="foo\r\nbar" bug="foo&ampbar&apos;"/>`;
        const expected = {
            "element": {
                "id": 7,
                "data": "foo bar",
                "bug": "foo&ampbar'"
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseAttributeValue: true,
            attrValueProcessor: a => he.decode(a, {isAttributeValue: true})
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should parse Boolean Attributes", function() {
        const xmlData = `<element id="7" str="" data/>`;
        const expected = {
            "element": {
                "id": 7,
                "str": "",
                "data": true
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).equal(true);
    });

    it("should not remove xmlns when namespaces are not set to be ignored", function() {
        const xmlData = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"></project>`;
        const expected = {
            "project": {
                "xmlns": "http://maven.apache.org/POM/4.0.0",
                "xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).equal(true);
    });

    it("should remove xmlns when namespaces are set to be ignored", function() {
        const xmlData = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi-ns="http://www.w3.org/2001/XMLSchema-instance" xsi-ns:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"></project>`;
        const expected = {
            "project": {
                //"xmlns": "http://maven.apache.org/POM/4.0.0",
                //"xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
                "schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
            }
        };

        let result = parse(xmlData, {
            attributeNamePrefix: "",
            ignoreAttributes: false,
            ignoreNameSpace: true
        });

        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);

        result = validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).equal(true);
    });

    it("should not parse attributes with name start with number", function() {
        const xmlData = `<issue 35entity="Mjg2MzY2OTkyNA==" ></issue>`;

        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute 35entity is an invalid name."
            }
        };
        const result = validate(xmlData);

        expect(result).eql(expected);
    });

    it("should not parse attributes with invalid char", function() {
        const xmlData = `<issue enti+ty="Mjg2MzY2OTkyNA=="></issue>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute enti+ty is an invalid name."
            }
        };

        const result = validate(xmlData);

        expect(result).eql(expected);
    });

    it("should not parse attributes in closing tag", function() {
        const xmlData = `<issue></issue invalid="true">`;
        const expected = {
            "err": {
                "code": "InvalidTag",
                "msg": "closing tag issue can't have attributes or invalid starting."
            }
        };
        const result = validate(xmlData);

        expect(result).eql(expected);
    });

    it("should err for invalid atributes", function() {
        const xmlData = `<rootNode =''></rootNode>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute '' has no space in starting."
            }
        };
        const result = validate(xmlData);
        expect(result).eql(expected);
    });

    it("should validate xml with atributes", function() {
        const xmlData = `<rootNode attr="123"><tag></tag><tag>1</tag><tag>val</tag></rootNode>`;

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should validate xml atribute has '>' in value", function() {
        const xmlData = `<rootNode attr="123>234"><tag></tag><tag>1</tag><tag>val</tag></rootNode>`;

        const result = validate(xmlData);
        expect(result).equal(true);
    });

    it("should not validate xml with invalid atributes", function() {
        const xmlData = `<rootNode attr="123><tag></tag><tag>1</tag><tag>val</tag></rootNode>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "Attributes for rootNode have open quote"
            }
        };
        const result = validate(xmlData);
        expect(result).eql(expected);
    });

    it("should not validate xml with invalid attributes when duplicate attributes present", function() {
        const xmlData = `<rootNode  abc='123' abc="567" />`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute abc is repeated."
            }
        };
        const result = validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should not validate xml with invalid attributes when no space between 2 attributes", function() {
        const xmlData = `<rootNode  abc='123'bc='567' />`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "attribute bc has no space in starting."
            }
        };
        const result = validate(xmlData);
        expect(result).eql(expected);
    });

    it("should not validate a tag with attribute presents without value ", function() {
        const xmlData = `<rootNode ab cd='ef'></rootNode>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "boolean attribute ab is not allowed."
            }
        };
        const result = validate(xmlData);
        expect(result).eql(expected);
    });

    it("should not validate xml with invalid attributes presents without value", function() {
        const xmlData = `<rootNode  123 abc='123' bc='567' />`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                // "msg": "attribute 123 is an invalid name."
                "msg": "boolean attribute 123 is not allowed."
            }
        };
        const result = validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

    it("should validate xml with attributeshaving openquote in value", function() {
        const xmlData = "<rootNode  123 abc='1\"23' bc=\"56'7\" />";
        const expected = {
            "err": {
                "code": "InvalidAttr",
                // "msg": "attribute 123 is an invalid name."
                "msg": "boolean attribute 123 is not allowed."
            }
        };
        const result = validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).eql(expected);
    });

});
