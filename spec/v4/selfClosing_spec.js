/*
1. selfclosing tag should be parsed with empty value
2. selfclosing tag should be parsed with empty value when suppress
*/
const XMLParser = require("../../src/v4/xmlparser");

describe("XML Parser", function () {
    
it("should parse selfclosing tags", function() {
    const parser = new XMLParser({
        ignoreAttributes:    false,
        tagValueProcessor: (name, val, attrs) => {
            if(name !== "rootNode"){
                expect(val).toBe('')
            }
        }
    });
    const xmlData = `<rootNode>
    <self />
    <selfclose/>
    <selfclosing a="34"/>
    </rootNode>`;
    const expected = {
        "rootNode": {
            "self": "",
            "selfclose": "",
            "selfclosing": {
                "__@a": "34"
            }
        }
    };

    const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    describe("should not parse when '/' is on wrong position'", function(){
        it("when there is space after '/'", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: false
            });
            
            const xmlData = `<rootNode  a="val" / >`;
    
            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Boolean attributes are not allowed: '/' in Tag 'rootNode'")
    
    
        });
    
        it("when there is no space between between '/' and boolean attribute", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                allowBooleanAttributes: true
            });
            
            const xmlData = `<rootNode  a="val" b/>`;
    
            const expected = {
                rootNode: {
                    "__@a": "val",
                    "__@b": true
                }
            }
            const result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        })
        it("when there is no space between between '/' and normal attribute", function() {
            const parser = new XMLParser({
                ignoreAttributes: false,
                allowBooleanAttributes: true
            });
            
            const xmlData = `<rootNode  b a="val"/>`;
    
            const expected = {
                rootNode: {
                    "__@a": "val",
                    "__@b": true
                }
            }
            const result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        })
        
    });
});