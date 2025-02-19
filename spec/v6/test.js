import XMLParser from "../../src/v6/XMLParser";
import JsObjOutputBuilder from "../../src/v6/OutputBuilders/JsObjBuilder";
import JsArrBuilder from "../../src/v6/OutputBuilders/JsArrBuilder";
import JsMinArrBuilder from "../../src/v6/OutputBuilders/JsMinArrBuilder";
import numberParser from "../../src/v6/valueParsers/number";

import fs from "fs";
import path from "path";
const fileNamePath = path.join(__dirname, "../assets/ptest.xml");//with CDATA
// const fileNamePath = path.join(__dirname, "../assets/ptest_with_prolog.xml");//with CDATA
// const fileNamePath = path.join(__dirname, "../assets/sample.xml");//1.5k
// const fileNamePath = path.join(__dirname, "../assets/midsize.xml");//13m
// const fileNamePath = path.join(__dirname, "../assets/large.xml");//98m
const xmlData = fs.readFileSync(fileNamePath).toString();

describe("XMLParser Entities", function() {

  it("should parse", function() {
      
      const options = {
          attributes: {
              ignore: false,
              booleanType:true
          },
          
          OutputBuilder: new JsObjOutputBuilder({
            onAttribute: (name, value, tagName) => {
              console.log(name, value, tagName)
            }
          })
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

      console.log(JSON.stringify(result,null,4));
    //   expect(result).toEqual(expected);
  });
  it("value parsers", function() {
      const xmlData = `<root>
        <int>   1234    </int>
        <str>4567</str>
        <int>str 6789</int>
        <bool>true  </bool>
      </root>`
      const parser = new XMLParser();
      let result = parser.parse(xmlData);

      console.log(JSON.stringify(result,null,4));
    //   expect(result).toEqual(expected);
  });
  it("value parsers", function() {
      const xmlData = `<root>
        <int>   1234    </int>
        <str>4567</str>
        <int>str 6789</int>
        <bool>true  </bool>
      </root>`
      const options = {
          OutputBuilder: new JsObjOutputBuilder({
            tags: {
              valueParsers: ["number"]
            }
          })
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

      console.log(JSON.stringify(result,null,4));
    //   expect(result).toEqual(expected);
  });
  fit("value parsers", function() {
      const xmlData = `<root>
        <int>   1234    </int>
        <str>4567</str>
        <int>str 6789</int>
        <bool>true  </bool>
      </root>`
      const options = {
          OutputBuilder: new JsObjOutputBuilder({
            tags: {
              valueParsers: [
                "trim",
                "boolean",
                new numberParser({
                  hex: true,
                  leadingZeros: true,
                  eNotation: true
                }),
                "currency"
              ]
            }
          })
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

      console.log(JSON.stringify(result,null,4));
    //   expect(result).toEqual(expected);
  });
});