import * as fs from "fs";
import * as path from "path";

import {XMLParser, XMLValidator} from "../src/fxp.js";
import {expect} from "chai";

describe("XMLParser", function() {

    it("should parse when Buffer is given as input", function() {
        const fileNamePath = path.resolve("./spec/assets/mini-sample.xml");
        const xmlData = fs.readFileSync(fileNamePath);

        const expected = {
            "?xml": '',
            "any_name": {
                "person": [
                    {
                        "phone": [
                            122233344550,
                            122233344551
                        ],
                        "name": "Jack",
                        "age": 33,
                        "emptyNode": "",
                        "booleanNode": [
                            false,
                            true
                        ],
                        "selfclosing": ""
                    },
                    {
                        "phone": [
                            122233344553,
                            122233344554
                        ],
                        "name": "Boris"
                    }
                ]
            }
        };

        const parser = new XMLParser();
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result,null,4));
        expect(result).to.deep.equal(expected);
    });

    it.skip("should not parse when invalid value is given", function() {
        const parser = new XMLParser();
        const result = parser.parse(23);
        // console.log(result)
        expect(result).to.be.undefined;
    });

    it.skip("should not parse when invalid value is given", function() {
        const parser = new XMLParser();
        const result = parser.parse([]);
        // console.log(result)
        expect(result).to.be.undefined();
    });

    it.skip("should not parse when invalid value is given", function() {
        const parser = new XMLParser( { preserveOrder: true});
        const result = parser.parse([]);
        expect(result).to.be.undefined();
    });

    it.skip("should not parse when null", function() {
        const parser = new XMLParser( { preserveOrder: true});
        expect(() => {
            parser.parse(null);
            // console.log(result);
        }).to.throw("Cannot read properties of null (reading 'toString')");
    });

    it.skip("should not parse when undefined", function() {
        const parser = new XMLParser( { preserveOrder: true});
        expect(() => {
            parser.parse();
            // console.log(result);
        }).to.throw("Cannot read properties of undefined (reading 'toString')");
    });
    
    
});
