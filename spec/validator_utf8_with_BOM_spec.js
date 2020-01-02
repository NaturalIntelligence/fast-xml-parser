"use strict";

const validator = require("../src/validator");

describe("XMLParser", function() {
    it("should validate xml string with cyrillic characters", function() {
        const BOM = "\ufeff";
        let xmlData = BOM + "<?xml version=\"1.0\" encoding=\"utf-8\" ?><КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>";
        let result = validator.validate(xmlData);
        expect(result).toBe(true);

    });
});
