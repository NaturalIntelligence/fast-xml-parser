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
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/cli.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "../package.json":
/*!*********************************!*\
  !*** external "./package.json" ***!
  \*********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("./package.json");

/***/ }),

/***/ "./parser":
/*!***************************!*\
  !*** external "./parser" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("./parser");

/***/ }),

/***/ "./src/cli.js":
/*!********************!*\
  !*** ./src/cli.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var fs = __webpack_require__(/*! fs */ "fs");

var parser = __webpack_require__(/*! ./parser */ "./parser");

var _require = __webpack_require__(/*! ./read */ "./src/read.js"),
    readToEnd = _require.readToEnd;

var writeToFile = function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, function (err) {
    if (err) {
      throw err;
    }

    console.log("JSON output has been written to " + fileName);
  });
};

if (process.argv[2] === "--help" || process.argv[2] === "-h") {
  console.log("Fast XML Parser ".concat(__webpack_require__(/*! ../package.json */ "../package.json").version, "\n----------------\nxml2js [-ns|-a|-c|-v|-V] <filename> [-o outputFile.json]\ncat xmlFile.xml | xml2js [-ns|-a|-c|-v|-V] [-o outputFile.json]\n-ns: remove namespace from tag and attribute name.\n-a: don't parse attributes.\n-c: parse values to primitive type.\n-v: validate before parsing.\n-V: validate only."));
} else if (process.argv[2] === "--version") {
  console.log(__webpack_require__(/*! ../package.json */ "../package.json").version);
} else {
  var options = {
    ignoreNameSpace: true,
    ignoreAttributes: false,
    parseNodeValue: true,
    parseAttributeValue: true
  };
  var fileName = "";
  var outputFileName;
  var validate = false;
  var validateOnly = false;

  for (var i = 2; i < process.argv.length; i++) {
    if (process.argv[i] === "-ns") {
      options.ignoreNameSpace = false;
    } else if (process.argv[i] === "-a") {
      options.ignoreAttributes = true;
    } else if (process.argv[i] === "-c") {
      options.parseNodeValue = false;
      options.parseAttributeValue = false;
    } else if (process.argv[i] === "-o") {
      outputFileName = process.argv[++i];
    } else if (process.argv[i] === "-v") {
      validate = true;
    } else if (process.argv[i] === "-V") {
      validateOnly = true;
    } else {
      //filename
      fileName = process.argv[i];
    }
  }

  var callback = function callback(xmlData) {
    var output = "";

    if (validate) {
      var result = parser.validate(xmlData);

      if (result === true) {
        output = JSON.stringify(parser.parse(xmlData, options), null, 4);
      } else {
        output = result;
      }
    } else if (validateOnly) {
      output = parser.validate(xmlData);
    } else {
      output = JSON.stringify(parser.parse(xmlData, options), null, 4);
    }

    if (outputFileName) {
      writeToFile(outputFileName, output);
    } else {
      console.log(output);
    }
  };

  try {
    if (!fileName) {
      readToEnd(process.stdin, function (err, data) {
        if (err) {
          throw err;
        }

        callback(data);
      });
    } else {
      fs.readFile(fileName, function (err, data) {
        if (err) {
          throw err;
        }

        callback(data);
      });
    }
  } catch (e) {
    console.log("Seems an invalid file or stream." + e);
  }
}

/***/ }),

/***/ "./src/read.js":
/*!*********************!*\
  !*** ./src/read.js ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Copyright 2013 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE

/*

Read any stream all the way to the end and trigger a single cb

const http = require('http');

const rte = require('readtoend');

http.get('http://nodejs.org', function(response) {
  rte.readToEnd(response, function(err, body) {
    console.log(body);
  });
});

*/
var _require = __webpack_require__(/*! stream */ "stream"),
    Transform = _require.Transform;

var ReadToEnd =
/*#__PURE__*/
function (_Transform) {
  _inherits(ReadToEnd, _Transform);

  function ReadToEnd(opts) {
    var _this;

    _classCallCheck(this, ReadToEnd);

    _this = _possibleConstructorReturn(this, (ReadToEnd.__proto__ || Object.getPrototypeOf(ReadToEnd)).call(this, opts));
    _this._rte_encoding = opts.encoding || "utf8";
    _this._buff = "";
    return _this;
  }

  _createClass(ReadToEnd, [{
    key: "_transform",
    value: function _transform(chunk, encoding, done) {
      this._buff += chunk.toString(this._rte_encoding);
      this.push(chunk);
      done();
    }
  }, {
    key: "_flush",
    value: function _flush(done) {
      this.emit("complete", undefined, this._buff);
      done();
    }
  }]);

  return ReadToEnd;
}(Transform);

var readToEnd = function readToEnd(stream, options, cb) {
  if (!cb) {
    cb = options;
    options = {};
  }

  var destStream = new ReadToEnd(options);
  stream.pipe(destStream);
  stream.on("error", function (err) {
    stream.unpipe(destStream);
    cb(err);
  });
  destStream.on("complete", cb);
  destStream.resume();
  return destStream;
};

module.exports = {
  ReadToEnd: ReadToEnd,
  readToEnd: readToEnd
};

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("stream");

/***/ })

/******/ });
//# sourceMappingURL=parser.cli.js.map