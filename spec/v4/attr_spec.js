const XMLParser = require("../../src/v4/xmlparser");

/*
1. Different type of values
2. repeated attributes
    if ignoreNameSpace: true 
    n1:a , n2:a, a all are considered duplicate
3. boolean attributes
4. invalid attribute name
5. > in attribute value
6. quotes in attribute value
7. attrValueProcessor
8. comments in between
9. invalid starting/closing of attribute values
10. self closing tag
11. nospace before attribute name: a="sd"b="saf"
12. attribute with >, /, or other values
*/
describe("XML Parser attributes:", function () {

    it("should not parse repeated attributes", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
        const xmlData = `<rootNode  a="a" a="b" />`;
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Duplicate attribute 'a' in tag 'rootNode'")
    });

    it("should not check for valid/invalid attributes when they are ignored to read", function() {
        const parser = new XMLParser();
        const xmlData = `<rootNode  a="a" a="b" />`; //repeated attributes
        const expected = {
            "rootNode" : ""
        };
        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not parse when boolean attributes are given but not allowed", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: false
        });
        
        const xmlData = `<rootNode  a="val" b />`;
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Boolean attributes are not allowed: 'b' in Tag 'rootNode'")

    });

    it("should parse attribute with valid quotes inside", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
        const expected = {
            rootNode: {
                "__@a": "mohan's bat",
                "__@b":'"name" is special'
            }
        }
        const xmlData = `<rootNode  a="mohan's bat" b='"name" is special' />`;
        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("should not parse attribute with invalid quotes ending", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        //Error in attr2 as no space before 'name' attribute
        const xmlData = `<rootNode  a="mohan's bat' b='" name" is special' />`;
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Incomplete XML Data. Or invald opening tag <rootNode ")
    });

    it("should not parse attribute when no space between 2 attributes", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        //Error in attr2 as no space is left before 'name' attribute
        const xmlData = `<rootNode  a="mohan's bat' b='"name = " is special'" />`;
        
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Not well-formed. No space before attribute 'name' in Tag 'rootNode'")
    });

    it("should parse sttring expresstion with boolean attributes only ", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
        const expected = { rootNode: {"__@a": true, "__@b": true, "__@c": true } };

        const xmlData = `<rootNode  a b c />`;
        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });
    
    it("should not parse attribute with missing value", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        const xmlData = `<rootNode  a= b c />`;
        
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("'a=' is not well formed in tag 'rootNode'")

    });

    it("should not parse attribute with missing value", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        const xmlData = `<rootNode  a= b c />`;

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("'a=' is not well formed in tag 'rootNode'")

    });
    
    describe("attributes separated by \n", function () {
        it("should parse when boolean attribute is spearated by \n", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true
            });
        
            const xmlData = "<rootNode  a\nb='df' c />";
            const expected = { rootNode: { '__@a': true, '__@b': 'df', '__@c': true } };
            const result = parser.parseString(xmlData);
            expect(expected).toEqual(result);
            
        });

        it("should not parse when boolean attribute is spearated by \n but boolean attributes are not allowed", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                //allowBooleanAttributes: true
            });
        
            const xmlData = "<rootNode  a\nb='df' c />";
            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError(`Boolean attributes are not allowed: 'a' in Tag 'rootNode'`)

        });
        
        it("should parse when non-boolean attributes are spearated by \n", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                //allowBooleanAttributes: true
            });
        
            const xmlData = "<rootNode  a='d'\nb='df'/>";
            const expected = { rootNode: { '__@a': 'd', '__@b': 'df'} };
            const result = parser.parseString(xmlData);
            expect(expected).toEqual(result);

        });
    });
    describe("attribute name", function () {
        it("should not contain backslash characters", function() {
            // a\nb will result in boolean attribute 'a' and 'b'
            // a\bb will result in only attribute 'b'
            // a\tb will result in boolean attribute 'a' and 'b'
        });
        it("should not start with number", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
            });
        
            const xmlData = `<rootNode  3a="val" b="val2"  />`;
    
            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("'3a' is not well formed in tag 'rootNode'")
    
        });
        it("should not parse attributes with invalid char", function() {
            
            const parser = new XMLParser({
                ignoreAttributes: false,
            });
            
            const xmlData = `<issue enti+ty="Mjg2MzY2OTkyNA=="></issue>`;
    
            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("'enti+ty' is not well formed in tag 'issue'")
    
        });

        it("should err when attribute name is missing", function() {
            
            const parser = new XMLParser({
                ignoreAttributes: false,
            });
            
            const xmlData = `<tag ="val"></tag>`;

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError(`Boolean attributes are not allowed: '="val"' in Tag 'tag'`)
        });

    });

    describe("attribute values", function () {

        it("should parse all values as string, int, boolean, float, hexadecimal", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true
            });
            const xmlData = `<rootNode 
            empty="" 
            spaces="   " 
            normal="value" 
            boolean 
            int="045" 
            int0="0" 
            negative="-045" 
            invalidNumber="- 045" 
            float="65.34" 
            float2=".34" 
            float0="0.0" 
            long="420926189200190257681175017717" 
            e="123e4" 
            hexadecimal="0x15" >
            </rootNode>`;
            const expected = {
                "rootNode": {
                    "__@empty": '',
                    "__@spaces": '   ',
                    "__@normal": 'value',
                    "__@boolean": true,
                    "__@int": 45,
                    "__@int0": 0,
                    "__@negative": -45,
                    "__@invalidNumber": '- 045',
                    "__@float": 65.34,
                    "__@float2": 0.34,
                    "__@float0": 0,
                    "__@long": 4.209261892001902e+29,
                    "__@e": 1230000,
                    "__@hexadecimal": 21,
                }
            };
    
            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });

        //TODO: pass tagName in attrValueProcessor
        //TODO: user should be able to rename attribute name as well
        it("should parse according to attribute value processor", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true,
                attrValueProcessor: (aName, aVal) => {
                    if(aName === 'b'){
                        return "custom";
                        //return new Date();
                    }else{
                        return aVal;
                    }
                }
            });
        
            const xmlData = "<rootNode  a = \"first\" b='df' c />";
    
            const expected = { rootNode: {"__@a": "first", "__@b": 'custom', "__@c": true } };
    
            const result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
            
        });
        it("should parse attribute with '/' in value", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
            });
        
            const xmlData = "<rootNode  b='3/5'/>";
    
            const expected = { rootNode: { "__@b": '3/5' } };
    
            const result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse attribute with '>' in value", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
            });
        
            const xmlData = "<rootNode  b='5 > 3 or 3 < 5'/>";
    
            const expected = { rootNode: { "__@b": '5 > 3 or 3 < 5' } };
    
            const result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse attribute with backslashe chars including '\n' in value", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
            });
        
            const xmlData = "<rootNode  b='5 >\b 3\t or 3\n < 5'/>";
    
            const expected = { rootNode: { "__@b": '5 >\b 3\t or 3 < 5' } };
    
            const result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        });
    });

    //TODO: shift to closing tag related UTs
    it("should not parse if attributes are in closing tag", function() {
        const xmlData = `<issue></issue invalid="true">`;
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError(`Closing tag is not well formed. '</issue>' was expected instead of '</issue invalid="true">'.`)

    });

    it("should parse attributes with valid names", function() {
        const xmlData = `<issue _ent-ity.23="Mjg2MzY2OTkyNA==" state="partial" version="1"></issue>`;
        const expected = {
            "issue": {
                "_ent-ity.23": "Mjg2MzY2OTkyNA==",
                "state":       "partial",
                "version":     1
            }
        };

        const parser = new XMLParser({
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse duplicate attributes", function() {
        let xmlData = `<rootNode  abc='123' abc="567" />`;
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError(`Duplicate attribute 'abc' in tag 'rootNode'`)

    });

    it("should not parse if comment presents in attributes expression", function() {
        let xmlData = `<rootNode  <!-- comment --> abc='123' abc="567" />`;
        const parser = new XMLParser({
            ignoreAttributes: false,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError(`'<!--' is not well formed in tag 'rootNode'`)

    });


});
