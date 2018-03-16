const {getTraversalObj} = require("./x2j");
const {convertToNimn} = require("./nimn-data");
const {validate} = require("./validator");
const {Parser: j2xParser, isAttribute} = require("./j2x");
const {defaultOptions} = require("./x2j");
const {convertToJson} = require("./n2j");
const {convertToJsonString} = require("./n2j-str");

const parseToNimn = (xmlData, schema, options) => convertToNimn(getTraversalObj(xmlData, options), schema, options);

const parse = (xmlData, options) => {
    options = Object.assign({}, defaultOptions, options);
    return convertToJson(getTraversalObj(xmlData, options), options);
};

module.exports = {
    parse,
    parseToNimn,
    convertToJson,
    convertToJsonString,
    convertToNimn,
    getTraversalObj,
    validate,
    isAttribute,
    j2xParser
};
