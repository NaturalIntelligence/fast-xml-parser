
const defaultOptions = {
    preserveOrder: false,
    attributeNamePrefix: '@_',
    attributesGroupName: false,
    textNodeName: '#text',
    ignoreAttributes: true,
    removeNSPrefix: false, // remove NS from tag name or attribute name if true
    allowBooleanAttributes: false, //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseTagValue: true,
    parseAttributeValue: false,
    trimValues: true, //Trim string values of tag and attributes
    cdataPropName: false,
    numberParseOptions: {
      hex: true,
      leadingZeros: true
    },
    tagValueProcessor: function(tagName, val) {
      return val;
    },
    attributeValueProcessor: function(attrName, val) {
      return val;
    },
    stopNodes: [], //nested tags will not be parsed even for errors
    alwaysCreateTextNode: false,
    isArray: () => false,
    commentPropName: false,
    unpairedTags: [],
    processEntities: true
};
   
const props = [
    'preserveOrder',
    'attributeNamePrefix',
    'attributesGroupName',
    'textNodeName',
    'ignoreAttributes',
    'removeNSPrefix',
    'allowBooleanAttributes',
    'parseTagValue',
    'parseAttributeValue',
    'trimValues',
    'cdataPropName',
    'tagValueProcessor',
    'attributeValueProcessor',
    'numberParseOptions',
    'stopNodes',
    'alwaysCreateTextNode',
    'isArray',
    'commentPropName',
    'unpairedTags',
    'processEntities'
];
  
const util = require('../util');

const buildOptions = function(options) {
    return util.buildOptions(options, defaultOptions, props);
};

exports.buildOptions = buildOptions;
exports.defaultOptions = defaultOptions;
exports.props = props;