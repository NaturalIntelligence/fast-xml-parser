module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// object to store loaded and loading wasm modules
/******/ 	var installedWasmModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// object with all compiled WebAssembly.Modules
/******/ 	__webpack_require__.w = {};
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/parser.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/j2x.js":
/*!********************!*\
  !*** ./src/j2x.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var _require = __webpack_require__(/*! ./util */ "./src/util.js"),
    isExist = _require.isExist;

var defaultOptions = {
  attributeNamePrefix: "@_",
  attrNodeName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  cdataTagName: false,
  cdataPositionChar: "\\c",
  format: false,
  indentBy: "  ",
  supressEmptyNode: false,
  tagValueProcessor: function tagValueProcessor(a) {
    return a;
  },
  attrValueProcessor: function attrValueProcessor(a) {
    return a;
  }
};

var Parser =
/*#__PURE__*/
function () {
  function Parser(options) {
    _classCallCheck(this, Parser);

    this.options = Object.assign({}, defaultOptions, options);

    if (this.options.ignoreAttributes || this.options.attrNodeName) {
      this.isAttribute = function ()
      /*a*/
      {
        return false;
      };
    } else {
      this.attrPrefixLen = this.options.attributeNamePrefix.length;
      this.isAttribute = isAttribute;
    }

    if (this.options.cdataTagName) {
      this.isCDATA = isCDATA;
    } else {
      this.isCDATA = function ()
      /*a*/
      {
        return false;
      };
    }

    this.replaceCDATAstr = replaceCDATAstr;
    this.replaceCDATAarr = replaceCDATAarr;

    if (this.options.format) {
      this.indentate = indentate;
      this.tagEndChar = ">\n";
      this.newLine = "\n";
    } else {
      this.indentate = function () {
        return "";
      };

      this.tagEndChar = ">";
      this.newLine = "";
    }

    if (this.options.supressEmptyNode) {
      this.buildTextNode = buildEmptyTextNode;
      this.buildObjNode = buildEmptyObjNode;
    } else {
      this.buildTextNode = buildTextValNode;
      this.buildObjNode = buildObjectNode;
    }

    this.buildTextValNode = buildTextValNode;
    this.buildObjectNode = buildObjectNode;
  }

  _createClass(Parser, [{
    key: "parse",
    value: function parse(jObj) {
      return this.j2x(jObj, 0).val;
    }
  }, {
    key: "j2x",
    value: function j2x(jObj, level) {
      var attrStr = "";
      var val = "";

      var _arr = Object.keys(jObj);

      for (var _i = 0; _i < _arr.length; _i++) {
        var key = _arr[_i];

        if (!isExist(jObj[key])) {// supress undefined node
        } else if (_typeof(jObj[key]) !== "object") {
          //premitive type
          var attr = this.isAttribute(key);

          if (attr) {
            attrStr += " " + attr + "=\"" + this.options.attrValueProcessor("" + jObj[key]) + "\"";
          } else if (this.isCDATA(key)) {
            if (jObj[this.options.textNodeName]) {
              val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
            } else {
              val += this.replaceCDATAstr("", jObj[key]);
            }
          } else {
            //tag value
            if (key === this.options.textNodeName) {
              if (jObj[this.options.cdataTagName]) {//value will added while processing cdata
              } else {
                val += this.options.tagValueProcessor("" + jObj[key]);
              }
            } else {
              val += this.buildTextNode(jObj[key], key, "", level);
            }
          }
        } else if (Array.isArray(jObj[key])) {
          //repeated nodes
          if (this.isCDATA(key)) {
            if (jObj[this.options.textNodeName]) {
              val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
            } else {
              val += this.replaceCDATAarr("", jObj[key]);
            }
          } else {
            //nested nodes
            var _iteratorNormalCompletion = true;
            var _didIteratorError = false;
            var _iteratorError = undefined;

            try {
              for (var _iterator = jObj[key][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var _item = _step.value;

                if (!isExist(_item)) {// supress undefined node
                } else if (_typeof(_item) === "object") {
                  var result = this.j2x(_item, level + 1);
                  val += this.buildObjNode(result.val, key, result.attrStr, level);
                } else {
                  val += this.buildTextNode(_item, key, "", level);
                }
              }
            } catch (err) {
              _didIteratorError = true;
              _iteratorError = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }
              } finally {
                if (_didIteratorError) {
                  throw _iteratorError;
                }
              }
            }
          }
        } else {
          if (this.options.attrNodeName && key === this.options.attrNodeName) {
            var _arr2 = Object.keys(jObj[key]);

            for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
              var attrKey = _arr2[_i2];
              attrStr += " " + attrKey + "=\"" + this.options.tagValueProcessor("" + jObj[key][attrKey]) + "\"";
            }
          } else {
            var _result = this.j2x(jObj[key], level + 1);

            val += this.buildObjNode(_result.val, key, _result.attrStr, level);
          }
        }
      }

      return {
        attrStr: attrStr,
        val: val
      };
    }
  }]);

  return Parser;
}();

function replaceCDATAstr(str, cdata) {
  str = this.options.tagValueProcessor("" + str);

  if (this.options.cdataPositionChar === "" || str === "") {
    return str + "<![CDATA[" + cdata + "]]>";
  } else {
    return str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata + "]]>");
  }
}

function replaceCDATAarr(str, cdata) {
  str = this.options.tagValueProcessor("" + str);

  if (this.options.cdataPositionChar === "" || str === "") {
    return str + "<![CDATA[" + cdata.join("]]><![CDATA[") + "]]>";
  } else {
    var _arr3 = Object.keys(cdata);

    for (var _i3 = 0; _i3 < _arr3.length; _i3++) {
      var v = _arr3[_i3];
      str = str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata[v] + "]]>");
    }

    return str;
  }
}

function buildObjectNode(val, key, attrStr, level) {
  return this.indentate(level) + "<" + key + attrStr + this.tagEndChar + val //+ this.newLine
  + this.indentate(level) + "</" + key + this.tagEndChar;
}

function buildEmptyObjNode(val, key, attrStr, level) {
  if (val !== "") {
    return this.buildObjectNode(val, key, attrStr, level);
  } else {
    return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar; //+ this.newLine
  }
}

function buildTextValNode(val, key, attrStr, level) {
  return this.indentate(level) + "<" + key + attrStr + ">" + this.options.tagValueProcessor("" + val) + "</" + key + this.tagEndChar;
}

function buildEmptyTextNode(val, key, attrStr, level) {
  if (val !== "") {
    return this.buildTextValNode(val, key, attrStr, level);
  } else {
    return this.indentate(level) + "<" + key + attrStr + "/" + this.tagEndChar;
  }
}

function indentate(level) {
  return this.options.indentBy.repeat(level);
}

function isAttribute(name
/*, options*/
) {
  if (!this.options.attrNodeName && name.startsWith(this.options.attributeNamePrefix)) {
    return name.substr(this.attrPrefixLen);
  } else {
    return false;
  }
}

function isCDATA(name) {
  return name === this.options.cdataTagName;
} //formatting
//indentation
//\n after each closing or self closing tag


module.exports = Parser;

/***/ }),

/***/ "./src/n2j-str.js":
/*!************************!*\
  !*** ./src/n2j-str.js ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(/*! ./util */ "./src/util.js"),
    isEmptyObject = _require.isEmptyObject,
    isExist = _require.isExist,
    merge = _require.merge;

var xmlToNodeobj = __webpack_require__(/*! ./x2j */ "./src/x2j.js"); //TODO: do it later


var convertToJsonString = function convertToJsonString(node, options) {
  options = Object.assign({}, xmlToNodeobj.defaultOptions, options);
  options.indentBy = options.indentBy || "";
  return _cToJsonStr(node, options, 0);
};

var _cToJsonStr = function _cToJsonStr(node, options, level) {
  var jObj = "{"; //traver through all the children

  var _arr = Object.keys(node.child);

  for (var _i = 0; _i < _arr.length; _i++) {
    var tagname = _arr[_i];

    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj += "\"" + tagname + "\" : [ ";

      var _arr2 = Object.keys(node.child[tagname]);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var tag = _arr2[_i2];
        jObj += _cToJsonStr(node.child[tagname][tag], options) + " , ";
      }

      jObj = jObj.substr(0, jObj.length - 1) + " ] "; //remove extra comma in last
    } else {
      jObj += "\"" + tagname + "\" : " + _cToJsonStr(node.child[tagname][0], options) + " ,";
    }
  }

  merge(jObj, node.attrsMap); //add attrsMap as new children

  if (isEmptyObject(jObj)) {
    return isExist(node.val) ? node.val : "";
  } else {
    if (isExist(node.val)) {
      if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
        jObj += "\"" + options.textNodeName + "\" : " + stringval(node.val);
      }
    }
  } //add value


  if (jObj[jObj.length - 1] === ",") {
    jObj = jObj.substr(0, jObj.length - 2);
  }

  return jObj + "}";
};

function stringval(v) {
  if (v === true || v === false || !isNaN(v)) {
    return v;
  } else {
    return "\"" + v + "\"";
  }
}

function indentate(options, level) {
  return options.indentBy.repeat(level);
}

module.exports = {
  convertToJsonString: convertToJsonString
};

/***/ }),

/***/ "./src/n2j.js":
/*!********************!*\
  !*** ./src/n2j.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(/*! ./util */ "./src/util.js"),
    isEmptyObject = _require.isEmptyObject,
    merge = _require.merge,
    isExist = _require.isExist;

var convertToJson = function convertToJson(node, options) {
  var jObj = {};

  if ((!node.child || isEmptyObject(node.child)) && (!node.attrsMap || isEmptyObject(node.attrsMap))) {
    return isExist(node.val) ? node.val : "";
  } else {
    if (isExist(node.val)) {
      if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
        jObj[options.textNodeName] = node.val;
      }
    }
  }

  merge(jObj, node.attrsMap);

  var _arr = Object.keys(node.child);

  for (var _i = 0; _i < _arr.length; _i++) {
    var tagname = _arr[_i];

    if (node.child[tagname] && node.child[tagname].length > 1) {
      jObj[tagname] = [];

      var _arr2 = Object.keys(node.child[tagname]);

      for (var _i2 = 0; _i2 < _arr2.length; _i2++) {
        var tag = _arr2[_i2];
        jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
      }
    } else {
      jObj[tagname] = convertToJson(node.child[tagname][0], options);
    }
  } //add value


  return jObj;
};

module.exports = {
  convertToJson: convertToJson
};

/***/ }),

/***/ "./src/nimn-data.js":
/*!**************************!*\
  !*** ./src/nimn-data.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var char = function char(a) {
  return String.fromCharCode(a);
};

var chars = {
  nilChar: char(254),
  missingChar: char(200),
  nilPremitive: char(176),
  missingPremitive: char(201),
  emptyChar: char(177),
  emptyValue: char(178),
  boundryChar: char(186),
  arrayEnd: char(197),
  objStart: char(198),
  arrStart: char(199)
};
var charsArr = [chars.nilChar, chars.nilPremitive, chars.missingChar, chars.missingPremitive, chars.boundryChar, chars.emptyChar, chars.arrayEnd, chars.objStart, chars.arrStart];

var _e = function _e(node, e_schema, options) {
  if (typeof e_schema === "string") {
    //premitive
    if (node && node[0] && node[0].val !== undefined) {
      return getValue(node[0].val, e_schema);
    } else {
      return getValue(node, e_schema);
    }
  } else {
    var hasValidData = hasData(node);

    if (hasValidData === true) {
      var str = "";

      if (Array.isArray(e_schema)) {
        //attributes can't be repeated. hence check in children tags only
        str += chars.arrStart;
        var itemSchema = e_schema[0]; //var itemSchemaType = itemSchema;

        if (typeof itemSchema === "string") {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = node[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var _item = _step.value;
              var r = getValue(_item.val, itemSchema);
              str = processValue(str, r);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        } else {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = node[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var _item3 = _step2.value;

              var _r2 = _e(_item3, itemSchema, options);

              str = processValue(str, _r2);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return != null) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }

        str += chars.arrayEnd; //indicates that next item is not array item
      } else {
        //object
        str += chars.objStart;

        if (Array.isArray(node)) {
          node = node[0];
        }

        var _arr = Object.keys(e_schema);

        for (var _i = 0; _i < _arr.length; _i++) {
          var key = _arr[_i];

          //a property defined in schema can be present either in attrsMap or children tags
          //options.textNodeName will not present in both maps, take it's value from val
          //options.attrNodeName will be present in attrsMap
          var _r3 = void 0;

          if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
            _r3 = _e(node.attrsMap[key], e_schema[key], options);
          } else if (key === options.textNodeName) {
            _r3 = _e(node.val, e_schema[key], options);
          } else {
            _r3 = _e(node.child[key], e_schema[key], options);
          }

          str = processValue(str, _r3);
        }
      }

      return str;
    } else {
      return hasValidData;
    }
  }
};

var getValue = function getValue(a
/*, type*/
) {
  switch (a) {
    case undefined:
      return chars.missingPremitive;

    case null:
      return chars.nilPremitive;

    case "":
      return chars.emptyValue;

    default:
      return a;
  }
};

var processValue = function processValue(str, r) {
  if (!isAppChar(r[0]) && !isAppChar(str[str.length - 1])) {
    str += chars.boundryChar;
  }

  return str + r;
};

var isAppChar = function isAppChar(ch) {
  return charsArr.indexOf(ch) !== -1;
};

var hasData = function hasData(jObj) {
  if (jObj === undefined) {
    return chars.missingChar;
  } else if (jObj === null) {
    return chars.nilChar;
  } else if (jObj.child && Object.keys(jObj.child).length === 0 && (!jObj.attrsMap || Object.keys(jObj.attrsMap).length === 0)) {
    return chars.emptyChar;
  } else {
    return true;
  }
};

var _require = __webpack_require__(/*! ./x2j */ "./src/x2j.js"),
    defaultOptions = _require.defaultOptions;

var convertToNimn = function convertToNimn(node, e_schema, options) {
  options = Object.assign({}, defaultOptions, options);
  return _e(node, e_schema, options);
};

module.exports = {
  convertToNimn: convertToNimn
};

/***/ }),

/***/ "./src/parser.js":
/*!***********************!*\
  !*** ./src/parser.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _require = __webpack_require__(/*! ./x2j */ "./src/x2j.js"),
    getTraversalObj = _require.getTraversalObj;

var _require2 = __webpack_require__(/*! ./nimn-data */ "./src/nimn-data.js"),
    convertToNimn = _require2.convertToNimn;

var _require3 = __webpack_require__(/*! ./validator */ "./src/validator.js"),
    validate = _require3.validate;

var j2xParser = __webpack_require__(/*! ./j2x */ "./src/j2x.js");

var _require4 = __webpack_require__(/*! ./x2j */ "./src/x2j.js"),
    defaultOptions = _require4.defaultOptions;

var _require5 = __webpack_require__(/*! ./n2j */ "./src/n2j.js"),
    convertToJson = _require5.convertToJson;

var _require6 = __webpack_require__(/*! ./n2j-str */ "./src/n2j-str.js"),
    convertToJsonString = _require6.convertToJsonString;

var parseToNimn = function parseToNimn(xmlData, schema, options) {
  return convertToNimn(getTraversalObj(xmlData, options), schema, options);
};

var parse = function parse(xmlData, options) {
  options = Object.assign({}, defaultOptions, options);
  return convertToJson(getTraversalObj(xmlData, options), options);
};

module.exports = {
  parse: parse,
  parseToNimn: parseToNimn,
  convertToJson: convertToJson,
  convertToJsonString: convertToJsonString,
  convertToNimn: convertToNimn,
  getTraversalObj: getTraversalObj,
  validate: validate,
  j2xParser: j2xParser
};

/***/ }),

/***/ "./src/util.js":
/*!*********************!*\
  !*** ./src/util.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

var getAllMatches = function getAllMatches(string, regex) {
  var matches = [];
  var match;

  while ((match = regex.exec(string)) !== null) {
    matches.push(_toConsumableArray(match));
  }

  return matches;
};
/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} source
 */


var merge = function merge(target, source) {
  if (source) {
    var _arr = Object.keys(source);

    for (var _i = 0; _i < _arr.length; _i++) {
      var key = _arr[_i];
      target[key] = source[key];
    }
  }

  return target;
};

var isEmptyObject = function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
};

var isExist = function isExist(v) {
  return typeof v !== "undefined";
};

var doesMatch = function doesMatch(string, regex) {
  var match = regex.exec(string);
  return !(match === null || !isExist(match));
};

var doesNotMatch = function doesNotMatch(string, regex) {
  return !doesMatch(string, regex);
};

var getValue = function getValue(v) {
  return isExist(v) ? v : "";
}; // const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};


module.exports = {
  getValue: getValue,
  merge: merge,
  isEmptyObject: isEmptyObject,
  isExist: isExist,
  doesMatch: doesMatch,
  doesNotMatch: doesNotMatch,
  getAllMatches: getAllMatches
};

/***/ }),

/***/ "./src/validator.js":
/*!**************************!*\
  !*** ./src/validator.js ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(/*! ./util */ "./src/util.js");

var defaultOptions = {
  allowBooleanAttributes: false //A tag can have attributes without any value

};

var buildOptions = function buildOptions(options) {
  if (!options) {
    options = {};
  }

  var props = ["allowBooleanAttributes"];

  for (var _i = 0; _i < props.length; _i++) {
    var i = props[_i];

    if (options[props[i]] === undefined) {
      options[props[i]] = defaultOptions[props[i]];
    }
  }

  return options;
}; //const tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");


var validate = function validate(xmlData, options) {
  options = buildOptions(options); //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
  //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
  //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE

  var tags = [];
  var tagFound = false;

  for (var i = 0; i < xmlData.length; i++) {
    if (xmlData[i] === "<") {
      //starting of tag
      //read until you reach to '>' avoiding any '>' in attribute value
      i++;

      if (xmlData[i] === "?") {
        i = readPI(xmlData, ++i);

        if (i.err) {
          return i;
        }
      } else if (xmlData[i] === "!") {
        i = readCommentAndCDATA(xmlData, i);
        continue;
      } else {
        var closingTag = false;

        if (xmlData[i] === "/") {
          //closing tag
          closingTag = true;
          i++;
        } //read tagname


        var tagName = "";

        for (; i < xmlData.length && xmlData[i] !== ">" && xmlData[i] !== " " && xmlData[i] !== "\t"; i++) {
          tagName += xmlData[i];
        }

        tagName = tagName.trim(); //console.log(tagName);

        if (tagName[tagName.length - 1] === "/") {
          //self closing tag without attributes
          tagName = tagName.substring(0, tagName.length - 1);
          continue;
        }

        if (!validateTagName(tagName)) {
          return {
            err: {
              code: "InvalidTag",
              msg: "Tag " + tagName + " is an invalid name."
            }
          };
        }

        var result = readAttributeStr(xmlData, i);

        if (result === false) {
          return {
            err: {
              code: "InvalidAttr",
              msg: "Attributes for " + tagName + " have open quote"
            }
          };
        }

        var attrStr = result.value;
        i = result.index;

        if (attrStr[attrStr.length - 1] === "/") {
          //self closing tag
          attrStr = attrStr.substring(0, attrStr.length - 1);
          var isValid = validateAttributeString(attrStr, options);

          if (isValid === true) {
            tagFound = true;
            continue;
          } else {
            return isValid;
          }
        } else if (closingTag) {
          if (attrStr.trim().length > 0) {
            return {
              err: {
                code: "InvalidTag",
                msg: "closing tag " + tagName + " can't have attributes or invalid starting."
              }
            };
          } else {
            var otg = tags.pop();

            if (tagName !== otg) {
              return {
                err: {
                  code: "InvalidTag",
                  msg: "closing tag " + otg + " is expected inplace of " + tagName + "."
                }
              };
            }
          }
        } else {
          var _isValid = validateAttributeString(attrStr, options);

          if (_isValid !== true) {
            return _isValid;
          }

          tags.push(tagName);
          tagFound = true;
        } //skip tag text value
        //It may include comments and CDATA value


        for (i++; i < xmlData.length; i++) {
          if (xmlData[i] === "<") {
            if (xmlData[i + 1] === "!") {
              //comment or CADATA
              i++;
              i = readCommentAndCDATA(xmlData, i);
              continue;
            } else {
              break;
            }
          }
        } //end of reading tag text value


        if (xmlData[i] === "<") {
          i--;
        }
      }
    } else {
      if (xmlData[i] === " " || xmlData[i] === "\t" || xmlData[i] === "\n" || xmlData[i] === "\r") {
        continue;
      }

      return {
        err: {
          code: "InvalidChar",
          msg: "char " + xmlData[i] + " is not expected ."
        }
      };
    }
  }

  if (!tagFound) {
    return {
      err: {
        code: "InvalidXml",
        msg: "Start tag expected."
      }
    };
  } else if (tags.length > 0) {
    return {
      err: {
        code: "InvalidXml",
        msg: "Invalid " + JSON.stringify(tags, null, 4).replace(/\r?\n/g, "") + " found."
      }
    };
  }

  return true;
};
/**
 * Read Processing insstructions and skip
 * @param {*} xmlData
 * @param {*} i
 */


function readPI(xmlData, i) {
  var start = i;

  for (; i < xmlData.length; i++) {
    if (xmlData[i] === "?" || xmlData[i] === " ") {
      //tagName
      var tagName = xmlData.substr(start, i - start);

      if (i > 5 && tagName === "xml") {
        return {
          err: {
            code: "InvalidXml",
            msg: "XML declaration allowed only at the start of the document."
          }
        };
      } else if (xmlData[i] === "?" && xmlData[i + 1] === ">") {
        //check if valid attribute string
        i++;
        break;
      } else {
        continue;
      }
    }
  }

  return i;
}

function readCommentAndCDATA(xmlData, i) {
  if (xmlData.length > i + 5 && xmlData[i + 1] === "-" && xmlData[i + 2] === "-") {
    //comment
    for (i += 3; i < xmlData.length; i++) {
      if (xmlData[i] === "-" && xmlData[i + 1] === "-" && xmlData[i + 2] === ">") {
        i += 2;
        break;
      }
    }
  } else if (xmlData.length > i + 8 && xmlData[i + 1] === "D" && xmlData[i + 2] === "O" && xmlData[i + 3] === "C" && xmlData[i + 4] === "T" && xmlData[i + 5] === "Y" && xmlData[i + 6] === "P" && xmlData[i + 7] === "E") {
    var angleBracketsCount = 1;

    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === "<") {
        angleBracketsCount++;
      } else if (xmlData[i] === ">") {
        angleBracketsCount--;

        if (angleBracketsCount === 0) {
          break;
        }
      }
    }
  } else if (xmlData.length > i + 9 && xmlData[i + 1] === "[" && xmlData[i + 2] === "C" && xmlData[i + 3] === "D" && xmlData[i + 4] === "A" && xmlData[i + 5] === "T" && xmlData[i + 6] === "A" && xmlData[i + 7] === "[") {
    for (i += 8; i < xmlData.length; i++) {
      if (xmlData[i] === "]" && xmlData[i + 1] === "]" && xmlData[i + 2] === ">") {
        i += 2;
        break;
      }
    }
  }

  return i;
}

var doubleQuote = "\"";
var singleQuote = "'";
/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData
 * @param {number} i
 */

function readAttributeStr(xmlData, i) {
  var attrStr = "";
  var startChar = "";

  for (; i < xmlData.length; i++) {
    if (xmlData[i] === doubleQuote || xmlData[i] === singleQuote) {
      if (startChar === "") {
        startChar = xmlData[i];
      } else if (startChar !== xmlData[i]) {
        //if vaue is enclosed with double quote then single quotes are allowed inside the value and vice versa
        continue;
      } else {
        startChar = "";
      }
    } else if (xmlData[i] === ">") {
      if (startChar === "") {
        break;
      }
    }

    attrStr += xmlData[i];
  }

  if (startChar !== "") {
    return false;
  }

  return {
    value: attrStr,
    index: i
  };
}
/**
 * Select all the attributes whether valid or invalid.
 */


var validAttrStrRegxp = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])(([\\s\\S])*?)\\5)?", "g"); //attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr, options) {
  //console.log("start:"+attrStr+":end");
  //if(attrStr.trim().length === 0) return true; //empty string
  var matches = util.getAllMatches(attrStr, validAttrStrRegxp);
  var attrNames = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var _match = _step.value;

      //console.log(matches[i]);
      if (_match[1].length === 0) {
        //nospace before attribute name: a="sd"b="saf"
        return {
          err: {
            code: "InvalidAttr",
            msg: "attribute " + _match[2] + " has no space in starting."
          }
        };
      } else if (_match[3] === undefined && !options.allowBooleanAttributes) {
        //independent attribute: ab
        return {
          err: {
            code: "InvalidAttr",
            msg: "boolean attribute " + _match[2] + " is not allowed."
          }
        };
      }
      /* else if(matches[i][6] === undefined){//attribute without value: ab=
                  return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
              } */


      var attrName = _match[2];

      if (!validateAttrName(attrName)) {
        return {
          err: {
            code: "InvalidAttr",
            msg: "attribute " + attrName + " is an invalid name."
          }
        };
      }

      if (!attrNames.hasOwnProperty(attrName)) {
        //check for duplicate attribute.
        attrNames[attrName] = 1;
      } else {
        return {
          err: {
            code: "InvalidAttr",
            msg: "attribute " + attrName + " is repeated."
          }
        };
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }

  return true;
}

var validAttrRegxp = /^[_a-zA-Z][\w\-.:]*$/;

function validateAttrName(attrName) {
  return util.doesMatch(attrName, validAttrRegxp);
} //const startsWithXML = new RegExp("^[Xx][Mm][Ll]");


var startsWith = /^([a-zA-Z]|_)[\w.\-_:]*/;

function validateTagName(tagname) {
  /*if(util.doesMatch(tagname,startsWithXML)) return false;
  else*/
  return !util.doesNotMatch(tagname, startsWith);
}

module.exports = {
  validate: validate
};

/***/ }),

/***/ "./src/x2j.js":
/*!********************!*\
  !*** ./src/x2j.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var util = __webpack_require__(/*! ./util */ "./src/util.js");

var _require = __webpack_require__(/*! ./xml-node */ "./src/xml-node.js"),
    XmlNode = _require.XmlNode;

var TagType = {
  "OPENING": 1,
  "CLOSING": 2,
  "SELF": 3,
  "CDATA": 4
}; //const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");
//treat cdata as a tag

var defaultOptions = {
  attributeNamePrefix: "@_",
  attrNodeName: false,
  textNodeName: "#text",
  ignoreAttributes: true,
  ignoreNameSpace: false,
  allowBooleanAttributes: false,
  //a tag can have attributes without any value
  //ignoreRootElement : false,
  parseNodeValue: true,
  parseAttributeValue: false,
  arrayMode: false,
  trimValues: true,
  //Trim string values of tag and attributes
  cdataTagName: false,
  cdataPositionChar: "\\c",
  tagValueProcessor: function tagValueProcessor(a) {
    return a;
  },
  attrValueProcessor: function attrValueProcessor(a) {
    return a;
  } //decodeStrict: false,

};

var getTraversalObj = function getTraversalObj(xmlData, options) {
  //options = buildOptions(options);
  options = Object.assign({}, defaultOptions, options); //xmlData = xmlData.replace(/\r?\n/g, " ");//make it single line

  xmlData = xmlData.replace(/<!--[\s\S]*?-->/g, ""); //Remove  comments

  var xmlObj = new XmlNode("!xml");
  var currentNode = xmlObj;
  var tagsRegx = /<((!\[CDATA\[([\s\S]*?)(]]>))|(([\w:\-._]*:)?([\w:\-._]+))([^>]*)>|((\/)(([\w:\-._]*:)?([\w:\-._]+))>))([^<]*)/g;
  var tag = tagsRegx.exec(xmlData);
  var nextTag = tagsRegx.exec(xmlData);

  while (tag) {
    var tagType = checkForTagType(tag);

    if (tagType === TagType.CLOSING) {
      //add parsed data to parent node
      if (currentNode.parent && tag[14]) {
        currentNode.parent.val = util.getValue(currentNode.parent.val) + "" + processTagValue(tag[14], options);
      }

      currentNode = currentNode.parent;
    } else if (tagType === TagType.CDATA) {
      if (options.cdataTagName) {
        //add cdata node
        var childNode = new XmlNode(options.cdataTagName, currentNode, tag[3]);
        childNode.attrsMap = buildAttributesMap(tag[8], options);
        currentNode.addChild(childNode); //for backtracking

        currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar; //add rest value to parent node

        if (tag[14]) {
          currentNode.val += processTagValue(tag[14], options);
        }
      } else {
        currentNode.val = (currentNode.val || "") + (tag[3] || "") + processTagValue(tag[14], options);
      }
    } else if (tagType === TagType.SELF) {
      var _childNode = new XmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, "");

      if (tag[8] && tag[8].length > 1) {
        tag[8] = tag[8].substr(0, tag[8].length - 1);
      }

      _childNode.attrsMap = buildAttributesMap(tag[8], options);
      currentNode.addChild(_childNode);
    } else {
      //TagType.OPENING
      var _childNode2 = new XmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, processTagValue(tag[14], options));

      _childNode2.attrsMap = buildAttributesMap(tag[8], options);
      currentNode.addChild(_childNode2);
      currentNode = _childNode2;
    }

    tag = nextTag;
    nextTag = tagsRegx.exec(xmlData);
  }

  return xmlObj;
};

function processTagValue(val, options) {
  if (val) {
    if (options.trimValues) {
      val = val.trim();
    }

    val = options.tagValueProcessor(val);
    val = parseValue(val, options.parseNodeValue);
  }

  return val;
}

function checkForTagType(match) {
  if (match[4] === "]]>") {
    return TagType.CDATA;
  } else if (match[10] === "/") {
    return TagType.CLOSING;
  } else if (typeof match[8] !== "undefined" && match[8].substr(match[8].length - 1) === "/") {
    return TagType.SELF;
  } else {
    return TagType.OPENING;
  }
}

function resolveNameSpace(tagname, options) {
  if (options.ignoreNameSpace) {
    var tags = tagname.split(":");
    var prefix = tagname.charAt(0) === "/" ? "/" : "";

    if (tags[0] === "xmlns") {
      return "";
    }

    if (tags.length === 2) {
      tagname = prefix + tags[1];
    }
  }

  return tagname;
}

function parseValue(val, shouldParse) {
  if (shouldParse && typeof val === "string") {
    if (val.trim() === "" || isNaN(val)) {
      val = val === "true" ? true : val === "false" ? false : val;
    } else {
      if (val.indexOf(".") !== -1) {
        val = parseFloat(val);
      } else {
        val = parseInt(val, 10);
      }
    }

    return val;
  }

  if (util.isExist(val)) {
    return val;
  }

  return "";
} //TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");


var attrsRegx = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])(.*?)\\3)?", "g");

function buildAttributesMap(attrStr, options) {
  if (!options.ignoreAttributes && typeof attrStr === "string") {
    attrStr = attrStr.replace(/\r?\n/g, " "); //attrStr = attrStr || attrStr.trim();

    var matches = util.getAllMatches(attrStr, attrsRegx);
    var attrs = {};
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = matches[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var _match = _step.value;
        var attrName = resolveNameSpace(_match[1], options);

        if (attrName.length) {
          if (_match[4] !== undefined) {
            if (options.trimValues) {
              _match[4] = _match[4].trim();
            }

            _match[4] = options.attrValueProcessor(_match[4]);
            attrs[options.attributeNamePrefix + attrName] = parseValue(_match[4], options.parseAttributeValue);
          } else if (options.allowBooleanAttributes) {
            attrs[options.attributeNamePrefix + attrName] = true;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return != null) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    if (!Object.keys(attrs).length) {
      return;
    }

    if (options.attrNodeName) {
      var attrCollection = {};
      attrCollection[options.attrNodeName] = attrs;
      return attrCollection;
    }

    return attrs;
  }
}

module.exports = {
  defaultOptions: defaultOptions,
  getTraversalObj: getTraversalObj
};

/***/ }),

/***/ "./src/xml-node.js":
/*!*************************!*\
  !*** ./src/xml-node.js ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var XmlNode =
/*#__PURE__*/
function () {
  function XmlNode(tagname, parent, val) {
    _classCallCheck(this, XmlNode);

    this.tagname = tagname;
    this.parent = parent;
    this.child = {}; //child tags

    this.attrsMap = {}; //attributes map

    this.val = val; //text only
  }

  _createClass(XmlNode, [{
    key: "addChild",
    value: function addChild(child) {
      if (this.child[child.tagname]) {
        //already presents
        this.child[child.tagname].push(child);
      } else {
        this.child[child.tagname] = [child];
      }
    }
  }]);

  return XmlNode;
}();

module.exports = {
  XmlNode: XmlNode
};

/***/ })

/******/ });
//# sourceMappingURL=parser.js.map