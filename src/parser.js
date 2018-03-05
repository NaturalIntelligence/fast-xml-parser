"use strict";

exports.parse = require("./x2j").parse;
exports.convertTonimn = require("../src/nimndata").convert2nimn;
exports.getTraversalObj = require("./x2j").getTraversalObj;
exports.convertToJson = require("./x2j").convertToJson;
exports.validate = require("./validator").validate;
exports.j2xParser = require("./j2x");
exports.parseToNimn = function (xmlData,schema,options){
    return exports.convertTonimn(exports.getTraversalObj(xmlData,options), schema, options);
};
