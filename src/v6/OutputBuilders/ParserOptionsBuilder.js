import booleanParser from "../valueParsers/booleanParser.js";
import currencyParser from "../valueParsers/currency.js";
import numberParser from "../valueParsers/number.js";
import trimParser from "../valueParsers/trim.js";

const defaultOptions={
  nameFor:{
    text: "#text",
    comment: "",
    cdata: "",
  },
  // onTagClose: () => {},
  // onAttribute: () => {},
  piTag: false,
  declaration: false, //"?xml"
  tags: {
    valueParsers: [
      // "trim",
      // "boolean",
      // "number",
      // "currency",
      // "date",
    ]
  },
  attributes:{
    prefix: "@_",
    suffix: "",
    groupBy: "",
    
    valueParsers: [
      // "trim",
      // "boolean",
      // "number",
      // "currency",
      // "date",
    ]
  },
  dataType:{

  }
}

//TODO
const withJoin = ["trim","join", /*"entities",*/"number","boolean","currency"/*, "date"*/]
const withoutJoin = ["trim", /*"entities",*/"number","boolean","currency"/*, "date"*/]

export function buildOptions(options = {}){
  // clone defaults
  const finalOptions = { ...defaultOptions };

  // add defaults for value parsers
  finalOptions.tags.valueParsers.push(...withJoin);
  if (!options.preserveOrder) finalOptions.tags.valueParsers.push(...withoutJoin);
  finalOptions.attributes.valueParsers.push(...withJoin);

  // merge user options
  copyProperties(finalOptions, options);
  return finalOptions;
}

function copyProperties(target, source) {
  if (!source) return;
  for (let key in source) {
    if (source.hasOwnProperty(key)) {
      if (typeof source[key] === 'object' && !Array.isArray(source[key])) {
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

export function registerCommonValueParsers(options){
  return {
    "trim": new trimParser(),
    // "join": this.entityParser.parse,
    "boolean": new booleanParser(),
    "number": new numberParser({
          hex: true,
          leadingZeros: true,
          eNotation: true
        }),
    "currency": new currencyParser(),
    // "date": this.entityParser.parse,
  }
}
