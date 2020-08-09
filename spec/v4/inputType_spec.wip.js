const Readable = require('stream').Readable;
const XMLStreamParser = require("../../src/new/XmlToNodeTreeParser");
const XmlParsingError = require("../../src/new/XMLParsingError");
const fs = require('fs');
const path = require('path');

/**
 * Test various ways of calling parsing method
 */
describe("should parse XML", function () {

    
    //console.log(JSON.stringify(json,null,4))

    it("from streams with callback", async function (done) {
        const parser = new XMLStreamParser();
        const s = new Readable();
        s._read = () => { };

        parser.parse(s, (error, result) => {
            expect(error).toBeNull();
            expect(result).toEqual({
                a: "b"
            })
            done();
        })
        s.emit("data","<a>b</a>");
        s.emit("end")
    });

    it("from streams with async await", async function (done) {
        const parser = new XMLStreamParser();
        const s = new Readable();
        s._read = () => { };

        setTimeout(() => {
            s.emit("data","<a>b</a>");
            s.emit("end")
            //console.log("after")
        }, 0)

        //console.log("before")
        const result = await parser.parse(s)
        //console.log("after await");
        
        expect(result).toEqual({
            a: "b"
        })

        done();
    });

    it("from file stream with async await in error case", async function () {
        const parser = new XMLStreamParser();
        const s = new Readable();
        s._read = () => { };

        setTimeout(() => {
            s.emit("data","<a>b</c>");
            s.emit("end")
            console.log("after")
        }, 0)

        let result;
        try{
            result = await parser.parse(s);
        }catch(err){
            expect(result).toBeUndefined();
            expect(err).toEqual(new XmlParsingError("XMLError", "Invalid closing tag '</c>'. Expected is '</a>'"))
        }
        
    });

    it("from file stream with async await", async function (done) {
        const parser = new XMLStreamParser({
            parseTagValue: false
        });
        const s = fs.createReadStream( path.join( __dirname, "./../assets/sample.xml") );
        const expected = {
            "any_name": {
                "person": [
                    {
                        "phone": [
                            "+122233344550",
                            "+122233344551"
                        ],
                        "name": "Jack",
                        "age": "33",
                        "emptyNode": "",
                        "booleanNode": [
                            "false",
                            "true"
                        ],
                        "selfclosing": [
                            "",
                            ""
                        ],
                        "married": "Yes",
                        "birthday": "Wed, 28 Mar 1979 12:13:14 +0300",
                        "address": [
                            {
                                "city": "New York",
                                "street": "Park Ave",
                                "buildingNo": "1",
                                "flatNo": "1"
                            },
                            {
                                "city": "Boston",
                                "street": "Centre St",
                                "buildingNo": "33",
                                "flatNo": "24"
                            }
                        ]
                    },
                    {
                        "phone": [
                            "+122233344553",
                            "+122233344554"
                        ],
                        "name": "Boris",
                        "age": "34",
                        "married": "Yes",
                        "birthday": "Mon, 31 Aug 1970 02:03:04 +0300",
                        "address": [
                            {
                                "city": "Moscow",
                                "street": "Kahovka",
                                "buildingNo": "1",
                                "flatNo": "2"
                            },
                            {
                                "city": "Tula",
                                "street": "Lenina",
                                "buildingNo": "3",
                                "flatNo": "78"
                            }
                        ]
                    }
                ]
            }
        };
        
        let result;
        try{
            result = await parser.parse(s);

            expect(result).toEqual(expected)
        }catch(err){
            console.log(err);
        }

        done();
    });

    it("from file stream with async await in error case", async function () {
        const parser = new XMLStreamParser();
        const s = fs.createReadStream( path.join( __dirname, "./../assets/notexist.xml") );

        let result;
        try{
            result = await parser.parse(s);
        }catch(err){
            expect(result).toBeUndefined();
            expect(err.code).toEqual("ENOENT")
            expect(err.message).toEqual("ENOENT: no such file or directory, open '/home/amit/git/fxp/spec/assets/notexist.xml'");
        }
        
    });


    it("from string", async function () {
        const parser = new XMLStreamParser();
        const result = parser.parseString("<a>b</a>")
        expect(result).toEqual({
            a: "b"
        })
    });

    it("from string in error case", async function () {
        const parser = new XMLStreamParser();
        let result;
        try{
            result = parser.parseString("<a>b</c>")
        }catch(err){
            expect(result).toBeUndefined();
            expect(err).toEqual(new XmlParsingError("XMLError", "Invalid closing tag '</c>'. Expected is '</a>'"))
        }
        
    });
});