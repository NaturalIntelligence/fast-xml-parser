"use strict";

const parser = require("../src/parser");

describe("XMLParser with array_mode enabled ", function () {
    it("should parse all the tags as an array no matter how many occurences excluding premitive values when arrayMode is set to true", function () {
        const xmlData = `<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name dummy="attr">Banana</name>
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

        const expected = {
            "report": [
                {
                    "store": [
                        {
                            "region": "US",
                            "inventory": [
                                {
                                    "item": [
                                        {
                                            "name": "Banana",
                                            "count": 200
                                        },
                                        {
                                            "name": "Apple",
                                            "count": 100
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            "region": "EU",
                            "inventory": [
                                {
                                    "item": [
                                        {
                                            "name": "Banana",
                                            "count": 100
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const result = parser.parse(xmlData, {
            arrayMode: true,
            ignoreAttributes: false,
        });
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(expected);
    });

    it("should parse all the tags as an array no matter how many occurences  when arrayMode is set to strict", function () {
        const xmlData = `<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">
                    <name dummy="attr">Banana</name>
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

        const expected = {
            "report": [
                {
                    "store": [
                        {
                            "region": ["US"],
                            "inventory": [
                                {
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
                            ]
                        },
                        {
                            "region": ["EU"],
                            "inventory": [
                                {
                                    "item": [
                                        {
                                            "name": [ "Banana" ],
                                            "count": [100]
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        };

        const result = parser.parse(xmlData, {
            arrayMode: "strict",
            ignoreAttributes: false,
        });
        //console.log(JSON.stringify(result, null, 4));
        expect(result).toEqual(expected);
    });

    it("try", function () {
        const xmlData = `<report>
        <store>
            <region>US</region>
            <inventory>
                <item grade="A">some item detail
                    <name>Banana</name>
                    <count>200</count>
                </item>
                <item grade="B">
                    <![CDATA[som text]]>
                    <name>Apple</name>
                    <count>100</count>
                </item>
            </inventory>
        </store>
    </report>`;

        let result = parser.parse(xmlData, {
            arrayMode: true,
            ignoreAttributes: false,
            cdataTagName:     "__cdata",
            attrNodeName: "@@"
        });
        console.log(JSON.stringify(result, null, 4));
        //expect(result).toEqual(expected);

        result = parser.parse(xmlData, {
            arrayMode: 'strict',
            ignoreAttributes: false,
            cdataTagName:     "__cdata",
            attrNodeName: "@@"
        });
        console.log(JSON.stringify(result, null, 4));
        //expect(result).toEqual(expected);
    });
});



