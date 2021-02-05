"use strict";

const parser = require("../src/parser");

describe("XMLParser with arrayMode enabled", function () {
    it("should parse all the tags as an array no matter how many occurrences excluding primitive values when arrayMode is set to true", function () {
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

        expect(result).toEqual(expected);
    });

    it("should parse all the tags as an array no matter how many occurrences when arrayMode is set to strict", function () {
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

        expect(result).toEqual(expected);
    });

    it("should parse all the tags as an array that match arrayMode RegEx or return true as callback", function () {
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

        const expected = {
            "report":
              {
                  "store": [
                      {
                          "region": "US",
                          "inventory": [
                              {
                                  "item": [
                                      {
                                          "@_grade": "A",
                                          "name": "Banana",
                                          "count": 200
                                      },
                                      {
                                          "@_grade": "B",
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

        };

        const regExResult = parser.parse(xmlData, {
            arrayMode: /inventory|item/,
            ignoreAttributes: false,
        });
        expect(regExResult).toEqual(expected);

        const cbExResult = parser.parse(xmlData, {
            arrayMode: function (tagName) {
                return ['inventory', 'item'].includes(tagName)
            },
            ignoreAttributes: false,
        });
        expect(cbExResult).toEqual(expected);
    });

    it("should parse all the tags as an array that match arrayMode callback with parent tag", function () {
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

        const expected = {
            "report":
              {
                  "store": [
                      {
                          "region": "US",
                          "inventory":
                            {
                                "item": [
                                    {
                                        "@_grade": "A",
                                        "name": "Banana",
                                        "count": 200
                                    },
                                    {
                                        "@_grade": "B",
                                        "name": "Apple",
                                        "count": 100
                                    }
                                ]
                            }
                      },
                      {
                          "region": "EU",
                          "inventory":
                            {
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

        const cbExResult = parser.parse(xmlData, {
            arrayMode: function (tagName, parentTagName) {
                return parentTagName === 'inventory';
            },
            ignoreAttributes: false,
        });

        expect(cbExResult).toEqual(expected);
    });
});



