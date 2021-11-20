const {XMLParser, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = "<?xml version='1.0' standalone='no'?><!DOCTYPE svg PUBLIC \"-//W3C//DTD SVG 1.1//EN\" \"http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd\" ><svg><metadata>test</metadata></svg>";
        const expected = {
            "svg" : {
                "metadata": "test"
            }
        };

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData, true);

        expect(result).toEqual(expected);
    });

    it("should parse XML with DOCTYPE without internal DTD", function() {
        const xmlData = `<?xml version='1.0' standalone='no'?>
        <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
        <svg>
            <metadata>[test]</metadata>
        </svg>`;
        const expected = {
            "svg" : {
                "metadata": "[test]"
            }
        };

        const options = {
            allowBooleanAttributes: true,
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData, true);

        expect(result).toEqual(expected);
    });

    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><!DOCTYPE `;
        expect(() =>{
            const parser = new XMLParser();
            parser.parse(xmlData);
        }).toThrowError("DOCTYPE is not closed.")
    })
    
    it("should parse XML with DOCTYPE", function() {
        const xmlData = "<?xml version=\"1.0\" standalone=\"yes\" ?>" +
            "<!--open the DOCTYPE declaration -" +
            "  the open square bracket indicates an internal DTD-->" +
            "<!DOCTYPE foo [" +
            "<!--define the internal DTD-->" +
            "<!ELEMENT foo (#PCDATA)>" +
            "<!--close the DOCTYPE declaration-->" +
            "]>" +
            "<foo>Hello World.</foo>";

        const expected = {
            foo: "Hello World."
        };
        
        const options = {

        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse attributes having '>' in value", function() {
        const xmlData = `
        <?xml version="1.0" encoding="UTF-8"?>

        <!DOCTYPE note [
        <!ENTITY nbsp "&#xA0;">
        <!ENTITY writer "Writer: Donald Duck.">
        <!ENTITY copyright "Copyright: W3Schools.">
        ]>
        
        <note>
            <to>Tove</to>
            <from>Jani</from>
            <heading>Reminder</heading>
            <body>Don't forget me this weekend!</body>
            <footer>&writer;&nbsp;&copyright;</footer>
        </note> `;

        const expected = {
            "testStep": {
                "type": "restrequest",
                "name":       "test step name (bankId -> Error)",
                "id":     "90e453d3-30cd-4958-a3be-61ecfe7a7cbe",
                "settings": "",
                "encoding": "UTF-8"
            }
        };

        const options = {
            attributeNamePrefix: "",
            ignoreAttributes:    false,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        console.log(JSON.stringify(result,null,4));

        // expect(result).toEqual(expected);
    });
});