
import {XMLParser, XMLBuilder, XMLValidator} from "../src/fxp.js";
import {expect} from "chai";

describe("XMLParser", function() {

    it("should error for when any tag is left to close", function(){
        const xmlData = `<?xml version="1.0"?><?pi  `;
        expect(() =>{
            const parser = new XMLParser();
            parser.parse(xmlData);
        }).to.throw("Pi Tag is not closed.")
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
          expect(output.replace(/\s+/g, "")).to.deep.equal(xmlData.replace(/\s+/g, ""));
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
          expect(output.replace(/\s+/g, "")).to.deep.equal(xmlData.replace(/\s+/g, ""));
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
          expect(output.replace(/\s+/g, "")).to.deep.equal(xmlData.replace(/\s+/g, ""));
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
        //   console.log(output);
          expect(output.replace(/\s+/g, "")).to.deep.equal(xmlData.replace(/\s+/g, ""));
    });
});