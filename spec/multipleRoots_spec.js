"use strict";

import { XMLParser } from "../src/fxp.js";

describe("XMLParser - Multiple Roots Handling", function() {

    describe("Positive Scenarios - multipleRoots: true", function() {
        
        it("should parse XML with two root elements when multipleRoots is true", function() {
            const xmlData = `<root1>value1</root1><root2>value2</root2>`;
            const expected = {
                "root1": "value1",
                "root2": "value2"
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse XML with three root elements when multipleRoots is true", function() {
            const xmlData = `<first>data1</first><second>data2</second><third>data3</third>`;
            const expected = {
                "first": "data1",
                "second": "data2",
                "third": "data3"
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse complex XML with multiple root elements containing nested tags", function() {
            const xmlData = `
                <order>
                    <id>123</id>
                    <customer>John Doe</customer>
                </order>
                <order>
                    <id>456</id>
                    <customer>Jane Smith</customer>
                </order>
            `;
            const expected = {
                "order": [
                    {
                        "id": 123,
                        "customer": "John Doe"
                    },
                    {
                        "id": 456,
                        "customer": "Jane Smith"
                    }
                ]
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse different tag names as multiple roots", function() {
            const xmlData = `<product>Widget</product><service>Support</service>`;
            const expected = {
                "product": "Widget",
                "service": "Support"
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse single root element when multipleRoots is true", function() {
            const xmlData = `<single>only one root</single>`;
            const expected = {
                "single": "only one root"
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should ignore comments and PIs when checking for multiple roots", function() {
            const xmlData = `<?xml version="1.0"?><!-- comment here --><root1>value1</root1><!-- another comment --><root2>value2</root2>`;
            const expected = {
                "?xml": "",
                "root1": "value1",
                "root2": "value2"
            };

            const options = {
                multipleRoots: true,
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse multiple roots with mixed content", function() {
            const xmlData = `<elem1>text1</elem1><elem2>text2</elem2><elem3><nested>deep</nested></elem3>`;
            const expected = {
                "elem1": "text1",
                "elem2": "text2",
                "elem3": {
                    "nested": "deep"
                }
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should parse multiple roots with whitespace between them", function() {
            const xmlData = `
                <root1>
                    <data>value1</data>
                </root1>
                
                <root2>
                    <data>value2</data>
                </root2>
            `;
            const expected = {
                "root1": {
                    "data": "value1"
                },
                "root2": {
                    "data": "value2"
                }
            };

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });
    });

    describe("Negative Scenarios - multipleRoots: false (default)", function() {

        it("should throw error when multiple root elements found and multipleRoots is false", function() {
            const xmlData = `<root1>value1</root1><root2>value2</root2>`;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow(new Error("Multiple root tags found. Root tags: root1, root2"));
        });

        it("should throw error with correct root tag names in error message", function() {
            const xmlData = `<firstTag>data1</firstTag><secondTag>data2</secondTag><thirdTag>data3</thirdTag>`;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow(new Error("Multiple root tags found. Root tags: firstTag, secondTag, thirdTag"));
        });

        it("should throw error when duplicate root elements found", function() {
            const xmlData = `<order><id>123</id></order><order><id>456</id></order>`;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should not throw error for single root element when multipleRoots is false", function() {
            const xmlData = `<root><child>value</child></root>`;
            const expected = {
                "root": {
                    "child": "value"
                }
            };

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should ignore comments when checking for multiple roots (should not treat comments as roots)", function() {
            const xmlData = `<!-- This is a comment --><root>value</root><!-- Another comment -->`;
            const expected = {
                "root": "value"
            };

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should ignore processing instructions when checking for multiple roots", function() {
            const xmlData = `<?xml version="1.0" encoding="UTF-8"?><root>value</root>`;
            const expected = {
                "root": "value"
            };

            const options = {
                multipleRoots: false,
                ignoreDeclaration: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should ignore CDATA sections when checking for multiple roots", function() {
            const xmlData = `<root><![CDATA[some data]]></root>`;
            const expected = {
                "root": "some data"
            };

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });

        it("should throw error when root1 and root2 exist even with whitespace between them", function() {
            const xmlData = `
                <root1>
                    <data>value1</data>
                </root1>
                
                <root2>
                    <data>value2</data>
                </root2>
            `;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should throw error when multiple roots with attributes exist", function() {
            const xmlData = `<item id="1">First</item><item id="2">Second</item>`;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should correctly identify and report root tags even with complex nesting", function() {
            const xmlData = `<parent1><child><grandchild>data</grandchild></child></parent1><parent2><child>data</child></parent2>`;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow(new Error("Multiple root tags found. Root tags: parent1, parent2"));
        });
    });

    describe("Edge Cases - Comment and Non-Element Mixed", function() {

        it("should handle multiple roots with comments interspersed", function() {
            const xmlData = `
                <!-- Start of document -->
                <root1>value1</root1>
                <!-- Middle comment -->
                <root2>value2</root2>
                <!-- End of document -->
            `;

            const options = {
                multipleRoots: true
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            
            expect(result).toEqual({
                "root1": "value1",
                "root2": "value2"
            });
        });

        it("should throw error for multiple roots even with comments interspersed when multipleRoots is false", function() {
            const xmlData = `
                <!-- Start -->
                <root1>value1</root1>
                <!-- Middle -->
                <root2>value2</root2>
                <!-- End -->
            `;

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should ignore text nodes at root level when counting roots", function() {
            const xmlData = `
                Some text
                <root>value</root>
                More text
            `;
            const expected = {
                "root": "value"
            };

            const options = {
                multipleRoots: false
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });
    });

    describe("Default Behavior", function() {

        it("should use multipleRoots: false as default and throw error for multiple roots", function() {
            const xmlData = `<root1>value1</root1><root2>value2</root2>`;

            const parser = new XMLParser(); // No options provided
            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should parse single root successfully with default options", function() {
            const xmlData = `<root>value</root>`;
            const expected = {
                "root": "value"
            };

            const parser = new XMLParser(); // No options provided
            let result = parser.parse(xmlData);
            expect(result).toEqual(expected);
        });
    });

    describe("Custom commentPropName and cdataPropName Options", function() {

        it("should capture comments as properties when commentPropName is set to a string", function() {
            const xmlData = `<!-- Comment 1 --><root>value</root><!-- Comment 2 -->`;
            const expected = {
                "#comment": [
                    " Comment 1 ",
                    " Comment 2 "
                ],
                "root": "value"
            };

            const options = {
                multipleRoots: false,
                commentPropName: "#comment"
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            expect(result).toEqual(expected);
        });

        it("should capture both comments and CDATA when both options are set to string values", function() {
            const xmlData = `<!-- Comment --><root><![CDATA[data]]></root>`;
            const expected = {
                "#comment": " Comment ",
                "root": {
                    "#cdata": "data"
                }
            };

            const options = {
                multipleRoots: false,
                commentPropName: "#comment",
                cdataPropName: "#cdata"
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            expect(result).toEqual(expected);
        });

        it("should throw error for multiple roots even with commentPropName and cdataPropName set when multipleRoots is false", function() {
            const xmlData = `<!-- Comment --><elem1>data1</elem1><!-- Comment --><elem2>data2</elem2>`;

            const options = {
                multipleRoots: false,
                commentPropName: "#comment",
                cdataPropName: "#cdata"
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should parse CDATA sections when cdataPropName is false (default)", function() {
            const xmlData = `<root1><![CDATA[some data]]></root1><root2><![CDATA[more data]]></root2>`;

            const options = {
                multipleRoots: true,
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            expect(result).toEqual({
                "root1": "some data",
                "root2": "more data"
            });
        });

        it("should handle multiple roots with mixed comments and CDATA when both options are enabled", function() {
            const xmlData = `
                <!-- Start -->
                <root1>
                    text1
                    <![CDATA[cdata1]]>
                </root1>
                <!-- Middle -->
                <root2>
                    text2
                    <![CDATA[cdata2]]>
                </root2>
                <!-- End -->
            `;
            const expected = {
                "#comment": [
                    " Start ",
                    " Middle ",
                    " End "
                ],
                "root1": {
                    "#text": "text1",
                    "#cdata": "cdata1"
                },
                "root2": {
                    "#text": "text2",
                    "#cdata": "cdata2"
                }
            };

            const options = {
                multipleRoots: true,
                commentPropName: "#comment",
                cdataPropName: "#cdata"
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            expect(result).toEqual(expected);
        });

        it("should correctly count root elements when custom commentPropName is not a standard comment marker", function() {
            const xmlData = `<!-- Comment --><elem1>data1</elem1><elem2>data2</elem2>`;

            const options = {
                multipleRoots: false,
                commentPropName: "customComment"
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow(new Error("Multiple root tags found. Root tags: elem1, elem2"));
        });

        it("should parse multiple roots when commentPropName is explicitly set to false (disabled)", function() {
            const xmlData = `<!-- Comment --><root1>value1</root1><root2>value2</root2>`;

            const options = {
                multipleRoots: true,
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            // When commentPropName is false, comments are not captured as properties
            expect(result.root1).toBe("value1");
            expect(result.root2).toBe("value2");
        });

        it("should parse multiple roots when cdataPropName is explicitly set to false (disabled)", function() {
            const xmlData = `<root1><![CDATA[data1]]></root1><root2><![CDATA[data2]]></root2>`;

            const options = {
                multipleRoots: true,
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            expect(result.root1).toBe("data1");
            expect(result.root2).toBe("data2");
        });

        it("should throw error for multiple roots with custom property names when multipleRoots is false", function() {
            const xmlData = `<doc1><![CDATA[content1]]></doc1><doc2><![CDATA[content2]]></doc2>`;

            const options = {
                multipleRoots: false,
                cdataPropName: "__cdata"
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow();
        });

        it("should correctly identify multiple roots even with empty comments when commentPropName is enabled", function() {
            const xmlData = `<!----><primary>first</primary><!----><secondary>second</secondary><!---->`;

            const options = {
                multipleRoots: false,
                commentPropName: "#comment"
            };
            const parser = new XMLParser(options);

            expect(() => {
                parser.parse(xmlData);
            }).toThrow(new Error("Multiple root tags found. Root tags: primary, secondary"));
        });

        it("should handle multiple roots with complex CDATA content and custom property names", function() {
            const xmlData = `
                <message1><![CDATA[<tag>content with < and > and &</tag>]]></message1>
                <message2><![CDATA[Another message with special chars]]></message2>
            `;
            const expected = {
                "message1": {
                    "#cdata": "<tag>content with < and > and &</tag>"
                },
                "message2": {
                    "#cdata": "Another message with special chars"
                }
            };

            const options = {
                multipleRoots: true,
                cdataPropName: "#cdata"
            };
            const parser = new XMLParser(options);
            let result = parser.parse(xmlData);

            expect(result).toEqual(expected);
        });
    });
});
