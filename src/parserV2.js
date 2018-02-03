var util = require("./util");
var he = require("he");

var defaultOptions = {
    attrPrefix : "@_",                           //prefix for attributes
    attrNodeName: false,                    //Group attributes in separate node
    textNodeName : "#text",              //Name for property which will have value of the node in case nested nodes are present, or attributes
    //ignoreNonTextNodeAttr : true,       //removed
    //ignoreTextNodeAttr : true,
    ignoreAttributes : true,                           //ignore attributes
    allowBooleanAttributes : false,     //A tag can have attributes without any value
    ignoreNameSpace : false,
    ignoreRootElement : false,
    convertNodeValue : true,              //convert the value of node to primitive type. E.g. "2" -> 2
    convertAttributeValue : false,               //convert the value of attribute to primitive type. E.g. "2" -> 2
    arrayMode : false
};

//considerations
//if convertNodeValue === true but node has CDATA, the value will not be coverted
//Node value will be by default HTML decoded exclucing CDATA part.


var buildOptions = function (options){
    if(!options) options = {};
    var props = ["attrPrefix","attrNodeName","ignoreAttributes","ignoreNameSpace","ignoreRootElement","textNodeName","convertNodeValue","convertAttributeValue","arrayMode"];
    for (var i = 0; i < props.length; i++) {
        if(options[props[i]] === undefined){
            options[props[i]] = defaultOptions[props[i]];
        }
    }
    return options;
};


//var tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
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
                //console.log(attrStr, attrStr);

                if(attrStr[attrStr.length-1] === "/" ){//self closing tag
                    attrStr = attrStr.substring(0,attrStr.length-1);
                    //console.log(attrStr);

                    var operationResult = fillWithAttributes(currentObject[tagName],attrStr,options);
                    if(operationResult.err !== undefined){
                        return operationResult.err;
                    }else{
                        continue;
                    }

                }else if(closingTag){
                    if(attrStr.trim().length > 0){
                        return { err: { code:"InvalidTag",msg:"closing tag " + tagName + " can't have attributes."}};
                        //throw new Error("XML validation error: closing tag should not have any attribute");
                    }else{
                        var otg = tags.pop();
                        nodes.pop();
                        currentObject= nodes[nodes.length -1];
                        //console.log(JSON.stringify(currentObject,null,4));
                        if(tagName !== otg){
                            return { err: { code:"InvalidTag",msg:"closing tag " + otg + " is expected inplace of "+tagName+"."}};
                        }
                    }
                }else{
                    tags.push(tagName);
                    currentObject[tagName] = {};
                    var operationResult = fillWithAttributes(currentObject[tagName],attrStr,options);
                    if(operationResult.err !== undefined){
                        return operationResult.err;
                    }else{
                        nodes.push(currentObject[tagName]);
                        currentObject= currentObject[tagName];
                    }
                }

                //skip tag text value
                //It may include comments and CDATA value
                var vals = [];
                var val = ""
                var cdatapresent = false;
                for(i++;i < xmlData.length ; i++){
                    if(xmlData[i] === "<"){
                        if(xmlData[i+1] === "!"){//comment or CADATA
                            i++;
                            var end_index = readCommentAndCDATA(xmlData,i);
                            if(xmlData[i+1] === '['){
                                cdatapresent = true;
                                vals.push(he.decode(val, { strict:true})); val = "";
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
                vals.push(he.decode(val, { strict:true}));
                val = vals.join("");
                if(xmlData[i] === "<") i--;
                if(val !== ""){
                    if(cdatapresent || !options.convertNodeValue)
                        currentObject[options.textNodeName] = val;
                    else
                        currentObject[options.textNodeName] = parseValue(val);
                }
            }
        }else{

            if(xmlData[i] === " " || xmlData[i] === "\t") continue;
            return { err: { code:"InvalidChar",msg:"char " + xmlData[i] +" is not expected ."}};
        }
    }


    if(tags.length > 0){
        return { err: { code:"InvalidXml",msg:"Invalid " + JSON.stringify(tags,null,4) +" found."}};
    }
    currentObject=nodes.pop();
    //console.log(currentObject);
    //console.log(JSON.stringify(currentObject,null,4));
    return { "json" : currentObject};
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

    var attrObj = validateAndBuildAttributes(attrStr,options);
    if(attrObj.err !== undefined){
        return attrObj.err;
    }else if(!options.ignoreAttributes){
        if(options.attrNodeName === false){//Group attributes as separate property
            for (var attr in attrObj) { node[attr] = attrObj[attr]; }
        }else{
            node[options.attrNodeName] = attrObj;
        }
    }
    return true;
}
/**
 * Select all the attributes whether valid or invalid.
 */
var validAttrStrRegxp = new RegExp("(\\s*)([^\\s=]+)\\s*(=)?(\\s*(['\"])((.|\\n)*?)\\5)?", "g");

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAndBuildAttributes(attrStr,options){

    attrNamePrefix = options.attrNamePrefix === undefined ? "" : options.attrNamePrefix;

    var matches = util.getAllMatches(attrStr,validAttrStrRegxp);
    var attrNames = [];
    var attrObj = {};

    for(var i=0;i<matches.length;i++){
        if(matches[i][1].length === 0){//nospace before attribute name: a="sd"b="saf"
            return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no space in starting."}};
        }else if(matches[i][3] === undefined && !options.allowBooleanAttributes){//independent attribute: ab 
            return { err: { code:"InvalidAttr",msg:"boolean attribute " + matches[i][2] + " is not allowed."}};
        }else if(matches[i][6] === undefined){//attribute without value: ab=
            return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
        }
        attrName=matches[i][2];
        if(!validateAttrName(attrName)){
            return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has an invalid name."}};
        }
        if(!attrNames.hasOwnProperty(attrName)){//check for duplicate attribute.
            attrNames[attrName]=1;
        }else{
            return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " is repeated."}};
        }
        
        if(options.convertAttributeValue){
            attrObj[attrNamePrefix + matches[i][2]] = parseValue( he.decode(matches[i][6], {isAttributeValue:true, strict:true}),true);
        }
        else{
            attrObj[attrNamePrefix + matches[i][2]] = he.decode(matches[i][6], {isAttributeValue:true, strict:true});
        }
    }

    //console.log(attrObj);
    return attrObj;
    
}

function parseValue(val,isAttribute){
    if(val){
        if(isNaN(val)){
            val = "" + val;
            if(isAttribute) {
                val = val.replace(/\r?\n/g, " ");
            }
        }else{//Number
            if(val.indexOf(".") !== -1){
                if(parseFloat){
                    val = parseFloat(val);
                }else{//IE support
                    val = Number.parseFloat(val);
                }
            }else{
                if(parseInt){
                    val = parseInt(val,10);
                }else{//IE support
                    val = Number.parseInt(val,10);
                }
            }
        }
    }else{
        val = "";
    }
    return val;
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


