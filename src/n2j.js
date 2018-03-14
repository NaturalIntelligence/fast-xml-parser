"use strict";

const util = require("./util");

const convertToJson =function(node, options) {
    const jObj = {};

    if ((!node.child  ||  util.isEmptyObject(node.child)) && (!node.attrsMap || util.isEmptyObject(node.attrsMap))) {
        return util.isExist(node.val) ? node.val : "";
    } else {
        if (util.isExist(node.val)) {
            if (!(typeof node.val === "string" && (node.val === "" || node.val === options.cdataPositionChar))) {
                jObj[options.textNodeName] = node.val;
            }
        }
    }

    util.merge(jObj, node.attrsMap);

    const keys = Object.keys(node.child);
    for (let index = 0; index < keys.length; index++) {
        var tagname = keys[index];
        if (node.child[tagname] && node.child[tagname].length > 1) {
            jObj[tagname] = [];
            for (var tag in node.child[tagname]) {
                jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
            }
        } else {
            jObj[tagname] = convertToJson(node.child[tagname][0], options);
        }
    }
    
    //add value
    return jObj;
};

exports.convertToJson = convertToJson;