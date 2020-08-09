const XMLStreamParser = require("../../src/v4/xmlparser");

describe("should parse DOCTYPE tag", function () {

    const parser = new XMLStreamParser();
    //console.log(JSON.stringify(json,null,4))
    
    xit("when internal DOCTYPE with tag and comments", function() {
        const xmlData = "<!--open the DOCTYPE declaration -" +
                        "  the open square bracket indicates an internal DTD-->" +
                        "<!DOCTYPE foo [" +
                        "<!--define the internal DTD-->" +
                        "<!ELEMENT foo (#PCDATA)>" +
                        "<!--close the DOCTYPE declaration-->" +
                        "]>" +
                        "<foo>Hello World.</foo>"+
                        "<name><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>";

        const expected = {
            foo: "Hello World."
        };

        parser.parseStream(xmlData)
        
    });

    it("when internal DOCTYPE with tag and comments", function() {
        const parser = new XMLStreamParser({
            //validation: false,
            ignoreAttributes: false,
            allowBooleanAttributes: true,
            //attributeNamePrefix: "",
            ignoreNSScoping: false,
            removeNSPrefix: true,
            trimTagValue: false
        });

        const xmlData = "<?xml version='1.2' ?><!--open the DOCTYPE declaration -" +
                        "  the open square bracket indicates an internal DTD-->" +
                        "<!DOCTYPE foo [" +
                        "<!--define the internal DTD-->" +
                        "<!ELEMENT foo (#PCDATA)>" +
                        "<!--close the DOCTYPE declaration-->" +
                        "]>" +
                        "<ab:root xmlns:ab='adf' arg='sd>f'><foo xmlns:mn='adf' >Hello World.</foo>" +
                        "<name ab:a='b'><xy:self xmlns:xy='xy' xy:some='thing' /><![CDATA[<some>Jack</some>]]><![CDATA[Jack]]></name>" + 
                        "</ab:root>";

        const expected = {
            "root": {
                "foo": "Hello World.",
                "name": {
                    "self": "",
                    "__CDATA": [
                        "<some>Jack</some>",
                        "Jack"
                    ]
                }
            }
        };

        //for(let i=0; i< 1000000; i++){
            const output = parser.parseString(xmlData);
            //expect(output).toEqual(expected);1
            //console.log(JSON.stringify(output,null, 4) );
        //}
        
    });
   
});
