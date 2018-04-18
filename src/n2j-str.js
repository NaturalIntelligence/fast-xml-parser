"use strict";

const {buildOptions, isEmptyObject, isExist, merge} = require("./util");
const {defaultOptions, props} = require("./x2j");

//TODO: do it later
const convertToJsonString = function(node, options) {
    options = buildOptions(options,defaultOptions,props);

    options.indentBy = options.indentBy || "";
    return _cToJsonStr(node, options, 0);
};

const _cToJsonStr = function(node, options, level) {
    let jObj = "{";

    //traver through all the children
    for (let tagname of Object.keys(node.child)) {
        if (node.child[tagname] && node.child[tagname].length > 1) {
            jObj += "\"" + tagname + "\" : [ ";
            for (let tag of Object.keys(node.child[tagname])) {
                jObj += _cToJsonStr(node.child[tagname][tag], options) + " , ";
            }
            jObj = jObj.substr(0, jObj.length - 1) + " ] "; //remove extra comma in last
        } else {
            jObj += "\"" + tagname + "\" : " + _cToJsonStr(node.child[tagname][0], options) + " ,";
        }
    }
    merge(jObj, node.attrsMap);
    //add attrsMap as new children
    if (isEmptyObject(jObj)) {
        return isExist(node.val) ? node.val : "";
    } else {
        if (isExist(node.val)) {
            if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
                jObj += "\"" + options.textNodeName + "\" : " + stringval(node.val);
            }
        }
    }
    //add value
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

module.exports = {convertToJsonString};
