const XMLParser = require("../../src/v4/xmlparser");

//6. closing tag
    //1. closing tag with NS, opening tag without NS or vice versa

describe("Namespace", function () {

    describe("xmlns", function () {
        it(" should work fine when xmlns is missing, attributes are ignored, and NS is not used with tagname", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: true,
                //removeNSPrefix: true //default
                ignoreNSScoping: false,
            });

            const xmlData = `<rootNode>
                <tag ns:arg='value'>value</tag>
                <floatTag>65.34</floatTag>
            </rootNode>`;

            const expected = {
                "rootNode": {
                    "tag": "value",
                    "floatTag": 65.34,
                }
            };

            const actual = parser.parseString(xmlData);
            expect(expected).toEqual(actual)
        });

        it(" should error when xmlns is missing, attributes are ignored, but NS is used with tagname", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: true,
                //removeNSPrefix: true //default
                ignoreNSScoping: false,
            });

            const xmlData = `<rootNode>
                <tag ns:arg='value'>value</tag>
                <intTag ns:arg='value' ns:arg2='value2' >45</intTag>
                <ns:floatTag>65.34</floatTag>
            </rootNode>`;

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Namespace 'ns' is not bound to 'ns:floatTag'. Tag 'ns:floatTag'")
        });

        it(" should error when xmlns is missing, attributes are not ignored", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                //removeNSPrefix: true //default
                ignoreNSScoping: false,
            });

            const xmlData = `<rootNode>
                <tag ns:arg='value'>value</tag>
                <intTag ns:arg='value' ns:arg2='value2' >45</intTag>
                <floatTag>65.34</floatTag>
            </rootNode>`;

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Namespace 'ns' is not bound to 'ns:arg'. Tag 'tag'")
        });

        it(" should not error when xmlns is missing but ignoreNSScoping: true", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                //removeNSPrefix: true //default
                //ignoreNSScoping: true, //default
            });

            const xmlData = `<rootNode>
                <tag ns:arg='value'>value</tag>
                <ns:floatTag>65.34</ns:floatTag>
            </rootNode>`;

            const expected = {
                "rootNode": {
                    "tag": {
                        "arg": "value",
                        "__#text": "value"
                    },
                    "floatTag": 65.34
                }
            };

            const actual = parser.parseString(xmlData);
            //console.log(JSON.stringify(actual,null,4) )
            expect(expected).toEqual(actual)
        });

        it(" should not remove xmlns and related attributes if ignoreXmlnsAttributes: false", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                ignoreXmlnsAttributes: false,
                //removeNSPrefix: true //default
                //ignoreNSScoping: true, //default
            });

            const xmlData = `<rootNode>
                <tag xmlns:ns="something" ns:arg='value'>value</tag>
            </rootNode>`;

            const expected = {
                "rootNode": {
                    "tag": {
                        "xmlns:ns": 'something',
                        "arg": "value",
                        "__#text": "value"
                    }
                }
            };

            const actual = parser.parseString(xmlData);
            //console.log(JSON.stringify(actual,null,4) )
            expect(expected).toEqual(actual)
        });

        it(" should parse with multiple xmlns in single tag", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                removeNSPrefix: false //default
                //ignoreNSScoping: true, //default
            });

            const xmlData = `<rootNode>
                <tag xmlns:ns="something" xmlns:mn="something" ns:arg='value' mn:arg='value'>value</tag>
            </rootNode>`;

            const expected = {
                "rootNode": {
                    "tag": {
                        "ns:arg": "value",
                        "mn:arg": "value",
                        "__#text": "value"
                    },
                }
            };

            const actual = parser.parseString(xmlData);
            //console.log(JSON.stringify(actual,null,4) )
            expect(expected).toEqual(actual)
        });

        it(" should error when empty NS resource", function () {
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                //removeNSPrefix: true //default
                //ignoreNSScoping: true, //default
            });

            const xmlData = `<rootNode>
                <tag xmlns:ns="" ns:arg='value'>value</tag>
                <ns:floatTag>65.34</floatTag>
            </rootNode>`;

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Namespace 'xmlns:ns' is assigned to emptry source")
        });

    });

    describe("scoping", function () {
        it("should parse with nested namespace", function () {
            const xmlData = `<ab:tag xmlns:ab="url" >
                <sibling1 xmlns:mn="url" >
                    <ab:nested>
                        <mn:deep mn:ab='va' ab:attr='val'></mn:deep>
                    </ab:nested>
                </sibling1>
            </ab:tag>`;
            const expected = {
                "ab:tag": {
                    "sibling1": {
                        "ab:nested": {
                            "mn:deep": {
                                "mn:ab": "va",
                                "ab:attr": "val"
                            }
                        }
                    },
                }
            };

            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                removeNSPrefix: false,
                ignoreNSScoping: false
            });

            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });

        it("should error if a NS used out of NS scope", function () {
            const xmlData = `<ab:tag xmlns:ab="url" >
                <sibling1 xmlns:mn="url" >
                    <ab:nested>
                        <mn:deep mn:ab='va' ab:attr='val'></mn:deep>
                    </ab:nested>
                </sibling1>
                <sibling1 ab:a="good" mn:b="bad">
                </sibling1>
            </ab:tag>`;

            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                removeNSPrefix: false,
                ignoreNSScoping: false
            });

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Namespace 'mn' is not bound to 'mn:b'. Tag 'sibling1'")

        });

        it("should parse with nested namespace when attributes are ignored", function () {
            const xmlData = `<ab:tag xmlns:ab="url" >
                <sibling1 xmlns:mn="url" >
                    <ab:nested>
                        <mn:deep mn:ab='va' ab:attr='val'></mn:deep>
                    </ab:nested>
                </sibling1>
            </ab:tag>`;
            const expected = {
                "ab:tag": {
                    "sibling1": {
                        "ab:nested": {
                            "mn:deep": ""
                        }
                    },
                }
            };

            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: true,
                removeNSPrefix: false,
                ignoreNSScoping: false
            });

            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });

    });

    describe("repeatative attributes", function () {
        it("should parse duplicate attributes when 1 attribute us is attached to a namespaces", function () {
            const xmlData = `<rootNode xmlns:ab="some url" ab:abc='123' abc="567" />`;
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true,
                removeNSPrefix: false
            });

            const expected = {
                rootNode: {
                    "ab:abc": 123,
                    abc: 567
                }
            }
            let result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        });
        
        it("should parse duplicate attributes when both attributes are attached to different NS", function () {
            const xmlData = `<rootNode xmlns:mn="some url" xmlns:ab="some url" ab:abc='123' mn:abc="567" />`;
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true,
                removeNSPrefix: false
            });

            const expected = {
                rootNode: {
                    "ab:abc": 123,
                    "mn:abc": 567
                }
            }
            let result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        });

        it("should error when duplicate attributes are in same namespace", function () {
            const xmlData = `<rootNode xmlns:ab="some url" ab:abc='123' ab:abc="567" />`;
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true,
                removeNSPrefix: false
            });

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Duplicate attribute 'ab:abc' in tag 'rootNode'")
        });

        it("should error for duplicate attributes in different namespaces but removeNSPrefix: true", function () {
            const xmlData = `<rootNode xmlns:ab="some url" ab:abc='123' abc="567" />`;
            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                parseAttributeValue: true,
                allowBooleanAttributes: true,
                //removeNSPrefix: true //default
            });

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Duplicate attribute 'abc' in tag 'rootNode'")
        });

       
    });
    describe("repeatative tags", function () {
        it("should group repeated tags when NS prefix is removed", function () {
            const xmlData = `
            <root>
                <ab:someTag xmlns:ab="some url">val</ab:someTag>
                <mn:someTag xmlns:mn="some url"/>
                <someTag />
            </root>
            `;
            const parser = new XMLParser({
                //removeNSPrefix: true
            });

            const expected = {
                root: {
                    someTag: [
                        "val",
                        "",
                        ""
                    ]
                }
            };
            let result = parser.parseString(xmlData);
            expect(result).toEqual(expected);
        });
        
        it("should not group repeated tags when NS prefix is not removed and tags are in different NS", function () {
            const xmlData = `
            <root>
                <ab:someTag xmlns:ab="some url">val</ab:someTag>
                <mn:someTag xmlns:mn="some url"/>
                <someTag />
            </root>
            `;
            const parser = new XMLParser({
                removeNSPrefix: false
            });

            const expected = {
                root: {
                    "ab:someTag": "val",
                    "mn:someTag": "",
                    "someTag": ""
                }
            };
            let result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4))
            expect(result).toEqual(expected);
        });
        
    });

    describe("other", function () {
        it("should parse with attriute prefix", function () {
            const xmlData = `<ab:tag
            xmlns:ab="url" ab="mn" ab:ab="op" >
            </ab:tag>`;
            const expected = {
                "ab:tag": {
                    "ab" : "mn",
                    "ab:ab" : "op"
                }
            };

            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: false,
                removeNSPrefix: false,
                ignoreNSScoping: false
            });

            const result = parser.parseString(xmlData);
            //console.log(JSON.stringify(result,null,4));
            expect(result).toEqual(expected);
        });

        it("should error when closing tag doesn't have NS but opening tag has and removeNSPrefix: true", function () {
            const xmlData = `<ab:tag
            xmlns:ab="url" ab="mn" ab:ab="op" >
            </tag>`;

            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: true,
                //removeNSPrefix: true,
                //ignoreNSScoping: false
            });

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Closing tag is not well formed. '</ab:tag>' was expected instead of '</tag>'.");

        });

        it("should error when closing tag doesn't have NS but opening tag has and removeNSPrefix: false", function () {
            const xmlData = `<ab:tag
            xmlns:ab="url" ab="mn" ab:ab="op" >
            </tag>`;

            const parser = new XMLParser({
                attributeNamePrefix: "",
                ignoreAttributes: true,
                removeNSPrefix: false,
                //ignoreNSScoping: false
            });

            expect(() => {
                parser.parseString(xmlData);
            }).toThrowError("Closing tag is not well formed. '</ab:tag>' was expected instead of '</tag>'.");

        });
    });

});