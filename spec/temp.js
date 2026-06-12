"use strict";

import { format } from "path";
import { XMLParser, XMLValidator, XMLBuilder } from "../src/fxp.js";

describe("unpaired and empty tags", function () {
  it("bug test", function () {

    const xmlData = `<root attr="&#9999999;"/>`;
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: '',
      //processEntities: true, 
      htmlEntities: true
    };
    const parser = new XMLParser(options);
    // console.log(JSON.stringify(parser.parse(xml)));

    let result = parser.parse(xmlData);

    console.log(JSON.stringify(result, null, 4));
    // expect(result).toEqual(expected);

  });
  fit("bug test", function () {

    const xml = `<?xml version="1.0"?>
<!DOCTYPE foo [
  <!ENTITY lt "<script>alert(document.domain)</script>">
]>
<root>test &lt; value</root>`;

    const result = new XMLParser().parse(xml);
    console.log(result.root);
    // console.log(JSON.stringify(result, null, 4));
    // expect(result).toEqual(expected);

  });


});