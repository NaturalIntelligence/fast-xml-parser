const XMLParser = require("../../src/v4/xmlparser");

/*
1. Different type of values
2. repeated attributes
    if ignoreNameSpace: true 
    n1:a , n2:a, a all are considered duplicate
3. boolean attributes
4. invalid attribute name
5. > in attribute value
6. quotes in attribute value
7. attrValueProcessor
8. comments in between
9. invalid starting/closing of attribute values
10. self closing tag
11. nospace before attribute name: a="sd"b="saf"
*/
describe("XML Parser preserveOrder:", function () {
    
    it("should preserve tags order in outpur js object when preserveOrder: true with attributes and parsed values", function() {
        const parser = new XMLParser({
            parseAttributeValue: true,
            ignoreAttributes: false,
            preserveOrder: true
        });
        const xmlData = `<store>
        locates in
        <region ab="34" >US
            <part>north</part>
        </region>and
        <region>JAPAN</region>
        <fund>456.34</fund>
    </store>`;
        const expected = [
            { "store": [
                { "__#text": "locates in" },
                { "region": [
                    { "__@ab": 34 },
                    { "__#text": "US" },
                    { "part": "north" }
                ]},
                { "__#text": "and" },
                { "region": "JAPAN" },
                { "fund": 456.34 }
            ]}
        ];

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    
    it("should preserve tags order in outpur js object when preserveOrder: true with attributes in a group ", function() {
        const parser = new XMLParser({
            ignoreAttributes: false,
            attributesGroupName: "attributes",
            preserveOrder: true
        });
        const xmlData = `<store>
        locates in
        <region ab="34" >US
            <part>north</part>
        </region>and
        <region>JAPAN</region>
        <fund>456.34</fund>
    </store>`;
        const expected = [
            { "store": [
                { "__#text": "locates in" },
                { "region": [
                    { "attributes": [
                        { "ab": "34" }
                    ] },
                    { "__#text": "US" },
                    { "part": "north" }
                ]},
                { "__#text": "and" },
                { "region": "JAPAN" },
                { "fund": 456.34 }
            ]}
        ];

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should preserve tags order in outpur js object when preserveOrder: strict", function() {
        const parser = new XMLParser({
            //parseTagValue: false,
            preserveOrder: "strict"
        });
        const xmlData = `<store>
        locates in
        <region>US
            <part>north</part>
        </region>and
        <region>JAPAN</region>
        <fund>456.34</fund>
    </store>`;
        const expected = [
            { "store": [
                { "__#text": "locates in" },
                { "region": [
                        { "__#text": "US" },
                        { "part": [
                                { "__#text": "north" }
                        ]}
                ]},
                { "__#text": "and" },
                { "region": [
                        { "__#text": "JAPAN" }
                ] },
                { "fund": [
                        { "__#text": 456.34 }
                ]}
            ]}
        ]

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

});
