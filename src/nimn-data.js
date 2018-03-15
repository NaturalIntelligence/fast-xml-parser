const char = (a) => String.fromCharCode(a);

const chars = {
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

const charsArr = [
    chars.nilChar,
    chars.nilPremitive,
    chars.missingChar,
    chars.missingPremitive,
    chars.boundryChar,
    chars.emptyChar,
    chars.arrayEnd,
    chars.objStart,
    chars.arrStart
];

const _e = (node, e_schema, options) => {
    if (typeof e_schema === "string") {//premitive
        if (node && node[0] && node[0].val !== undefined) {
            return getValue(node[0].val, e_schema);
        } else {
            return getValue(node, e_schema);
        }
    } else {
        const hasValidData = hasData(node);
        if (hasValidData === true) {
            let str = "";
            if (Array.isArray(e_schema)) {
                //attributes can't be repeated. hence check in children tags only
                str += chars.arrStart;
                const itemSchema = e_schema[0];
                //var itemSchemaType = itemSchema;
                if (typeof itemSchema === "string") {
                    for (let item of node) {
                        const r = getValue(item.val, itemSchema);
                        str = processValue(str, r);
                    }
                } else {
                    for (let item of node) {
                        const r = _e(item, itemSchema, options);
                        str = processValue(str, r);
                    }
                }
                str += chars.arrayEnd;//indicates that next item is not array item
            } else {//object
                str += chars.objStart;
                if (Array.isArray(node)) {
                    node = node[0];
                }
                for (let key of Object.keys(e_schema)) {
                    //a property defined in schema can be present either in attrsMap or children tags
                    //options.textNodeName will not present in both maps, take it's value from val
                    //options.attrNodeName will be present in attrsMap
                    let r;
                    if (!options.ignoreAttributes && node.attrsMap && node.attrsMap[key]) {
                        r = _e(node.attrsMap[key], e_schema[key], options);
                    } else if (key === options.textNodeName) {
                        r = _e(node.val, e_schema[key], options);
                    } else {
                        r = _e(node.child[key], e_schema[key], options);
                    }
                    str = processValue(str, r);
                }
            }
            return str;
        } else {
            return hasValidData;
        }
    }
};

const getValue = (a/*, type*/) => {
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

const processValue = (str, r) => {
    if (!isAppChar(r[0]) && !isAppChar(str[str.length - 1])) {
        str += chars.boundryChar;
    }
    return str + r;
};

const isAppChar = (ch) => {
    return charsArr.indexOf(ch) !== -1;
};

const hasData = (jObj) => {
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

const {defaultOptions} = require("./x2j");
const convertToNimn = (node, e_schema, options) => {
    options = Object.assign({}, defaultOptions, options);
    return _e(node, e_schema, options);
};

module.exports = {convertToNimn};
