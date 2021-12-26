"use strict";
import {XMLParser, XMLValidator} from "../src/fxp.js";
import {expect} from "chai";

describe("XMLParser", function() {
    it("should validate xml string with cyrillic characters", function() {
        const BOM = "\ufeff";
        let xmlData = BOM + "<?xml version=\"1.0\" encoding=\"utf-8\" ?><КорневаяЗапись><Тэг>ЗначениеValue53456</Тэг></КорневаяЗапись>";
        let result = XMLValidator.validate(xmlData);
        expect(result).to.be.true;

    });
});
