"use strict";

const XMLParser = require("../src/parser");
const J2XParser = require("../src/parser").j2xParser;
const he = require("he");

describe("XMLParser", function() {

    it("should parse to XML with nested tags", function() {
        const xml = `<config-file target="*-Info.plist" parent="CFBundleURLTypes">
                <array>
                <dict>
                    <key>CFBundleTypeRole</key>
                    <string>Editor</string>
                    <key>CFBundleURLName</key>
                    <string>REVERSED_CLIENT_ID</string>
                    <key>CFBundleURLSchemes</key>
                    <array>
                        <string>$REVERSED_CLIENT_ID</string>
                    </array>
                </dict>
                </array>
            </config-file>
        `;

        const jsObj = XMLParser.parse(xml, {
            ignoreAttributes: false,
            arrayMode: true
        });
        const j2xParser = new J2XParser({
            ignoreAttributes: false,
            textNodeName: '__#text',
            attributeNamePrefix: '__@'
        });
        const result = j2xParser.parse([
            {
                "config-file": [
                    {
                        "__@target": "*-Info.plist"
                    },
                    {
                        "__@parent": "CFBundleURLTypes"
                    },
                    {
                        "array": [
                            {
                                "dict": [
                                    {
                                        "key": [
                                            {
                                                "__#text": "CFBundleTypeRole"
                                            }
                                        ]
                                    },
                                    {
                                        "string": [
                                            {
                                                "__#text": "Editor"
                                            }
                                        ]
                                    },
                                    {
                                        "key": [
                                            {
                                                "__#text": "CFBundleURLName"
                                            }
                                        ]
                                    },
                                    {
                                        "string": [
                                            {
                                                "__#text": "REVERSED_CLIENT_ID"
                                            }
                                        ]
                                    },
                                    {
                                        "key": [
                                            {
                                                "__#text": "CFBundleURLSchemes"
                                            }
                                        ]
                                    },
                                    {
                                        "array": [
                                            {
                                                "string": [
                                                    {
                                                        "__#text": "$REVERSED_CLIENT_ID"
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]);
        console.log(result);
        
    });
});
