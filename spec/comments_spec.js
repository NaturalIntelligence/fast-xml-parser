
const { XMLParser, XMLBuilder, XMLValidator} = require("../src/fxp");

describe("Comments", function() {

  it("should parse comment and build them back", function() {
    const XMLdata = `
    <!--Students grades are uploaded by months-->
    <class_list>
       <student>
         <!--Student details-->
         <!--A second comment-->
         <!-- A third comment -->
         <name>Tanmay</name>
         <!-->> ISO DICTIONARY TYPES <<-->
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
      // console.log(JSON.stringify(result, null,4));

      const builder = new XMLBuilder(options);
      const output = builder.build(result);
    //   console.log(output);
      expect(output.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
});
  
it("should build XML with Comments without parseOrder", function() {
  const input = {
      "any_name": {
          "person": {
              "phone": [
                  122233344550,
                  122233344551,
                  ""
              ],
              "name":  [
                  `<some>Jack</some>Jack`,
                  `<some>Mohan</some>`
              ],
              "blank": "",
              "another": {
                "phone":  "1245789",
              }
          }
      }
  };
  const expected = `
  <any_name>
    <person>
      <!--122233344550-->
      <!--122233344551-->
      <!---->
      <name><some>Jack</some>Jack</name>
      <name><some>Mohan</some></name>
      <blank></blank>
      <another>
        <!--1245789-->
      </another>
    </person>
  </any_name>`;
  
  const options = {
      processEntities:false,
      format: true,
      ignoreAttributes: false,
      commentPropName: "phone"
  };

  const builder = new XMLBuilder(options);
  const xmlOutput = builder.build(input);
  // console.log(xmlOutput);
  expect(xmlOutput.replace(/\s+/g, "")).toEqual(expected.replace(/\s+/g, ""));
});

it("should neutralize comment delimiters when building so a value cannot break out (GHSA-gh4j-gqv2-49f6)", function() {
  const payload = "a--><script>alert(1)</script><!--b";
  const stripComments = (s) => s.replace(/<!--[\s\S]*?-->/g, "");

  const out1 = new XMLBuilder({ commentPropName: "#comment", format: false })
    .build({ note: { "#comment": payload } });
  expect(XMLValidator.validate("<r>" + out1 + "</r>")).toBe(true);
  expect(stripComments(out1)).not.toContain("<script>");

  const out2 = new XMLBuilder({ preserveOrder: true, commentPropName: "#comment", format: false })
    .build([{ "#comment": [{ "#text": payload }] }]);
  expect(XMLValidator.validate("<r>" + out2 + "</r>")).toBe(true);
  expect(stripComments(out2)).not.toContain("<script>");
});

});

