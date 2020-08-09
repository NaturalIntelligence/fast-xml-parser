const XMLParser = require("../../src/v4/xmlparser");

describe("XML Parser", function () {
    const parser = new XMLParser();
    
    it("should error when not matching closing tag", function() {
        const xmlData = `<tab>data</tag>`;
        
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Closing tag is not well formed. '</tab>' was expected instead of '</tag>'.")
        

        //console.log(JSON.stringify(result,null,4));
    });

    it("should parse when closing tag has spaces after", function() {

        const xmlData = `<tag>data</tag >`;
        let result = parser.parseString(xmlData);
        expect(result).toEqual({
            tag: "data"
        })
        //console.log(JSON.stringify(result,null,4));
    });

    it("should error when attributes are present in closing tag", function() {
        const xmlData = `<tag>data</tag attr='val'>`;

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Closing tag is not well formed. '</tag>' was expected instead of '</tag attr='val'>'.")
        
    });

    it("should error when space is before closing tag name", function() {
        const xmlData = `<tag>data</ tag>`;

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Closing tag is not well formed. '</tag>' was expected instead of '</ tag>'.")
    });
    
    //TODO: Expecting invalid tag name error
    it("should error when space is present before closing tag starts", function() {
        const xmlData = `<tag>data< /tag>`;
        
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Boolean attributes are not allowed: '/tag' in Tag ''")
    });

    //TODO: Expected error is invalid tag ''
    it("should error when space is present before opening tag starts", function() {
        const xmlData = `< tag>data</tag>`;
        
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Boolean attributes are not allowed: 'tag' in Tag ''")

        //console.log(JSON.stringify(result,null,4));
    });

    //TODO: Expected error is invalid tag '''
    it("should error when space is present before opening tag starts", function() {
        const xmlData = `<' tag>data</tag>`;
        
        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Incomplete XML Data. Or invald opening tag <' tag>dat")

        //console.log(JSON.stringify(result,null,4));
    });

    
    it("should parse when single self closing tag", function() {
        const xmlData = `<root />`;
        const expected = {
            "root": ""
        };
        let result = parser.parseString(xmlData);
        expect(result).toEqual(expected)
        //console.log(JSON.stringify(result,null,4));
    });

    it("should not parse when closing char is not given", function() {
        const parser = new XMLParser({
            ignoreAttributes: true,
            parseAttributeValue: true,
            allowBooleanAttributes: true
        });
    
        const xmlData = `<rootNode  a="mohan's bat' b='"name" is special' `;

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("Incomplete XML Data. Or invald opening tag <rootNode ")
    });

    describe("should parse when tags are repeated", function() {

        it("should parse when nested, repeated tags", function() {
            const xmlData = `<root>
                <parent>
                    <child>yes</child>
                    <sibling>yes</sibling>
                    <child>yes</child>
                </parent>
            </root >`;
            const expected = {
                "root": {
                    "parent": {
                        "child": [
                            "yes",
                            "yes"
                        ],
                        "sibling": "yes"
                    }
                }
            };
            let result = parser.parseString(xmlData);
            expect(result).toEqual(expected)
            //console.log(JSON.stringify(result,null,4));
        });

        
        it("combination 1", function() {
            
            const xmlData = `<a>
                <c>end1</c>
                <c>end2<a></a></c>
            </a>`;

            const expected = {
                "a": {
                    "c": [
                        "end1",
                        { 
                            "a": "",
                            "__#text": "end2"
                        }
                    ]
                }
            };
            
            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });
        it("combination 2", function() {
            const xmlData = `<a>
                <c>end1</c>
                <c>end2<a></a>end3</c>
            </a>`;

            const expected = {
                "a": {
                    "c": [
                        "end1",
                        {
                            "a": "",
                            "__#text": [
                                "end2",
                                "end3"
                            ]
                        }
                    ]
                }
            };

            
            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });
        it("combination 3", function() {
            const xmlData = `<a>
                <b>end1</b>
                <c>end2<a></a>end3</c>
            </a>`;

            const expected = {
                "a": {
                    "b": "end1",
                    "c": {
                        "a": "",
                        "__#text": [
                            "end2",
                            "end3"
                        ]
                    }
                }
            };

            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });
    });
});