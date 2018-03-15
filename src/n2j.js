const {isEmptyObject, merge, isExist} = require("./util");

const convertToJson = function(node, options) {
    const jObj = {};

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

    for (let tagname of  Object.keys(node.child)) {
        if (node.child[tagname] && node.child[tagname].length > 1) {
            jObj[tagname] = [];
            for (let tag of Object.keys(node.child[tagname])) {
                jObj[tagname].push(convertToJson(node.child[tagname][tag], options));
            }
        } else {
            jObj[tagname] = convertToJson(node.child[tagname][0], options);
        }
    }

    //add value
    return jObj;
};

module.exports = {convertToJson};
