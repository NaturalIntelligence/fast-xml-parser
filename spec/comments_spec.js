
import { XMLParser } from "../src/fxp.js";

describe("Comments", function () {

  it("should parse comment and build them back", function () {
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

    const expected = [
      {
        "#comment": [
          {
            "#text": "Students grades are uploaded by months"
          }
        ]
      },
      {
        "class_list": [
          {
            "student": [
              {
                "#comment": [
                  {
                    "#text": "Student details"
                  }
                ]
              },
              {
                "#comment": [
                  {
                    "#text": "A second comment"
                  }
                ]
              },
              {
                "#comment": [
                  {
                    "#text": " A third comment "
                  }
                ]
              },
              {
                "name": [
                  {
                    "#text": "Tanmay"
                  }
                ]
              },
              {
                "#comment": [
                  {
                    "#text": ">> ISO DICTIONARY TYPES <<"
                  }
                ]
              },
              {
                "grade": [
                  {
                    "#text": "A"
                  }
                ]
              }
            ]
          }
        ]
      }
    ];
    const options = {
      ignoreAttributes: false,
      commentPropName: "#comment",
      preserveOrder: true
    };
    const parser = new XMLParser(options);
    let result = parser.parse(XMLdata);
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);
  });

});


describe("Text outside the root element", function () {

  it("should not create a text node for whitespace between the prolog and a comment or PI", function () {
    const XMLdata = `<?xml version="1.0"?>
<!-- a comment in the prolog -->
<?pi target?>
<root>
  <child>text</child>
</root>
<!-- a comment after the root -->
`;

    const options = {
      ignoreAttributes: false,
      commentPropName: "#comment",
      trimValues: false,
    };

    const parser = new XMLParser({ ...options, preserveOrder: true });
    const ordered = parser.parse(XMLdata);
    expect(ordered).toEqual([
      { "?xml": [{ "#text": "" }], ":@": { "@_version": "1.0" } },
      { "#comment": [{ "#text": " a comment in the prolog " }] },
      { "?pi": [{ "#text": "" }] },
      {
        "root": [
          { "#text": "\n  " },
          { "child": [{ "#text": "text" }] },
          { "#text": "\n" },
        ]
      },
      { "#comment": [{ "#text": " a comment after the root " }] },
    ]);

    const plainParser = new XMLParser(options);
    const plain = plainParser.parse(XMLdata);
    expect(plain).toEqual({
      "?xml": { "@_version": "1.0" },
      "#comment": [" a comment in the prolog ", " a comment after the root "],
      "?pi": "",
      "root": { "#text": "\n  \n", "child": "text" },
    });
    expect(Object.keys(plain)).not.toContain("#text");
  });
});
