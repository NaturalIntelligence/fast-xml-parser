
const {XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");

describe("XMLParser", function() {

    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><?pi  `;
        expect(() =>{
            const parser = new XMLParser();
            parser.parse(xmlData);
        }).toThrowError("Pi Tag is not closed.")
    });

    it("should process PI tag without attributes", function(){
        const xmlData = `
        <?xml version="1.0"?>
        <?mso-contentType?>
        <h1></h1>
        `;
        const options = {
            ignoreAttributes: false,
            format: true,
            preserveOrder: true,
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
        //   console.log(output);
          expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
    });

    it("should process PI tag with attributes", function(){
        const xmlData = `
        <?xml version="1.0"?>
        <?xml-stylesheet href="mystyle.xslt" type="text/xsl"?>
        <?TeamAlpha member="Jesper" date="2008-04-15" comment="I strongly feel that the attributes in the product element below are really not needed and should be dropped." ?> 
        <h1></h1>
        `;
        const options = {
            ignoreAttributes: false,
            format: true,
            preserveOrder: true,
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
        //   console.log(output);
          expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
    });
    
    it("should process PI tag with boolean attributes", function(){
        const xmlData = `
        <?xml version="1.0"?>
        <?textinfo whitespace is allowed ?>
        
        <h1></h1>
        `;
        const options = {
            ignoreAttributes: false,
            format: true,
            preserveOrder: true,
            allowBooleanAttributes: true
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
          // console.log(output);
          expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
    });
    
    it("should process PI tag with tag attributes", function(){
        const xmlData = `<?xml version="1.0"?>
        <?elementnames <fred>, <bert>, <harry> ?>
        <h1></h1>
        `;
        const options = {
            ignoreAttributes: false,
            format: true,
            preserveOrder: true,
            allowBooleanAttributes: true
          };
          const parser = new XMLParser(options);
          let result = parser.parse(xmlData, true);
        //   console.log(JSON.stringify(result, null,4));
    
          const builder = new XMLBuilder(options);
          const output = builder.build(result);
          // console.log(output);
          expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
    });

    it("should process PI tag with tag attributes when order is not preserved", function(){
        const xmlData = `<?xml version="1.0"?>
        <?elementnames <fred>, <bert>, <harry> ?>
        <h1></h1>
        `;

          const builderOptions = {
            allowBooleanAttributes: true,
            attributeNamePrefix: '',
            attributesGroupName: 'attr',
            textNodeName: 'text',
            ignoreAttributes: false,
            format: true,
            // suppressEmptyNode: true,
            suppressBooleanAttributes: true
          };
        
          const parseOptions = {
            attributeNamePrefix: '',
            attributesGroupName: 'attr',
            textNodeName: 'text',
            ignoreAttributes: false,
            removeNSPrefix: false,
            allowBooleanAttributes: true,
            parseTagValue: true,
            parseAttributeValue: false,
            trimValues: true,
            parseTrueNumberOnly: false,
            arrayMode: false,
            alwaysCreateTextNode: true,
            numberParseOptions: {
              hex: true,
              leadingZeros: false
            }
          }
        
          const result = new XMLParser(parseOptions).parse(xmlData)
          const builder = new XMLBuilder(builderOptions);
          const output = builder.build(result);
          expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
          // console.log(output);
    });

    it("should strip xml declaration tag", function(){
      const xmlData = `<?xml version="1.0"?>
      <?elementnames <fred>, <bert>, <harry> ?>
      <h1></h1>
      `;

        const options = {
          allowBooleanAttributes: true,
          ignoreDeclaration: true,
        };
      
        const expected = {
          "?elementnames": "",
          "h1": ""
        }
        const result = new XMLParser(options).parse(xmlData);
        // console.log(JSON.stringify(result, null,4));
        expect(expected).toEqual(result);
    });

    it("should strip xml declarion tag", function(){
      const xmlData = `<?xml version="1.0"?>
      <?elementnames <fred>, <bert>, <harry> ?>
      <h1></h1>
      `;

        const options = {
          allowBooleanAttributes: true,
          ignoreDeclaration: true,
          ignorePiTags: true,
        };
      
        const expected = {
          "h1": ""
        }
        const result = new XMLParser(options).parse(xmlData);
        // console.log(JSON.stringify(result, null,4));
        expect(expected).toEqual(result);
    });

    it("should not add any empty line in the start", function(){
      const xmlData = `
      <?xml version="1.0"?>
      <?mso-contentType?>
      <h1></h1>
      `;
      const options = {
          ignoreAttributes: false,
          format: true,
          preserveOrder: true,
        };
        const parser = new XMLParser(options);
        let result = parser.parse(xmlData);
        // console.log(JSON.stringify(result, null,4));
  
        const builder = new XMLBuilder(options);
        const output = builder.build(result);
        // console.log("something", output);
        expect(output.replace(/\s+/g, "")).toEqual(xmlData.replace(/\s+/g, ""));
  });
});