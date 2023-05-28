"use strict";

const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("unpaired and empty tags", function() {

    it("should be parsed with paired tag when suppressEmptyNode:false", function() {
        const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired attr="1">
        </rootNode>`;
        const expectedXmlData = `<rootNode>
            <tag>value</tag>
            <empty></empty>
            <unpaired attr="1">
        </rootNode>`;

        const options = {
            // format: true,
            // preserveOrder: true,
            ignoreAttributes: false,
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
            <unpaired attr="1">
        </rootNode>`;

        const options = {
            // format: true,
            // preserveOrder: true,
            suppressEmptyNode: true,
            ignoreAttributes: false,
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
            <unpaired attr="1">
        </rootNode>`;

        const options = {
            // format: true,
            // preserveOrder: true,
            suppressEmptyNode: true,
            ignoreAttributes: false,
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
    
    it("should be parsed when unpaired tag is self-closing or paired closing tag", function() {
        const xmlData = `<rootNode>
            <unpaired attr="1">
            <self />
            <unpaired>
            <unpaired />
            <unpaired>
            <unpaired />
            <unpaired>
        </rootNode>`;

        const expectedXml = `<rootNode>
        <unpaired attr="1">
        <self/>
        <unpaired>
        <unpaired>
        <unpaired>
        <unpaired>
        <unpaired>
      </rootNode>`;
        const options = {
            // format: true,
            preserveOrder: true,
            suppressEmptyNode: true,
            ignoreAttributes: false,
            unpairedTags: ["unpaired"]
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
          // console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
          // console.log(output);
        expect(output.replace(/\s+/g, "")).toEqual(expectedXml.replace(/\s+/g, ""));
    });

    it("should parsed unpaired tag before stop nodes", function() {
        const xmlData = `<rootNode>
            <unpaired attr="1">
            <stop>here</stop>
            <unpaired>
        </rootNode>`;

        const expectedXml = `<rootNode>
        <unpaired attr="1">
        <stop>here</stop>
        <unpaired>
      </rootNode>`;
        const options = {
            // format: true,
            preserveOrder: true,
            suppressEmptyNode: true,
            ignoreAttributes: false,
            unpairedTags: ["unpaired"],
            stopNodes: ["*.stop"]
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
          // console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
          // console.log(output);
        expect(output.replace(/\s+/g, "")).toEqual(expectedXml.replace(/\s+/g, ""));
    });

    it("should suppress paired tag but not unpaired tag when suppressUnpairedNode:false", function() {
      const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;
      const expectedXmlData = `<rootNode>
          <tag>value</tag>
          <empty/>
          <unpaired attr="1"/>
          <unpaired/>
      </rootNode>`;

      const options = {
          // format: true,
          // preserveOrder: true,
          suppressEmptyNode: true,
          suppressUnpairedNode: false,
          ignoreAttributes: false,
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
    
  it("should not suppress paired tag but unpaired tag when suppressUnpairedNode:true", function() {
      const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;
      const expectedXmlData = `<rootNode>
          <tag>value</tag>
          <empty></empty>
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;

      const options = {
          // format: true,
          // preserveOrder: true,
          // suppressEmptyNode: true,
          suppressUnpairedNode: true,
          ignoreAttributes: false,
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

  it("should suppress paired tag but not unpaired tag when suppressUnpairedNode:false (ordered)", function() {
      const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;
      const expectedXmlData = `<rootNode>
          <tag>value</tag>
          <empty/>
          <unpaired attr="1"/>
          <unpaired/>
      </rootNode>`;

      const options = {
          // format: true,
          preserveOrder: true,
          suppressEmptyNode: true,
          suppressUnpairedNode: false,
          ignoreAttributes: false,
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
    
  it("should not suppress paired tag but unpaired tag when suppressUnpairedNode:true  (ordered)", function() {
      const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;
      const expectedXmlData = `<rootNode>
          <tag>value</tag>
          <empty></empty>
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;

      const options = {
          // format: true,
          preserveOrder: true,
          // suppressEmptyNode: true,
          suppressUnpairedNode: true,
          ignoreAttributes: false,
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
  it("should construct jpath correctly for tag after unpaired tag", function() {
    const xmlData = `<rootNode>
      <unpaired>
      <nested>
        <unpaired>
        <empty />
        <unpaired>
      </nested>
      <empty />
      <stop />
      <unpaired>
    </rootNode>`;

    const jpaths = [
      "rootNode",
      "rootNode.unpaired",
      "rootNode.nested",
      "rootNode.nested.unpaired",
      "rootNode.nested.empty",
      "rootNode.nested.unpaired",
      "rootNode.empty",
      "rootNode.stop",
      "rootNode.unpaired",
    ]
    let jPathIndex=0;
    const options = {
        // format: true,
        // preserveOrder: true,
        ignoreAttributes: false,
        stopNodes: ["stop"],
        unpairedTags: ["unpaired", "unpaired2"],
        updateTag: function(tagName,jpath){
          // console.log(jpath);
          expect(jpath).toEqual(jpaths[jPathIndex++]);
          return tagName;
        }
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);
    //   console.log(JSON.stringify(result, null,4));

  });
});

describe("unpaired tas position", function() {
  it(" when appears last in nested tag", function() {
      const xmlData = `<root><a><u></a><b>w</b></root>`;
      const expected = {
          "root": {
              "a": {
                  "u": "",
              },
              "b":"w"
          }
      };
      const options = {
          unpairedTags: ["u"]
      };
      const parser = new XMLParser(options);
      // const parser = new XMLParser({ updateTag});
      let result = parser.parse(xmlData);

      // console.log(JSON.stringify(result,null,4));
      expect(result).toEqual(expected);

  });
  it(" when unpair then unpair self closed", function() {
      const xmlData = `<root><v><v/><u></root>`;
      const expected = {
          "root": {
              "v": ["",""],
              "u": ""
          }
      }
      const options = {
          unpairedTags: ["u","v"]
      };
      const parser = new XMLParser(options);
      // const parser = new XMLParser({ updateTag});
      let result = parser.parse(xmlData);

      // console.log(JSON.stringify(result,null,4));
      expect(result).toEqual(expected);

  });
  it("when unpair then unpair", function() {
      const xmlData = `<root><v><v></root>`;
      const expected = {
          "root": {
              "v": ["",""]
          }
      }
      const options = {
          unpairedTags: ["u","v"]
      };
      const parser = new XMLParser(options);
      // const parser = new XMLParser({ updateTag});
      let result = parser.parse(xmlData);

      // console.log(JSON.stringify(result,null,4));
      expect(result).toEqual(expected);

  });
  it(" when 2 unpaired then unpaired self closed", function() {
      const xmlData = `<root><v><v><v/></root>`;
      const expected = {
          "root": {
              "v": ["","",""]
          }
      }
      const options = {
          unpairedTags: ["u","v"]
      };
      const parser = new XMLParser(options);
      // const parser = new XMLParser({ updateTag});
      let result = parser.parse(xmlData);

      // console.log(JSON.stringify(result,null,4));
      expect(result).toEqual(expected);

  });
  it(" when unpaired followed by normal self closed", function() {
      const xmlData = `<root><v><a/></root>`;
      const expected = {
          "root": {
              "v": "",
              "a": ""
          }
      }
      const options = {
          unpairedTags: ["u","v"]
      };
      const parser = new XMLParser(options);
      // const parser = new XMLParser({ updateTag});
      let result = parser.parse(xmlData);

      // console.log(JSON.stringify(result,null,4));
      expect(result).toEqual(expected);

  });
  it(" when unpaired is used as closing tag then it's error", function() {
      const xmlData = `<root><v><a/></v></root>`;
      const options = {
          unpairedTags: ["u","v"]
      };
      const parser = new XMLParser(options);

      expect(() =>{
          parser.parse(xmlData);
      }).toThrowError("Unpaired tag can not be used as closing tag: </v>")

  });
  
});
