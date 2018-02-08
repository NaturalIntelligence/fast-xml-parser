var util = require("./util");
var xmlNode = require("./xmlNode");
var he = require("he");
var TagType = {"OPENING":1, "CLOSING":2, "SELF":3, "CDATA": 4};

//var tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>(\\s*"+cdataRegx+")*([^<]+)?","g");
//var tagsRegx = new RegExp("<(\\/?)((\\w*:)?([\\w:\\-\._]+))([^>]*)>([^<]*)("+cdataRegx+"([^<]*))*([^<]+)?","g");

//treat cdata as a tag


var defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: false,
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    //allowBooleanAttributes : false,         //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    arrayMode : false,
    trimValues: true,                                //Trim string values of tag and attributes 
};

var buildOptions = function (options){
    if(!options) options = {};
    var props = ["attributeNamePrefix",
                        "attrNodeName",
                        "ignoreAttributes",
                        "ignoreNameSpace",
                        "textNodeName",
                        "parseNodeValue",
                        "parseAttributeValue",
                        "arrayMode",
                        "trimValues",
                ];
    var len = props.length;
    for (var i = 0; i < len; i++) {
        if(typeof options[props[i]] === "undefined"){
            options[props[i]] = defaultOptions[props[i]];
        }
    }
    return options;
};

var getTraversalObj =function (xmlData,options){
    options = buildOptions(options);
    xmlData = xmlData.replace(/\r?\n/g, " ");//make it single line
    xmlData = xmlData.replace(/<!--.*?-->/g, "");//Remove  comments
    
    var xmlObj = new xmlNode('!xml');
    var currentNode = xmlObj;

    //fake function calls to reduce coparisons
    var resolveNS = options.ignoreNameSpace ? resolveNameSpace : fakeCall;
    var buildAttributesMap = options.ignoreAttributes ? fakeCallNoReturn : buildAttributesArr;
    var parseNodeVal = options.parseNodeValue ? parseValue : noParse;
    var parseAttrVal = options.parseAttributeValue ? parseValue : noParse;

    var tagsRegx = new RegExp("<((!\\[CDATA\\[(.*?)(\\]\\]>))|((\\w*:)?([\\w:\\-\\._]+))([^>]*)>|((\\/)((\\w*:)?([\\w:\\-\\._]+))>))([^<]*)","g");
    var tag = tagsRegx.exec(xmlData);
    var nextTag = tagsRegx.exec(xmlData);
    var previousMatch,nextMatch;
    while (tag) {
        var tagType = checkForTagType(tag);

        if(tagType === TagType.CLOSING){
            //add parsed data to parent node
            if(currentNode.parent && tag[14]){
                currentNode.parent.val = util.getValue(currentNode.parent.val) + "" + parseNodeVal(he.decode(tag[14]),options);
            }

            //currentNode.parent.val = (currentNode.parent.val || "")  + parseNodeVal(he.decode(tag[14]),options);
            currentNode = currentNode.parent;
        }else if(tagType === TagType.CDATA){
            //no attribute
            //add text to parent node
            //add parsed data to parent node
            currentNode.val = (currentNode.val || "") + (tag[3] || "") + parseNodeVal(he.decode(tag[14]),options);
        }else if(tagType === TagType.SELF){
            var childNode = new xmlNode( options.ignoreNameSpace ? tag[7] : tag[5],currentNode, "");
            childNode.attrsMap = buildAttributesMap(tag[8],options,resolveNS,parseAttrVal);
            currentNode.addChild(childNode);
        }else{//TagType.OPENING
            var childNode = new xmlNode( options.ignoreNameSpace ? tag[7] : tag[5],currentNode,parseNodeVal(he.decode(tag[14]),options));
            childNode.attrsMap = buildAttributesMap(tag[8],options,resolveNS,parseAttrVal);
            currentNode.addChild(childNode);
            currentNode = childNode;
        }

        tag = nextTag;
        nextTag = tagsRegx.exec(xmlData);
    }

    return xmlObj;
};



function checkForTagType(match){
    if(match[4] === "]]>"){
        return TagType.CDATA;
    }else if(match[10] === "/"){
        return TagType.CLOSING;
    }else if(typeof match[8] !== "undefined" && match[8].substr(match[8].length-1) === "/"){
        return TagType.SELF;
    }else{
        return TagType.OPENING;
    }
}

var fakeCall =  function(a) {return a;}
var fakeCallNoReturn =  function() {}

var xml2json = function (xmlData,options){
    options = buildOptions(options);
    return convertToJson(getTraversalObj(xmlData,options), options.textNodeName, options.arrayMode);
};


function resolveNameSpace(tagname){
    var tags = tagname.split(":");
    var prefix = tagname.charAt(0) === "/" ? "/" : "";
    if(tags.length === 2) {
        if(tags[0] === "xmlns") {
            return "";
        }
        tagname = prefix + tags[1];
    }
    return tagname;
}

function noParse(val){
    if(typeof val === "string"){
        return val;
    }else{
        return  "";
    }
}

function parseValue(val,options){
    if(typeof val === "string"){
        if(options.trimValues){
            val = val.trim();
        }
        if(val.trim() === "" || isNaN(val)){
            val = val === "true" ? true : val === "false" ? false : val;
        }else{
            if(val.indexOf(".") !== -1){
                val = Number.parseFloat(val);
            }else{
                val = Number.parseInt(val,10);
            }
        }
        return val;
    }else{
        if(util.isExist(val)) return val;
        else return  "";
    }
}

//TODO: change regex to capture NS
var attrsRegx = new RegExp("([\\w\\-\\.\\:]+)\\s*=\\s*(['\"])((.|\n)*?)\\2","gm");
function buildAttributesArr(attrStr,options,resolveNS,parseAttrVal){
    if( typeof attrStr === "string" ){
        //attrStr = attrStr || attrStr.trim();
        
        if( attrStr.length > 3){

            var matches = util.getAllMatches(attrStr,attrsRegx);
            var len = matches.length; //don't make it inline
            var attrs = {};
            for (var i = 0; i < len ; i++) {
                var attrName = resolveNS(matches[i][1]);
                if(attrName.length && attrName !== "xmlns") {
                    attrs[options.attributeNamePrefix + attrName] = parseAttrVal(matches[i][3],options);
                }
            }
            if(!Object.keys(attrs).length){
                return;
            }
            if(options.attrNodeName){
                var attrCollection = {};
                attrCollection[options.attrNodeName] = attrs;
                return attrCollection;
            }
            return attrs;
        }
    }
}

var convertToJson = function (node, textNodeName,arrayMode){
    var jObj = {};

    //traver through all the children
    for (var index = 0; index < node.child.length; index++) {
        var prop = node.child[index].tagname;
        var obj = convertToJson(node.child[index],textNodeName, arrayMode);
        if(typeof jObj[prop] !== "undefined"){
            if(!Array.isArray(jObj[prop])){
                var swap = jObj[prop];
                jObj[prop] = [];
                jObj[prop].push(swap);
            }
            jObj[prop].push(obj);
        }else{
            jObj[prop] = arrayMode ? [obj] : obj;
        }
    }
    util.merge(jObj,node.attrsMap);
    //add attrsMap as new children
    if(util.isEmptyObject(jObj)){
        return util.isExist(node.val)? node.val :  "";
    }else{
        if(util.isExist(node.val)){
            if(!(typeof node.val === "string" && node.val === "")){
                jObj[textNodeName] = node.val;
            }
        }
    }
    //add value
    return jObj;
};




exports.parse = xml2json;
exports.getTraversalObj = getTraversalObj;
exports.convertToJson = convertToJson;
exports.validate = require("./validator").validate;
