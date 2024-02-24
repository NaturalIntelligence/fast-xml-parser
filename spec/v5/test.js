const XMLParser = require("../../src/v5/XMLParser");
const JsObjOutputBuilder = require("../../src/v5/OutputBuilders/JsObjBuilder");
const JsArrBuilder = require("../../src/v5/OutputBuilders/JsArrBuilder");
const JsMinArrBuilder = require("../../src/v5/OutputBuilders/JsMinArrBuilder");

const fs = require("fs");
const path = require("path");
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
          OutputBuilder: new JsMinArrBuilder()
      };
      const parser = new XMLParser(options);
      let result = parser.parse(xmlData);

      console.log(JSON.stringify(result,null,4));
    //   expect(result).toEqual(expected);
  });
});