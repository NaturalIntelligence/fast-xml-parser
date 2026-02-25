"use strict";

import { XMLParser } from "../src/fxp.js";

describe("unpaired and empty tags", function () {

  it("should be parsed with paired tag when suppressEmptyNode:false", function () {
    const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired attr="1">
        </rootNode>`;

    const jsObj = {
      "rootNode": {
        "tag": "value",
        "empty": "",
        "unpaired": {
          "@_attr": "1"
        }
      }
    }
    const options = {
      // format: true,
      // preserveOrder: true,
      ignoreAttributes: false,
      unpairedTags: ["unpaired"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should be parsed without paired tag when suppressEmptyNode:true", function () {
    const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired attr="1">
        </rootNode>`;
    const jsObj = {
      "rootNode": {
        "tag": "value",
        "empty": "",
        "unpaired": {
          "@_attr": "1"
        }
      }
    }
    const options = {
      // format: true,
      // preserveOrder: true,
      suppressEmptyNode: true,
      ignoreAttributes: false,
      unpairedTags: ["unpaired"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should be parsed without paired tag when suppressEmptyNode:true and tags order is preserved", function () {
    const xmlData = `<rootNode>
            <tag>value</tag>
            <empty />
            <unpaired attr="1">
        </rootNode>`;
    const jsObj = {
      "rootNode": {
        "tag": "value",
        "empty": "",
        "unpaired": {
          "@_attr": "1"
        }
      }
    }
    const options = {
      // format: true,
      // preserveOrder: true,
      suppressEmptyNode: true,
      ignoreAttributes: false,
      unpairedTags: ["unpaired"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should be parsed when unpaired tag is self-closing or paired closing tag", function () {
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
    const jsObj = [
      {
        "rootNode": [
          {
            "unpaired": [],
            ":@": {
              "@_attr": "1"
            }
          },
          {
            "self": []
          },
          {
            "unpaired": []
          },
          {
            "unpaired": []
          },
          {
            "unpaired": []
          },
          {
            "unpaired": []
          },
          {
            "unpaired": []
          }
        ]
      }
    ]
    const options = {
      // format: true,
      preserveOrder: true,
      suppressEmptyNode: true,
      ignoreAttributes: false,
      unpairedTags: ["unpaired"]
    };
    const parser = new XMLParser(options);
    let result = parser.parse(xmlData);
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should parsed unpaired tag before stop nodes", function () {
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

    const jsObj = [
      {
        "rootNode": [
          {
            "unpaired": [],
            ":@": {
              "@_attr": "1"
            }
          },
          {
            "stop": [
              {
                "#text": "here"
              }
            ]
          },
          {
            "unpaired": []
          }
        ]
      }
    ]
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
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should suppress paired tag but not unpaired tag when suppressUnpairedNode:false", function () {
    const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;

    const jsObj = {
      "rootNode": {
        "tag": "value",
        "empty": "",
        "unpaired": [
          {
            "@_attr": "1"
          },
          ""
        ]
      }
    }
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
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should not suppress paired tag but unpaired tag when suppressUnpairedNode:true", function () {
    const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;
    const jsObj = {
      "rootNode": {
        "tag": "value",
        "empty": "",
        "unpaired": [
          {
            "@_attr": "1"
          },
          ""
        ]
      }
    }
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
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should suppress paired tag but not unpaired tag when suppressUnpairedNode:false (ordered)", function () {
    const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;

    const jsObj = [
      {
        "rootNode": [
          {
            "tag": [
              {
                "#text": "value"
              }
            ]
          },
          {
            "empty": []
          },
          {
            "unpaired": [],
            ":@": {
              "@_attr": "1"
            }
          },
          {
            "unpaired": []
          }
        ]
      }
    ]
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
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });

  it("should not suppress paired tag but unpaired tag when suppressUnpairedNode:true  (ordered)", function () {
    const xmlData = `<rootNode>
          <tag>value</tag>
          <empty />
          <unpaired attr="1">
          <unpaired>
      </rootNode>`;

    const jsObj = [
      {
        "rootNode": [
          {
            "tag": [
              {
                "#text": "value"
              }
            ]
          },
          {
            "empty": []
          },
          {
            "unpaired": [],
            ":@": {
              "@_attr": "1"
            }
          },
          {
            "unpaired": []
          }
        ]
      }
    ]
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
    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(jsObj);


  });
  it("should construct jpath correctly for tag after unpaired tag", function () {
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
    let jPathIndex = 0;
    const options = {
      // format: true,
      // preserveOrder: true,
      ignoreAttributes: false,
      stopNodes: ["stop"],
      unpairedTags: ["unpaired", "unpaired2"],
      updateTag: function (tagName, jpath) {
        // console.log(jpath);
        expect(jpath).toEqual(jpaths[jPathIndex++]);
        return tagName;
      }
    };
    const parser = new XMLParser(options);
    parser.parse(xmlData);
    //   console.log(JSON.stringify(result, null,4));

  });
});

describe("unpaired tas position", function () {
  it(" when appears last in nested tag", function () {
    const xmlData = `<root><a><u></a><b>w</b></root>`;
    const expected = {
      "root": {
        "a": {
          "u": "",
        },
        "b": "w"
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
  it(" when unpair then unpair self closed", function () {
    const xmlData = `<root><v><v/><u></root>`;
    const expected = {
      "root": {
        "v": ["", ""],
        "u": ""
      }
    }
    const options = {
      unpairedTags: ["u", "v"]
    };
    const parser = new XMLParser(options);
    // const parser = new XMLParser({ updateTag});
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

  });
  it("when unpair then unpair", function () {
    const xmlData = `<root><v><v></root>`;
    const expected = {
      "root": {
        "v": ["", ""]
      }
    }
    const options = {
      unpairedTags: ["u", "v"]
    };
    const parser = new XMLParser(options);
    // const parser = new XMLParser({ updateTag});
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

  });
  it(" when 2 unpaired then unpaired self closed", function () {
    const xmlData = `<root><v><v><v/></root>`;
    const expected = {
      "root": {
        "v": ["", "", ""]
      }
    }
    const options = {
      unpairedTags: ["u", "v"]
    };
    const parser = new XMLParser(options);
    // const parser = new XMLParser({ updateTag});
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

  });
  it(" when unpaired followed by normal self closed", function () {
    const xmlData = `<root><v><a/></root>`;
    const expected = {
      "root": {
        "v": "",
        "a": ""
      }
    }
    const options = {
      unpairedTags: ["u", "v"]
    };
    const parser = new XMLParser(options);
    // const parser = new XMLParser({ updateTag});
    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);

  });
  it(" when unpaired is used as closing tag then it's error", function () {
    const xmlData = `<root><v><a/></v></root>`;
    const options = {
      unpairedTags: ["u", "v"]
    };
    const parser = new XMLParser(options);

    expect(() => {
      parser.parse(xmlData);
    }).toThrowError("Unpaired tag can not be used as closing tag: </v>")

  });

  it("XMLParser should not move tag data into the unpairedTag node #785", function () {

    const xmlData = `<p>hello<br>world</p>`;
    const options = {
      ignoreAttributes: false,
      unpairedTags: ["hr", "br", "link", "meta"],
    };
    const expected = {
      "p": {
          "br": "",
          "#text": "helloworld"
      }
  }
    const parser = new XMLParser(options);
    // console.log(JSON.stringify(parser.parse(xml)));

    let result = parser.parse(xmlData);

    // console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);

  });

});
