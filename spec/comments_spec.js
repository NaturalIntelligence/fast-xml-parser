
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

