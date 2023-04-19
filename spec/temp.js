"use strict";

const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("unpaired and empty tags", function() {
    it("bug test", function() {
        const xmlData = `<root>
        <a>
            <unpaired>
        </a>
        <b>whatever</b>
    </root>`;
        const expected = {
            "root": {
                "a": {
                    "u": "",
                },
                "b":"w"
            }
        };
        const options = {
            unpairedTags: ["unpaired"]
        };
        const parser = new XMLParser(options);
        // const parser = new XMLParser({ updateTag});
        let result = parser.parse(xmlData);

        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
 
    
});