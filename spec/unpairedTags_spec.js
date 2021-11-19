"use strict";

const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("unpaired and empty tags", function() {

    it("should be parsed with paired tag when suppressEmptyNode:false", function() {
        const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired>
        </rootNode>`;
        const expectedXmlData = `<rootNode>
            <tag>value</tag>
            <empty></empty>
            <unpaired></unpaired>
        </rootNode>`;

        const options = {
            // format: true,
            // preserveOrder: true,
            // suppressEmptyNode: true,
            unpairedTags: ["unpaired"]
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
        //   console.log(output);
          expect(output.replace(/\s+/g, "")).toEqual(expectedXmlData.replace(/\s+/g, ""));
    });

    it("should be parsed without paired tag when suppressEmptyNode:true", function() {
        const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired>
        </rootNode>`;

        const options = {
            // format: true,
            // preserveOrder: true,
            suppressEmptyNode: true,
            unpairedTags: ["unpaired"]
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
        //   console.log(output);
        expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
    });
    
    it("should be parsed without paired tag when suppressEmptyNode:true and tags order is preserved", function() {
        const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired>
        </rootNode>`;

        const options = {
            // format: true,
            // preserveOrder: true,
            suppressEmptyNode: true,
            unpairedTags: ["unpaired"]
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
          // console.log(output);
        expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
    });
});
