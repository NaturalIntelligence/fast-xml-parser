const parseValue = require("../../src/v4/jsObjResponseBuilder/ValueParser").parseValue;

describe("Util parseValue", function () {
    
    it("should parse string", function() {
        expect(parseValue("string", null, true)).toEqual("string");
        expect(parseValue("NaN", null, true)).toEqual("NaN");
    });

    it("should parse hexadecimal", function() {
        expect(parseValue("0x15", null, true)).toEqual(21);
        expect(parseValue("0x15", true, true)).toEqual("0x15");
    });
    
    it("should parse integer", function() {
        expect(parseValue("15", null, true)).toEqual(15);
        expect(parseValue("-15", null, true)).toEqual(-15);
        expect(parseValue("- 15", null, true)).toEqual("- 15");
        expect(parseValue("0015", null, true)).toEqual(15);
        expect(parseValue("-0015", null, true)).toEqual(-15);
        expect(parseValue("12e3", null, true)).toEqual(12000);
        
        expect(parseValue("15", true, true)).toEqual(15);
        expect(parseValue("-15", true, true)).toEqual(-15);
        expect(parseValue("- 15", true, true)).toEqual("- 15");
        expect(parseValue("0015", true, true)).toEqual("0015");
        expect(parseValue("-0015", true, true)).toEqual("-0015");
        expect(parseValue("12e3", true, true)).toEqual("12e3");
        expect(parseValue("-12e-3", true, true)).toEqual("-12e-3");
    });

    it("should parse float", function() {
        expect(parseValue("1.5", null, true)).toEqual(1.5);
        expect(parseValue("1.50", null, true)).toEqual(1.5);
        expect(parseValue("-1.5", null, true)).toEqual(-1.5);
        expect(parseValue("- 1.5", null, true)).toEqual("- 1.5");
        expect(parseValue("00.15", null, true)).toEqual(0.15);
        expect(parseValue("-12e-3", null, true)).toEqual(-0.012);
        
        expect(parseValue("1.5", true, true)).toEqual(1.5);
        expect(parseValue("1.50", true, true)).toEqual(1.5);
        expect(parseValue("-1.5", true, true)).toEqual(-1.5);
        expect(parseValue("- 1.5", true, true)).toEqual("- 1.5");
        expect(parseValue("00.15", true, true)).toEqual("00.15");
        expect(parseValue("-12e-3", true, true)).toEqual("-12e-3");
        
    });

    it("should parse long value", function() {
        expect(parseValue("420926189200190257681175017717", null, true)).toEqual(4.209261892001902e29);
        expect(parseValue("42092618920019  0257681175017717", null, true)).toEqual("42092618920019  0257681175017717");
        
        expect(parseValue("420926189200190257681175017717", true, true)).toEqual("420926189200190257681175017717");
        expect(parseValue("42092618920019  0257681175017717", true, true)).toEqual("42092618920019  0257681175017717");
    });


});