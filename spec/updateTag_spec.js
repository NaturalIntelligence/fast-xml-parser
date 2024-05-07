"use strict";

const {XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");
const he = require("he");

describe("XMLParser updateTag ", function() {
    it("should delete, join, update attribute name and value", function() {
        const xmlData = `<root>
            <a keep="me" skip="me"></a>
            <a skip="me"></a>
            <a need="friend"></a>
            <a camel="case" MakeMe="lower"></a>
            <b change="val"></b>
        </root>`;
        const expected = {
            "root": {
                "a": [
                    {
                        "keep": "me"
                    },
                    "",
                    {
                        "need": "friend",
                        "friend": "me"
                    },
                    {
                        "Camel": "case",
                        "makeme": "lower"
                    }
                ],
                "b": {
                    "change": "VAL"
                }
            }
        };
        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            updateTag(tagName, jPath, attrs){
                if(attrs["skip"]) delete attrs["skip"]
                if(attrs["camel"]) {
                    attrs["Camel"] = attrs["camel"];
                    delete attrs["camel"];
                }
                if(attrs["need"]) {
                    attrs["friend"] = "me";
                }
                if(attrs["MakeMe"]) {
                    attrs["makeme"] = attrs["MakeMe"];
                    delete attrs["MakeMe"];
                }
                if(attrs["change"]) {
                    attrs["change"] = attrs["change"].toUpperCase();
                }
                return tagName;
            }
        };

        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });
    it("should delete all the attributes", function() {
        const xmlData = `<root>
            <a keep="me" skip="me"></a>
            <a skip="me"></a>
            <a need="friend"></a>
            <a camel="case" MakeMe="lower"></a>
            <b change="val"></b>
        </root>`;
        const expected = {
            "root": {
                "a": [
                    "",
                    "",
                    "",
                    ""
                ],
                "b": ""
            }
        };
        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
            parseAttributeValue: true,
            updateTag(tagName, jPath, attrs){
                for (var k in attrs){
                    if (attrs.hasOwnProperty(k)){
                        delete attrs[k];
                    }
                }
                return tagName;
            }
        };

        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

        result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);
    });
    it("should skip a tag or modify tag name", function() {
        const xmlData = `<html>
        <header></header>
        <body>
            <h1 class="highlight" >Post title</h1>
            <content>
                <img width="200" height="500">
                <p>some text</p>
                <img width="200" height="200">
                <p join="a" all="b" in="c" one="d" >some text 2</p>
                <img width="500" height="500">
            </content>
            <script></script>
            <lorem/>
            <ipsum/>
        </body>
    </html>`;
        const expected = {
            "html": {
                "header": "",
                "body": {
                    "h1": {
                        "#text": "Post title",
                        "class": "highlight underline"
                    },
                    "div": {
                        "p": [
                            "some text",
                            {
                                "#text": "some text 2",
                                "joint": "abcd"
                            }
                        ],
                        "img": {
                            "width": "200",
                            "height": "200"
                        }
                    }
                }
            }
        };
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: "",
            updateTag: function(tagname, jPath, attrs){
                
                if(tagname ==="h1" && attrs["class"] && attrs["class"].indexOf("highlight") > -1){
                    attrs["class"] += " underline"
                }else if(attrs["join"]){
                    let val = "";
                    Object.keys(attrs).forEach( a => {
                        val+= attrs[a]
                        delete attrs[a];
                    });
                    attrs["joint"] = val;
                }
                if(tagname === "script") return false;
                else if(tagname === "img"){
                    if(attrs.width > 200 || attrs.height > 200) return false;
                }else if(tagname === "content"){
                    return "div"
                }else if(tagname === "lorem") {
                    return false;
                }else if(jPath === "html.body.ipsum") {
                    return false;
                }
                return tagname;
            },
            unpairedTags: ["img"]
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);

        // console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);

    });
});
