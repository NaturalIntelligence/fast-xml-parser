"use strict";

const {XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");
const he = require("he");

describe("XMLParser", function() {
    it("should parse attributes with valid names", function() {
        const xmlData = `<issue _ent-ity.23="Mjg2MzY2OTkyNA==" state="partial" version="1"></issue>`;
        const expected = {
            "issue": {
                "_ent-ity.23": "Mjg2MzY2OTkyNA==",
                "state":       "partial",
                "version":     1
            }
        };
        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse attributes with newline char", function() {
        const xmlData = `<element id="7" data="foo\nbar" bug="true"/>`;
        const expected = {
            "element": {
                "id":   7,
                "data": `foo\nbar`,
                "bug":  true
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse attributes separated by newline char", function() {
        const xmlData = `<element
id="7" data="foo bar" bug="true"/>`;
        const expected = {
            "element": {
                "id":   7,
                "data": "foo bar",
                "bug":  true
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should parse Boolean Attributes", function() {
        const xmlData = `<element id="7" str="" data><selfclosing/><selfclosing /><selfclosingwith attr/></element>`;
        const expected = {
            "element": {
                "id": 7,
                "str": "",
                "data": true,
                "selfclosing": [
                    "",
                    ""
                ],
                "selfclosingwith": {
                    "attr": true
                }
            }
        };

        const options =  {
            attributeNamePrefix:    "",
            ignoreAttributes:       false,
            parseAttributeValue:    true,
            allowBooleanAttributes: true
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).toBe(true);
    });

    it("should not remove xmlns when namespaces are not set to be ignored", function() {
        const xmlData = `<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"></project>`;
        const expected = {
            "project": {
                "xmlns":              "http://maven.apache.org/POM/4.0.0",
                "xmlns:xsi":          "http://www.w3.org/2001/XMLSchema-instance",
                "xsi:schemaLocation": "http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"
            }
        };

        const options =  {
            attributeNamePrefix: "",
            ignoreAttributes:    false
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).toBe(true);
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

        const options =  {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            removeNSPrefix:     true
        }
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData, {
            allowBooleanAttributes: true
        });
        expect(result).toBe(true);
    });

    it("should not parse attributes with name start with number", function() {
        const xmlData = `<issue 35entity="Mjg2MzY2OTkyNA==" ></issue>`;

        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg":  "Attribute '35entity' is an invalid name.",
                "line": 1,
                "col": 8
            }
        };
        const result = XMLValidator.validate(xmlData);

        expect(result).toEqual(expected);
    });

    it("should not parse attributes with invalid char", function() {
        const xmlData = `<issue enti+ty="Mjg2MzY2OTkyNA=="></issue>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg":  "Attribute 'enti+ty' is an invalid name.",
                "line": 1,
                "col": 8
            }
        };

        const result = XMLValidator.validate(xmlData);

        expect(result).toEqual(expected);
    });

    it("should not parse attributes in closing tag", function() {
        const xmlData = `<issue></issue invalid="true">`;
        const expected = {
            "err": {
                "code": "InvalidTag",
                "msg":  "Closing tag 'issue' can't have attributes or invalid starting.",
                "line": 1,
                "col": 8
            }
        };
        const result = XMLValidator.validate(xmlData);

        expect(result).toEqual(expected);
    });

    it("should err for invalid attributes", function() {
        const xmlData = `<rootNode =''></rootNode>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg":  "Attribute '''' has no space in starting.",
                "line": 1,
                "col": 12
            }
        };
        const result = XMLValidator.validate(xmlData);
        expect(result).toEqual(expected);
    });

    it("should validate xml with attributes", function() {
        const xmlData = `<rootNode attr="123"><tag></tag><tag>1</tag><tag>val</tag></rootNode>`;

        const result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should validate xml attribute has '>' in value", function() {
        const xmlData = `<rootNode attr="123>234"><tag></tag><tag>1</tag><tag>val</tag></rootNode>`;

        const result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });

    it("should not validate xml with invalid attributes", function() {
        const xmlData = `<rootNode attr="123><tag></tag><tag>1</tag><tag>val</tag></rootNode>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg":  "Attributes for 'rootNode' have open quote.",
                "line": 1,
                "col": 10
            }
        };
        const result = XMLValidator.validate(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid attributes when duplicate attributes present", function() {
        const xmlData = `<rootNode  abc='123' abc="567" />`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg":  "Attribute 'abc' is repeated.",
                "line": 1,
                "col": 22
            }
        };
        const result = XMLValidator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid attributes when no space between 2 attributes", function() {
        const xmlData = `<rootNode  abc='123'bc='567' />`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg": "Attribute 'bc' has no space in starting.",
                "line": 1,
                "col": 21
            }
        };
        const result = XMLValidator.validate(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not validate a tag with attribute presents without value ", function() {
        const xmlData = `<rootNode ab cd='ef'></rootNode>`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                "msg":  "boolean attribute 'ab' is not allowed.",
                "line": 1,
                "col": 11
            }
        };
        const result = XMLValidator.validate(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not validate xml with invalid attributes presents without value", function() {
        const xmlData = `<rootNode  123 abc='123' bc='567' />`;
        const expected = {
            "err": {
                "code": "InvalidAttr",
                // "msg": "attribute 123 is an invalid name."
                "msg":  "boolean attribute '123' is not allowed.",
                "line": 1,
                "col": 12
            }
        };
        const result = XMLValidator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should validate xml with attributes having open quote in value", function () {
        const xmlData = "<rootNode  123 abc='1\"23' bc=\"56'7\" />";
        const expected = {
            "err": {
                "code": "InvalidAttr",
                // "msg": "attribute 123 is an invalid name."
                "msg":  "boolean attribute '123' is not allowed.",
                "line": 1,
                "col": 12
            }
        };
        const result = XMLValidator.validate(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse and build with tag name 'attributes' ", function() {
        const XMLdata = `
        <test attr="test bug">
          <a name="a">123</a>
          <b name="b"/>
          <attributes>
            <attribute datatype="string" name="DebugRemoteType">dev</attribute>
            <attribute datatype="string" name="DebugWireType">2</attribute>
            <attribute datatype="string" name="TypeIsVarchar">1</attribute>
          </attributes>
        </test>`;
    
          const options = {
            ignoreAttributes: false,
            format: true,
            preserveOrder: true,
            suppressEmptyNode: true,
            unpairedTags: ["star"]
          };
          const parser = new XMLParser(options);
          let result = parser.parse(XMLdata);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
        //   console.log(output);
          expect(output.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });
});
   