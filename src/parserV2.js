var util = require("./util");

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


var tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.parse = function(xmlData, options){
    options = buildOptions(options);    
    
    xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
    xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
    xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE

    var tags = [];
    var nodes = [];
    var currentObject = {};
    nodes.push(currentObject);
    for (var i = 0; i < xmlData.length; i++) {

        if(xmlData[i] === "<"){//starting of tag
            //read until you reach to '>' avoiding any '>' in attribute value

            i++;

            if(xmlData[i] === "!"){
                i = readCommentAndCDATA(xmlData,i); //comments only
                continue;
            }else{
                var closingTag = false;
                if(xmlData[i] === "/"){//closing tag
                    closingTag = true;
                    i++;
                }
                //read tagname
                var tagName = "";
                for(;i < xmlData.length
                    && xmlData[i] !== ">"
                    && xmlData[i] !== " "
                    && xmlData[i] !== "\t" ; i++) {

                    tagName +=xmlData[i];
                }
                tagName = tagName.trim();
                //console.log(tagName);

                if(tagName[tagName.length-1] === "/"){//self closing tag without attributes
                    tagName = tagName.substring(0,tagName.length-1);
                    currentObject[tagName] = {};
                    continue;
                }
                if(!validateTagName(tagName)) return false;


                var attrStr = "";
                var startChar = "";
                for(;i < xmlData.length ;i++){
                    if(xmlData[i] === '"' || xmlData[i] === "'"){
                        if(startChar === ""){
                            startChar = xmlData[i];
                        }else{
                            startChar = "";
                        }
                    }else if(xmlData[i] === ">"){
                        if(startChar === ""){
                            break;
                        }
                    }
                    attrStr += xmlData[i];
                }
                if(startChar !== "") return false;//open quote
                //attrStr = attrStr.trim();
                //console.log(attrStr, attrStr);

                if(attrStr[attrStr.length-1] === "/" ){//self closing tag
                    attrStr = attrStr.substring(0,attrStr.length-1);
                    //console.log(attrStr);

                    var operationResult = fillWithAttributes(currentObject[tagName],attrStr,options);
                    if(operationResult === false){
                        return false;
                    }else{
                        continue;
                    }

                }else if(closingTag){
                    if(attrStr.trim().length > 0){
                        return false;
                        //throw new Error("XML validation error: closing tag should not have any attribute");
                    }else{
                        var otg = tags.pop();
                        nodes.pop();
                        currentObject= nodes[nodes.length -1];
                        //console.log(JSON.stringify(currentObject,null,4));
                        if(tagName !== otg){
                            return false;
                            //throw new Error("XML validation error: no mathicng closing tag");
                        }
                    }
                }else{
                    tags.push(tagName);
                    currentObject[tagName] = {};
                    var operationResult = fillWithAttributes(currentObject[tagName],attrStr,options);
                    if(operationResult === false){
                        return false;
                    }else{
                        nodes.push(currentObject[tagName]);
                        currentObject= currentObject[tagName];
                        //continue;
                    }
                }

                //skip tag text value
                //It may include comments and CDATA value
                var vals = [];
                var val = ""
                for(i++;i < xmlData.length ; i++){
                    if(xmlData[i] === "<"){
                        if(xmlData[i+1] === "!"){//comment or CADATA
                            i++;
                            var end_index = readCommentAndCDATA(xmlData,i);
                            if(xmlData[i+1] === '['){
                                vals.push(val); val = "";
                                var cdataVal = xmlData.substring(i+8,end_index-2);
                                vals.push(cdataVal);
                            }else{
                                //skip
                            }
                            i=end_index;
                            continue;
                        }else{
                            break;
                        }
                    }else{
                        val += xmlData[i] ;
                    }
                }//end of reading tag text value
                vals.push(val);
                val = vals.join("");
                if(xmlData[i] === "<") i--;
                if(val !== "")
                    currentObject["#text"] = val;
            }
        }else{

            if(xmlData[i] === " " || xmlData[i] === "\t") continue;
            return false;
        }
    }


    if(tags.length > 0){
        return false;
        //throw new Error("XML validation error");
    }
    currentObject=nodes.pop();
    //console.log(currentObject);
    console.log(JSON.stringify(currentObject,null,4));
    return true;
}

function readCommentAndCDATA(xmlData,i){
    if(xmlData.length > i+5 && xmlData[i+1] === "-" && xmlData[i+2] === "-"){//comment
        for(i+=3;i<xmlData.length;i++){
            if(xmlData[i] === "-" && xmlData[i+1] === "-" && xmlData[i+2] === ">"){
                i+=2;
                break;
            }
        }
    }else if( xmlData.length > i+9
        && xmlData[i+1] === "["
        && xmlData[i+2] === "C"
        && xmlData[i+3] === "D"
        && xmlData[i+4] === "A"
        && xmlData[i+5] === "T"
        && xmlData[i+6] === "A"
        && xmlData[i+7] === "["){

        for(i+=8;i<xmlData.length;i++){
            if(xmlData[i] === "]" && xmlData[i+1] === "]" && xmlData[i+2] === ">" ){
                i+=2;
                break;
            }
        }
    }

    return i;
}


function fillWithAttributes(node,attrStr,options){

    var attrObj = validateAttributeString(attrStr,options.attrPrefix);
    if(attrObj === false){
        return false;
    }else{
        if(options.attrNodeName === false){//Group attributes as separate property
            for (var attr in attrObj) { node[attr] = attrObj[attr]; }
        }else{
            node[options.attrNodeName] = attrObj;
        }
        return true;
    }
}
/**
 * Select all the attributes whether valid or invalid.
 */
var validAttrStrRegxp = new RegExp("(\\s*)([^\\s=]+)\\s*(=)?(\\s*(['\"])((.|\\n)*?)\\5)?", "g");

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr,attrNamePrefix){

    attrNamePrefix = attrNamePrefix === undefined ? "" : attrNamePrefix;

    var matches = util.getAllMatches(attrStr,validAttrStrRegxp);
    var attrNames = [];
    var attrObj = {};

    for(var i=0;i<matches.length;i++){
        if(matches[i][1].length === 0){//nospace before attribute name: a="sd"b="saf"
            return false;
        }else if(matches[i][3] === undefined){//independent attribute: ab 
            return false;
        }else if(matches[i][6] === undefined){//attribute without value: ab=
            return false;
        }
        attrName=matches[i][2];
        if(!validateAttrName(attrName)){
            return false;
        }
        if(!attrNames.hasOwnProperty(attrName)){//check for duplicate attribute.
            attrNames[attrName]=1;
        }else{
            return false;
        }
        attrObj[attrNamePrefix + matches[i][2]] = matches[i][6];
    }

    //console.log(attrObj);
    return attrObj;
    
}

var validAttrRegxp = new RegExp("^[_a-zA-Z][\\w\\-\\.\\:]*$");


function validateAttrName(attrName){
    return util.doesMatch(attrName,validAttrRegxp);
}
//var startsWithXML = new RegExp("^[Xx][Mm][Ll]");
var startsWith = new RegExp("^([a-zA-Z]|_)[\\w\.\\-_:]*");

function validateTagName(tagname){
    /*if(util.doesMatch(tagname,startsWithXML)) return false;
    else*/ if(util.doesNotMatch(tagname,startsWith)) return false;
    else return true;
}


