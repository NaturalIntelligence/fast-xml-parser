"use strict";

const nodeToJson = require("./n2j");
const xmlToNodeobj = require("./x2j");
const x2j = require("./x2j");
const buildOptions = require("./util").buildOptions;

exports.parse = function(xmlData, options) {
    options = buildOptions(options,x2j.defaultOptions,x2j.props);
    return nodeToJson.convertToJson(xmlToNodeobj.getTraversalObj(xmlData, options), options);
};
exports.convertTonimn = require("../src/nimndata").convert2nimn;
exports.getTraversalObj = xmlToNodeobj.getTraversalObj;
exports.convertToJson = nodeToJson.convertToJson;
exports.convertToJsonString = require("./n2j_str").convertToJsonString;
exports.validate = require("./validator").validate;
exports.j2xParser = require("./j2x");
exports.parseToNimn = function (xmlData,schema,options){
    return exports.convertTonimn(exports.getTraversalObj(xmlData,options), schema, options);
};
