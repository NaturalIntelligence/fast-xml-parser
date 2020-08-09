/*
value processor are independent from default value processor

1. tagValueProcessor
2. attrValueProcessor
3. parseTagValue
4. parseAttrValue
5. parseTrueNumberOnly
6. tag with attribute
7. tag with nested tags and text
8. parse all type of supported data types
9. Test for different combinations: - 45, NaN, 0.0. 0.34000, 23e4
10. trim
 */

const XMLParser = require("../../src/v4/xmlparser");

describe("XML Parser", function () {
    
    it("should parse all values as string, int, boolean, float, hexadecimal", function() {
        const parser = new XMLParser();
        const xmlData = `<rootNode>
        <empty></empty>
        <empty>   </empty>
        <tag>value</tag>
        <boolean>true</boolean>
        <intTag>045</intTag>
        <intTag>0</intTag>
        <intTag>-045</intTag>
        <intTag>- 045</intTag>
        <floatTag>65.34</floatTag>
        <floatTag>.34</floatTag>
        <floatTag>0.0</floatTag>
        <long>420926189200190257681175017717</long>
        <hexadecimal>0x15</hexadecimal>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "empty" : ["", ""],
                "tag":      "value",
                "boolean":  true,
                "intTag":   [ 45, 0, -45, '- 045' ],
                "floatTag": [ 65.34, 0.34, 0 ],
                "long": 4.209261892001902e+29,
                "hexadecimal" : 21
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("using tagValueProcessor to handle empty values effectively", function() {
        const parser = new XMLParser({
            trimTagValue: false,
            parseTagValue: true,
            tagValueProcessor: (name, val, attrs) => {
                if(val === ''){ //<empty></empty>
                    return "empty"
                }else if(val === undefined){ //<self />
                    return "undefined"
                }else if(Array.isArray(val)){ //tag with nested tags
                    //Return empty value if you're sure that parent tag can't have any value
                    return "";
                    //otherwise loop through array and trim all the values.
                }else if( /^[ \t]+$/.test(val)){//Don't trim series of empty spaces
                    return val;
                }else if(typeof val === "string"){
                    return val.trim();
                }else{
                    return val;
                }
            }
        });
        const xmlData = `<rootNode>
        <empty></empty>
        <empty>   </empty>
        <tag> value  </tag>
        <boolean>true </boolean>
        <intTag>045</intTag>
        <self/>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "empty" : ["empty", "   "],
                "tag":      "value",
                "boolean":  true,
               "intTag": 45,
               "self" : "empty",
               "__#text": ''
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not trim values", function() {
        const parser = new XMLParser({
            trimTagValue: false
        });
        const xmlData = `<rootNode>
        <empty></empty>
        <empty>   </empty>
        <tag> value  </tag>
        <boolean>true </boolean>
        <intTag>045</intTag>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "empty" : ["", "   "],
                "tag":      " value  ",
                "boolean":  true,
                "intTag": 45,
                "__#text": [ 
                    "\n        ",
                    "\n        ",
                    "\n        ",
                    "\n        ",
                    "\n        ",
                    "\n        "
                ]
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse only true numbers: 'parseTrueNumberOnly'", function() {
        const parser = new XMLParser({
            ignoreAttributes:    false,
            parseAttributeValue: true,
            parseTrueNumberOnly : true
        });
        //attributes are ignored by default
        const xmlData = `<rootNode>
        <tag a='67' b='045'>value</tag>
        <boolean>true</boolean>
        <intTag>045</intTag>
        <floatTag>65.340</floatTag>
        <long>420926189200190257681175017717</long>
        </rootNode>`;

        const expected = {
            "rootNode": {
                "tag": { 
                    "__@a": 67, 
                    "__@b": "045", 
                    "__#text": 'value' },
                "boolean":  true,
                "intTag":   "045",
                "floatTag": 65.34,
                "long": "420926189200190257681175017717"
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should not parse values", function() {
        const parser = new XMLParser({
            ignoreAttributes:    false,
            parseTagValue: false,
            parseAttributeValue: false,
        });
        const xmlData = `<rootNode>
            <tag a="345" >value</tag>
            <boolean>true</boolean>
            <intTag>045</intTag>
            <floatTag>65.34</floatTag>
        </rootNode>`;

        const expected = {
            "rootNode": {
                "tag":      { 
                    "__@a": "345", 
                    "__#text": 'value' },
                "boolean":  "true",
                "intTag":   "045",
                "floatTag": "65.34"
            }
        };

        const result = parser.parseString(xmlData);
        expect(result).toEqual(expected);
    });

    it("should parse with tagValueProcessor and when tagValueProcessor returns nothing then use old value", function() {
        const parser = new XMLParser({
            tagValueProcessor: (name, val, attrs) => {
                if(name === "dob"){
                    expect(attrs).toBeUndefined
                    return Date.parse(val);
                }
                //when returns nothing then use old value
            }
        });
        const xmlData = `<rootNode>
        <tag>value</tag>
        <dob format="dd mmm YYYY">14 mar 2011</dob>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "dob" : Date.parse("14 mar 2011")
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });
    
    it("should parse with attrValueProcessor and when attrValueProcessor returns nothing then use old value", function() {
        const parser = new XMLParser({
            ignoreAttributes:    false,
            parseAttributeValue: true,
            attrValueProcessor: (name, val) => {
                expect(name).toBe("format")
                expect(val).toBe("dd mmm YYYY")
            }
        });
        const xmlData = `<rootNode>
        <tag>value</tag>
        <dob format="dd mmm YYYY">14 mar 2011</dob>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "tag":      "value",
                "dob" : { 
                    "__@format": "dd mmm YYYY", //undefined values should be suppressed
                    "__#text": '14 mar 2011' }
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

    it("should parse with tagValueProcessor for tag with attributes & nested tags", function() {
        const parser = new XMLParser({
            ignoreAttributes:    false,
            tagValueProcessor: (name, val, attrs) => {
                if(name === "dob"){
                    expect(Object.keys(attrs).length).toBe(1)
                    expect(attrs["format"]).toBe("dd mmm YYYY")
                    return Date.parse(val);
                }
            }
        });
        const xmlData = `<rootNode>
        <tag>45</tag>
        <name>
            1<first>amit</first>
            2<kumar>amit</kumar>
            3<last>gupta</last>
        </name>
        <dob format="dd mmm YYYY">14 mar 2011</dob>
        </rootNode>`;
        const expected = {
            "rootNode": {
                "tag": "45",
                "name": {
                    "first": "amit",
                    "kumar": "amit",
                    "last": "gupta",
                    "__#text": [
                        "1",
                        "2",
                        "3"
                    ]
                },
                "dob" : {
                    "__@format": 'dd mmm YYYY',
                    "__#text": Date.parse("14 mar 2011")
                }
            }
        };

        const result = parser.parseString(xmlData);
        //console.log(JSON.stringify(result,null,4));
        expect(result).toEqual(expected);
    });

});