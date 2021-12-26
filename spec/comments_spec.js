
import { XMLParser, XMLBuilder, XMLValidator} from "../src/fxp.js";
import {expect} from "chai";

describe("Comments", function() {

  it("should parse comment and build them back", function() {
    const XMLdata = `
    <!--Students grades are uploaded by months-->
    <class_list>
       <student>
         <!--Student details-->
         <!--A second comment-->
         <name>Tanmay</name>
         <grade>A</grade>
       </student>
    </class_list>`;

      const options = {
        ignoreAttributes: false,
        format: true,
        commentPropName: "#comment",
        preserveOrder: true
      };
      const parser = new XMLParser(options);
      let result = parser.parse(XMLdata);
    //   console.log(JSON.stringify(result, null,4));

      const builder = new XMLBuilder(options);
      const output = builder.build(result);
    //   console.log(output);
      expect(output.replace(/\s+/g, "")).to.deep.equal(XMLdata.replace(/\s+/g, ""));
});


});

