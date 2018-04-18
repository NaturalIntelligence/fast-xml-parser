const {isExist, buildOptions} = require("./util");

const defaultOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    cdataTagName: false,
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    supressEmptyNode: false,
    tagValueProcessor: (a) => a,
    attrValueProcessor: (a) => a
};

const props = [
    "attributeNamePrefix",
    "attrNodeName",
    "textNodeName",
    "ignoreAttributes",
    "cdataTagName",
    "cdataPositionChar",
    "format",
    "indentBy",
    "supressEmptyNode",
    "tagValueProcessor",
    "attrValueProcessor"
];

class Parser {
    constructor(options) {
        this.options = buildOptions(options, defaultOptions, props);
        if (this.options.ignoreAttributes || this.options.attrNodeName) {
            this.isAttribute = function(/*a*/) { return false;};
        } else {
            this.attrPrefixLen = this.options.attributeNamePrefix.length;
            this.isAttribute = isAttribute;
        }
        if (this.options.cdataTagName) {
            this.isCDATA = isCDATA;
        } else {
            this.isCDATA = (/*a*/) => false;
        }
        this.replaceCDATAstr = replaceCDATAstr;
        this.replaceCDATAarr = replaceCDATAarr;

        if (this.options.format) {
            this.indentate = indentate;
            this.tagEndChar = ">\n";
            this.newLine = "\n";
        } else {
            this.indentate = () => "";
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

    parse(jObj) {
        return this.j2x(jObj, 0).val;
    }

    j2x(jObj, level) {
        let attrStr = "";
        let val = "";
        for (let key of Object.keys(jObj)) {
            if (!isExist(jObj[key])) {
                // supress undefined node
            }
            else if (typeof jObj[key] !== "object") {//premitive type
                const attr = this.isAttribute(key);
                if (attr) {
                    attrStr += " " + attr + "=\"" + this.options.attrValueProcessor("" + jObj[key]) + "\"";
                } else if (this.isCDATA(key)) {
                    if (jObj[this.options.textNodeName]) {
                        val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
                    } else {
                        val += this.replaceCDATAstr("", jObj[key]);
                    }
                } else {//tag value
                    if (key === this.options.textNodeName) {
                        if (jObj[this.options.cdataTagName]) {
                            //value will added while processing cdata
                        } else {
                            val += this.options.tagValueProcessor("" + jObj[key]);
                        }
                    } else {
                        val += this.buildTextNode(jObj[key], key, "", level);
                    }
                }
            } else if (Array.isArray(jObj[key])) {//repeated nodes
                if (this.isCDATA(key)) {
                    if (jObj[this.options.textNodeName]) {
                        val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
                    } else {
                        val += this.replaceCDATAarr("", jObj[key]);
                    }
                } else {//nested nodes
                    for (let item of jObj[key]) {
                        if (!isExist(item)) {
                            // supress undefined node
                        }
                        else if (typeof item === "object") {
                            const result = this.j2x(item, level + 1);
                            val += this.buildObjNode(result.val, key, result.attrStr, level);
                        } else {
                            val += this.buildTextNode(item, key, "", level);
                        }
                    }
                }
            } else {
                if (this.options.attrNodeName && key === this.options.attrNodeName) {
                    for (let attrKey of Object.keys(jObj[key])) {
                        attrStr += " " + attrKey + "=\"" + this.options.tagValueProcessor("" + jObj[key][attrKey]) + "\"";
                    }
                } else {
                    const result = this.j2x(jObj[key], level + 1);
                    val += this.buildObjNode(result.val, key, result.attrStr, level);
                }
            }
        }
        return {attrStr: attrStr, val: val};
    }
}

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
        for (const v of Object.keys(cdata)) {
            str = str.replace(this.options.cdataPositionChar, "<![CDATA[" + cdata[v] + "]]>");
        }
        return str;
    }
}

function buildObjectNode(val, key, attrStr, level) {
    return this.indentate(level)
           + "<" + key + attrStr
           + this.tagEndChar
           + val
           //+ this.newLine
           + this.indentate(level)
           + "</" + key + this.tagEndChar;
}

function buildEmptyObjNode(val, key, attrStr, level) {
    if (val !== "") {
        return this.buildObjectNode(val, key, attrStr, level);
    } else {
        return this.indentate(level)
               + "<" + key + attrStr
               + "/"
               + this.tagEndChar;
        //+ this.newLine
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

function isAttribute(name/*, options*/) {
    if (name.startsWith(this.options.attributeNamePrefix)) {
        return name.substr(this.attrPrefixLen);
    } else {
        return false;
    }
}

function isCDATA(name) {
    return name === this.options.cdataTagName;
}

//formatting
//indentation
//\n after each closing or self closing tag

module.exports = {Parser, isAttribute};
