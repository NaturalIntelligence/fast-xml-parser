"use strict";

import { format } from "path";
import {XMLParser, XMLValidator, XMLBuilder} from "../src/fxp.js";

describe("unpaired and empty tags", function() {
    fit("bug test", function() {
        
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

        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
    xit("bug test", function() {
        
        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE dmodule [
   <!ENTITY EXTERNAL-IMAGE SYSTEM "EXTERNAL-IMAGE.cgm" NDATA cgm>
   <!NOTATION cgm SYSTEM "cgm">
   <!NOTATION tif SYSTEM "tif">
]>
<element xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
Hello!
</element>`;
        const options = {
            ignoreAttributes: false,
						attributeNamePrefix: "@",
						processEntities: false,
						stopNodes: ["dmCode"],
        };
        
        // const result = XMLValidator.validate(xmlData)
				const parser = new XMLParser(options);
        const result = parser.parse(xmlData);
        
        // console.log(result);
        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
 
    
});