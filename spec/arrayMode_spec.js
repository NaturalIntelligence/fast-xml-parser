"use strict";

const {XMLParser} = require("../src/fxp");

describe("XMLParser with arrayMode enabled", function () {

    const xmlData = `<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name>Banana</name>
                    <count>200</count>
                </item>
                <item grade="B">
                    <name>Apple</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
        <store>
            <region>EU</region>
            <inventory>
                <item>
                    <name>Banana</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
    </report>`;

    it("should parse as Array for selective properties", function () {

        const expected = {
            "report": {
                "store": [
                    {
                        "region": "US",
                        "inventory":{
                                "item": [
                                    {
                                        "@_grade" : "A",
                                        "name": "Banana",
                                        "count": 200
                                    },
                                    {
                                        "@_grade" : "B",
                                        "name": "Apple",
                                        "count": 100
                                    }
                                ]
                            }
                    },
                    {
                        "region": "EU",
                        "inventory": {
                                "item": [
                                    {
                                        "name": "Banana",
                                        "count": 100
                                    }
                                ]
                            }
                    }
                ]
            }
        };

        const alwaysArray = [
            "report.store.inventory.item"
        ];
        const options = {
            ignoreAttributes: false,
            isArray: (tagName, jpath, isLeafNode) => { 
                // console.log(tagName, jpath, isLeafNode) 
                if( alwaysArray.indexOf(jpath) !== -1) return true;
              }
        };

        const parser = new XMLParser(options);
        const result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    it("should parse only leaf nodes as Array but not attributes if set", function () {

        const expected = {
            "report": {
                "store": [
                    {
                        "region": ["US"],
                        "inventory":{
                                "item": [
                                    {
                                        "@_grade" : "A",
                                        "name": ["Banana"],
                                        "count": [200]
                                    },
                                    {
                                        "@_grade" : "B",
                                        "name": ["Apple"],
                                        "count": [100]
                                    }
                                ]
                            }
                    },
                    {
                        "region": ["EU"],
                        "inventory": {
                                "item": {
                                        "name": ["Banana"],
                                        "count": [100]
                                    }
                            }
                    }
                ]
            }
        };

        const options = {
            ignoreAttributes: false,
            isArray: (tagName, jpath, isLeafNode, isAttribute) => { 
                if(isLeafNode === true && isAttribute !== true) return true;
              }
        };
        const parser = new XMLParser(options);
        const result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    it("should parse only leaf nodes and attributes as Array if set", function () {

        const expected = {
            "report": {
                "store": [
                    {
                        "region": ["US"],
                        "inventory":{
                                "item": [
                                    {
                                        "@_grade" : ["A"],
                                        "name": ["Banana"],
                                        "count": [200]
                                    },
                                    {
                                        "@_grade" : ["B"],
                                        "name": ["Apple"],
                                        "count": [100]
                                    }
                                ]
                            }
                    },
                    {
                        "region": ["EU"],
                        "inventory": {
                                "item": {
                                        "name": ["Banana"],
                                        "count": [100]
                                    }
                            }
                    }
                ]
            }
        };

        const options = {
            ignoreAttributes: false,
            isArray: (tagName, jpath, isLeafNode, isAttribute) => { 
                if(isLeafNode === true) return true;
              }
        }
        const parser = new XMLParser(options);
        const result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse leaf tags with zero or false value correctly in arrayMode", function () {
        const xmlDataExample = `
            <report>
                <value>0</value>
                <isNew>false</isNew>
                <isReport>true</isReport>
            </report>`

        const expected = {
            "report": 
                [
                    {
                        "value": 0,
                        "isNew": false,
                        "isReport": true
                    }
                ]
        };

        const options = {
            ignoreAttributes: false,
            isArray: (tagName, jpath, isLeafNode, isAttribute) => { 
                if(!isLeafNode) return true;
              }
        }
        const parser = new XMLParser(options);
        const result = parser.parse(xmlDataExample);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse only attributes as Array if set", function () {

        const expected = {
            "report": {
                "store": [
                    {
                        "region": "US",
                        "inventory":{
                                "item": [
                                    {
                                        "@_grade" : ["A"],
                                        "name": "Banana",
                                        "count": 200
                                    },
                                    {
                                        "@_grade" : ["B"],
                                        "name": "Apple",
                                        "count": 100
                                    }
                                ]
                            }
                    },
                    {
                        "region": "EU",
                        "inventory": {
                                "item": {
                                        "name": "Banana",
                                        "count": 100
                                    }
                            }
                    }
                ]
            }
        };
        const options = {
            ignoreAttributes: false,
            isArray: (tagName, jpath, isLeafNode, isAttribute) => { 
                if(isAttribute === true) return true;
              }
        }
        const parser = new XMLParser(options);
        const result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

});



