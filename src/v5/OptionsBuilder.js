
const JsArrBuilder = require("./OutputBuilders/JsArrBuilder");

const defaultOptions = {
  preserveOrder: false,
  removeNSPrefix: false, // remove NS from tag name or attribute name if true
  //ignoreRootElement : false,
  stopNodes: [], //nested tags will not be parsed even for errors
  // isArray: () => false, //User will set it
  htmlEntities: false,
  // skipEmptyListItem: false
  tags:{
    unpaired: [],
    nameFor:{
      cdata: false,
      comment: false,
      text: '#text'
    },
    separateTextProperty: false,
    valueParsers: []
  },
  attributes:{
    ignore: false,
    booleanType: true,
    entities: true
  },

  // select: ["img[src]"],
  // stop: ["anim", "[ads]"]
  only: [], // rest tags will be skipped. It will result in flat array
  hierarchy: false, //will be used when a particular tag is set to be parsed.
  skip: [], // will be skipped from parse result. on('skip') will be triggered

  select: [], // on('select', tag => tag ) will be called if match
  stop: [], //given tagPath will not be parsed. innerXML will be set as string value
  OutputBuilder: new JsArrBuilder(),
};
   
const buildOptions = function(options) {
  const finalOptions = { ... defaultOptions};
  finalOptions.tags.valueParsers.push("trim");
  finalOptions.tags.valueParsers.push("entities");
  if(!this.preserveOrder)
    finalOptions.tags.valueParsers.push("join");
  finalOptions.tags.valueParsers.push("boolean");
  finalOptions.tags.valueParsers.push("number");
  finalOptions.tags.valueParsers.push("currency");
  finalOptions.tags.valueParsers.push("date");
  copyProperties(finalOptions,options)
  return  finalOptions;
};

function copyProperties(target, source) {
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (key === 'OutputBuilder') {
        target[key] = source[key];
      }else if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
        // Recursively copy nested properties
        if (typeof target[key] === 'undefined') {
          target[key] = {};
        }
        copyProperties(target[key], source[key]);
      } else {
        // Copy non-nested properties
        target[key] = source[key];
      }
    }
  }
}

exports.buildOptions = buildOptions;
exports.defaultOptions = defaultOptions;