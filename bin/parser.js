var getAllMatches = require("./util").getAllMatches;

var xmlNode = function(tagname,parent,val){
    this.tagname = tagname;
    this.parent = parent;
    this.child = [];
    this.val = val;
    this.addChild = function (child){
        this.child.push(child);
    };
};

//var tagsRegx = new RegExp("<(\\/?[a-zA-Z0-9_:]+)([^>\\/]*)(\\/?)>([^<]+)?","g");
//var tagsRegx = new RegExp("<(\\/?[\\w:-]+)([^>]*)>([^<]+)?","g");
//var cdataRegx = "<!\\[CDATA\\[([^\\]\\]]*)\\]\\]>";
var cdataRegx = "<!\\[CDATA\\[(.*?)(\\]\\]>)";
var tagsRegx = new RegExp("<(\\/?[\\w:\\-\._]+)([^>]*)>("+cdataRegx+")*([^<]+)?","g");

var defaultOptions = {
    attrPrefix : "@_",
    attrNodeName: false,
    textNodeName : "#text",
    ignoreNonTextNodeAttr : true,
    ignoreTextNodeAttr : true,
    ignoreNameSpace : false,
    ignoreRootElement : false,
    textNodeConversion : true,
    textAttrConversion : false,
    arrayMode : false
};

var buildOptions = function (options){
    if(!options) options = {};
    var props = ["attrPrefix","attrNodeName","ignoreNonTextNodeAttr","ignoreTextNodeAttr","ignoreNameSpace","ignoreRootElement","textNodeName","textNodeConversion","textAttrConversion","arrayMode"];
    for (var i = 0; i < props.length; i++) {
        if(options[props[i]] === undefined){
            options[props[i]] = defaultOptions[props[i]];
        }
    }
    return options;
};

var getTraversalObj =function (xmlData,options){
    options = buildOptions(options);
    //xmlData = xmlData.replace(/>(\s+)/g, ">");//Remove spaces and make it single line.
    var tags = getAllMatches(xmlData,tagsRegx);
    var xmlObj = new xmlNode('!xml');
    var currentNode = xmlObj;

    for (var i = 0; i < tags.length ; i++) {
        var tag = resolveNameSpace(tags[i][1],options.ignoreNameSpace),
            nexttag = i+1 < tags.length ? resolveNameSpace(tags[i+1][1],options.ignoreNameSpace) : undefined,
            attrsStr = tags[i][2], attrs,
            val = tags[i][4] ===  undefined ? tags[i][6] :  simplifyCDATA(tags[i][0]);
        if(tag.indexOf("/") === 0){//ending tag
            currentNode = currentNode.parent;
            continue;
        }

        var selfClosingTag = attrsStr.charAt(attrsStr.length-1) === '/';
        var childNode = new xmlNode(tag,currentNode);

        if(selfClosingTag){
            attrs = buildAttributesArr(attrsStr,options.ignoreTextNodeAttr,options.attrPrefix,options.attrNodeName,options.ignoreNameSpace,options.textAttrConversion);
            childNode.val = attrs || "";
            currentNode.addChild(childNode);
        }else if( ("/" + tag) === nexttag){ //Text node
            attrs = buildAttributesArr(attrsStr,options.ignoreTextNodeAttr,options.attrPrefix,options.attrNodeName,options.ignoreNameSpace,options.textAttrConversion);
            val = parseValue(val,options.textNodeConversion);
            if(attrs){
                attrs[options.textNodeName] = val;
                childNode.val = attrs;
            }else{
                if(val !== undefined && val != null){
                    childNode.val = val;    
                }else{
                    childNode.val = "";
                }
            }
            currentNode.addChild(childNode);
            i++;
        }else{//starting tag
            attrs = buildAttributesArr(attrsStr,options.ignoreNonTextNodeAttr,options.attrPrefix,options.attrNodeName,options.ignoreNameSpace,options.textAttrConversion);
            if(attrs){
                for (var prop in attrs) {
                  if(attrs.hasOwnProperty(prop)){
                    childNode.addChild(new xmlNode(prop,childNode,attrs[prop]));
                  }
                }
            }
            currentNode.addChild(childNode);
            currentNode = childNode;
        }
    }
    return xmlObj;
};

var xml2json = function (xmlData,options){
    return convertToJson(getTraversalObj(xmlData,options), buildOptions(options).arrayMode);
};

var cdRegx = new RegExp(cdataRegx,"g");

function simplifyCDATA(cdata){
    var result = getAllMatches(cdata,cdRegx);
    var val = "";
    for (var i = 0; i < result.length ; i++) {
        val+=result[i][1];
    }
    return val;
}

function resolveNameSpace(tagname,ignore){
    if(ignore){
        var tags = tagname.split(":");
        var prefix = tagname.charAt(0) === "/" ? "/" : "";
        if(tags.length === 2) {
            tagname = prefix + tags[1];
        }
    }
    return tagname;
}

function parseValue(val,conversion){
    if(val){
        if(!conversion || isNaN(val)){
            val = "" + val ;
        }else{
            if(val.indexOf(".") !== -1){
                val = Number.parseFloat(val);
            }else{
                val = Number.parseInt(val,10);
            }
        }
    }else{
        val = "";
    }
    return val;
}

//var attrsRegx = new RegExp("(\\S+)=\\s*[\"']?((?:.(?![\"']?\\s+(?:\\S+)=|[>\"']))+.)[\"']?","g");
//var attrsRegx = new RegExp("(\\S+)=\\s*(['\"])((?:.(?!\\2))*.)","g");
var attrsRegx = new RegExp("(\\S+)\\s*=\\s*(['\"])(.*?)\\2","g");
function buildAttributesArr(attrStr,ignore,prefix,attrNodeName,ignoreNS,conversion){
    attrStr = attrStr || attrStr.trim();
    
    if(!ignore && attrStr.length > 3){

        var matches = getAllMatches(attrStr,attrsRegx);
        var attrs = {};
        var attrsCollection = attrs;
        if(attrNodeName && matches.length){
            attrsCollection = attrs[attrNodeName] = {};
        }
        for (var i = 0; i < matches.length; i++) {
            var attrName = prefix + resolveNameSpace( matches[i][1],ignoreNS);
            attrsCollection[attrName] = parseValue(matches[i][3],conversion);
        }
        return attrs;
    }
}

var convertToJson = function (node, arrayMode){
    var jObj = {};
    if(node.val !== undefined && node.val != null || node.val === "") {
        return node.val;
    }else{
        for (var index = 0; index < node.child.length; index++) {
            var prop = node.child[index].tagname;
            var obj = convertToJson(node.child[index], arrayMode);
            if(jObj[prop] !== undefined){
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
    }
    return jObj;
};

exports.parse = xml2json;
exports.getTraversalObj = getTraversalObj;
exports.convertToJson = convertToJson;
exports.validate = require("./validator").validate;
