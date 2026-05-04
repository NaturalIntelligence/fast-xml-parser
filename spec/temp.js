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

    const xmlData = `<root><ns:code>safe <ns:code>nested</ns:code> still raw</ns:code></root>`;
    const options = {
      stopNodes: ["root.ns::code"],
      removeNSPrefix: true
    };

    // const result = XMLValidator.validate(xmlData)
    const parser = new XMLParser(options);
    const result = parser.parse(xmlData);

    console.log(result);
    // console.log(JSON.stringify(result, null, 4));
    // expect(result).toEqual(expected);

  });


});