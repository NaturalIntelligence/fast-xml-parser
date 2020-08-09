const XMLParser = require("../../src/v4/xmlparser");

describe("XML Pi Tag", function () {

    const parser = new XMLParser();
    //console.log(JSON.stringify(json,null,4))

    it("should parse without PI tag", function () {
        const xmlData = `<a>b</a >`;
        const result = parser.parseString(xmlData);
        expect(result).toEqual({
            a: "b"
        })
    });

    it("should parse XML pi tag with different combinations of attributes ", function () {
        const xmlData = "<?xml version='1.0' ?><a>b</a>";
        const result = parser.parseString(xmlData);
        expect(result).toEqual({
            a: "b"
        })

        "<?xml version='1.0' encoding='utf-8'?><a>b</a>"
        "<?xml version='1.0' standalone='no'?><a>b</a>"
        "<?xml version='1.0' encoding='utf-8' standalone='no' ?><a>b</a>"
    });
    it("should parse if in multiple lines", function () {
        const xmlData = `
        <?xml
        version='1.0'
         encoding='utf-8'
         standalone='no' ?>
         <a>b</a>
         `
        const result = parser.parseString(xmlData);
        expect(result).toEqual({
            a: "b"
        })
    });

    it("should not parse XML pi tag with invalid attr", function () {
        const xmlData = "<?xml ?><a>b</a>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("XML pi tag with missing mandatory attributes");

    });

    it("should not parse XML pi tag with invalid attr", function () {
        const xmlData = "<?xml version='1.0' enc='nimn' ?><a>b</a>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("XML Declaration PI tag is not well-formed");

    });

    it("should not parse XML pi tag with missing mandatory attributes", function () {
        const xmlData = "<?xml ?>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("XML pi tag with missing mandatory attributes");
    });

    it("should not parse XML pi tag without any document/element tag", function () {
        const xmlData = "<?xml version='1.0' ?>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("No element found.");
    });

    it("should not parse XML pi tag with repeated attribute", function () {
        const xmlData = "<?xml version='1.0' version='2.0' ?>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("XML Declaration PI tag is not well-formed");

    });

    it("should not parse XML pi tag with Invalid attribute sequence", function () {
        const xmlData = "<?xml version='1.0' standalone='no' encoding='utf-8'?><a>b</a>";

        expect(() => {
            parser.parseString(xmlData);
        }).toThrowError("XML Declaration PI tag is not well-formed");

    });

    //TODO: check for attribute val of XML PI tag
    /* it("XML pi tag with Invalid 'standalone' attribute value", function () {
        const s = new Readable();
        s._read = () => { };

        parser.parse(s, (error) => {
            expect(error).toEqual({ 
                code: 'XMLError', 
                msg: 'XML Declaration PI tag is not well-formed'
            });
            done();
        })
        s.emit("data","<?");
        s.emit("data","xml");
        s.emit("data"," version='1.0'");
        s.emit("data"," encoding='utf-8'");
        s.emit("data"," standalone='na'?><a>b</a>");
        ;
    }); */

});