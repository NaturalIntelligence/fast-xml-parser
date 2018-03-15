const util = require("./util");
const {XmlNode} = require("./xml-node");
const TagType = {"OPENING": 1, "CLOSING": 2, "SELF": 3, "CDATA": 4};

//const tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//const tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

//treat cdata as a tag

const defaultOptions = {
    attributeNamePrefix: "@_",
    attrNodeName: false,
    textNodeName: "#text",
    ignoreAttributes: true,
    ignoreNameSpace: false,
    allowBooleanAttributes: false,         //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseNodeValue: true,
    parseAttributeValue: false,
    arrayMode: false,
    trimValues: true,                                //Trim string values of tag and attributes
    cdataTagName: false,
    cdataPositionChar: "\\c",
    tagValueProcessor: (a) => a,
    attrValueProcessor: (a) => a
    //decodeStrict: false,
};

const getTraversalObj = (xmlData, options) => {
    //options = buildOptions(options);
    options = Object.assign({}, defaultOptions, options);
    //xmlData = xmlData.replace(/\r?\n/g, " ");//make it single line
    xmlData = xmlData.replace(/<!--[\s\S]*?-->/g, "");//Remove  comments

    const xmlObj = new XmlNode("!xml");
    let currentNode = xmlObj;

    const tagsRegx = /<((!\[CDATA\[([\s\S]*?)(]]>))|(([\w:\-._]*:)?([\w:\-._]+))([^>]*)>|((\/)(([\w:\-._]*:)?([\w:\-._]+))>))([^<]*)/g;
    let tag = tagsRegx.exec(xmlData);
    let nextTag = tagsRegx.exec(xmlData);
    while (tag) {
        const tagType = checkForTagType(tag);

        if (tagType === TagType.CLOSING) {
            //add parsed data to parent node
            if (currentNode.parent && tag[14]) {
                currentNode.parent.val = util.getValue(currentNode.parent.val) + "" + processTagValue(tag[14], options);
            }

            currentNode = currentNode.parent;
        } else if (tagType === TagType.CDATA) {
            if (options.cdataTagName) {
                //add cdata node
                const childNode = new XmlNode(options.cdataTagName, currentNode, tag[3]);
                childNode.attrsMap = buildAttributesMap(tag[8], options);
                currentNode.addChild(childNode);
                //for backtracking
                currentNode.val = util.getValue(currentNode.val) + options.cdataPositionChar;
                //add rest value to parent node
                if (tag[14]) {
                    currentNode.val += processTagValue(tag[14], options);
                }
            } else {
                currentNode.val = (currentNode.val || "") + (tag[3] || "") + processTagValue(tag[14], options);
            }
        } else if (tagType === TagType.SELF) {
            const childNode = new XmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, "");
            if (tag[8] && tag[8].length > 1) {
                tag[8] = tag[8].substr(0, tag[8].length - 1);
            }
            childNode.attrsMap = buildAttributesMap(tag[8], options);
            currentNode.addChild(childNode);
        } else {//TagType.OPENING
            const childNode = new XmlNode(options.ignoreNameSpace ? tag[7] : tag[5], currentNode, processTagValue(tag[14], options));
            childNode.attrsMap = buildAttributesMap(tag[8], options);
            currentNode.addChild(childNode);
            currentNode = childNode;
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
        const tags = tagname.split(":");
        const prefix = tagname.charAt(0) === "/" ? "/" : "";
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
}

//TODO: change regex to capture NS
//const attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
const attrsRegx = new RegExp("([^\\s=]+)\\s*(=\\s*(['\"])(.*?)\\3)?", "g");

function buildAttributesMap(attrStr, options) {
    if (!options.ignoreAttributes && typeof attrStr === "string") {
        attrStr = attrStr.replace(/\r?\n/g, " ");
        //attrStr = attrStr || attrStr.trim();

        const matches = util.getAllMatches(attrStr, attrsRegx);
        const attrs = {};
        for (let match of matches) {
            const attrName = resolveNameSpace(match[1], options);
            if (attrName.length) {
                if (match[4] !== undefined) {
                    if (options.trimValues) {
                        match[4] = match[4].trim();
                    }
                    match[4] = options.attrValueProcessor(match[4]);
                    attrs[options.attributeNamePrefix + attrName] = parseValue(match[4], options.parseAttributeValue);
                } else if (options.allowBooleanAttributes) {
                    attrs[options.attributeNamePrefix + attrName] = true;
                }

            }
        }
        if (!Object.keys(attrs).length) {
            return;
        }
        if (options.attrNodeName) {
            const attrCollection = {};
            attrCollection[options.attrNodeName] = attrs;
            return attrCollection;
        }
        return attrs;
    }
}

module.exports = {
    defaultOptions,
    getTraversalObj
};
