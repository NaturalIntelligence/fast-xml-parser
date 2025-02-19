"use strict";
import {XMLParser, XMLValidator} from "../src/fxp.js";

describe("XMLParser", function() {
    it("should validate xml string with cyrillic characters", function() {
        const BOM = "\ufeff";
        let xmlData = BOM + "<?xml version=\"1.0\" encoding=\"utf-8\" ?><КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>";
        let result = XMLValidator.validate(xmlData);
        expect(result).toBe(true);

    });
});
