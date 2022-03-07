'use strict';

const validator = require('./validator');
const XMLParser = require('./xmlparser/XMLParser');
const XMLBuilder = require('./xmlbuilder/json2xml');
const {format} = require('./formatter');

module.exports = {
  XMLParser: XMLParser,
  XMLValidator: validator,
  XMLBuilder: XMLBuilder,
  format,
};
