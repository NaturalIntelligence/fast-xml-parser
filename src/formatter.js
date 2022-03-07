'use strict';

const XMLParser = require('./xmlparser/XMLParser');
const XMLBuilder = require('./xmlbuilder/json2xml');

exports.format = function(xmlString) {
  const options = {
    alwaysCreateTextNode: true,
    cdataPropName: '#cdata',
    commentPropName: '#comment',
    ignoreAttributes: false,
    preserveOrder: true,
    processEntities: false,
    trimValues: false,
    suppressEmptyNode: true,
    format: true,
  };

  const parser = new XMLParser(options);
  const data = parser.parse(xmlString);

  const builder = new XMLBuilder(options);
  const result = builder.build(data);

  return result;
};
