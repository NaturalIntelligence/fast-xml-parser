"use strict";

const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("unpaired and empty tags", function() {
    fit("bug test", function() {
        const xmlData = `<root>
        <a>1</a>
        <a></a>
        <a>2</a>
        <a></a>
        <a>3</a>
        <a></a>
    </root>`;
        const expected = {
            "root": {
                "a": [ 1,2,3]
            }
        };
        const options = {
            skipEmptyListItem: true
        };
        const parser = new XMLParser(options);
        // const parser = new XMLParser({ updateTag});
        let result = parser.parse(xmlData);

        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
    
});