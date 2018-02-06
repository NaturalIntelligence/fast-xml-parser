var util = require("./util");


var defaultOptions = {
    allowBooleanAttributes : false,         //A tag can have attributes without any value
};

var buildOptions = function (options){
    if(!options) options = {};
    var props = ["allowBooleanAttributes"];
    for (var i = 0; i < props.length; i++) {
        if(options[props[i]] === undefined){
            options[props[i]] = defaultOptions[props[i]];
        }
    }
    return options;
};


var tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function(xmlData, options){
    options = buildOptions(options);   

    //xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
    //xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
    //xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE

    var tags = [];
    var tagFound = false;
    for (var i = 0; i < xmlData.length; i++) {

        if(xmlData[i] === "<"){//starting of tag
            //read until you reach to '>' avoiding any '>' in attribute value

            i++;
            if(xmlData[i] === "?"){
                if(i !== 1){
                    return {err : { code : "InvalidXml", msg : "XML declaration allowed only at the start of the document."}};
                }else{
                    //read until ?> is found
                    for(;i<xmlData.length;i++){
                        if(xmlData[i] == "?" && xmlData[i+1] == ">"){
                            i++;
                            break;
                        }
                    }
                }
            }else if(xmlData[i] === "!"){
                i = readCommentAndCDATA(xmlData,i);
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
                    continue;
                }
                if(!validateTagName(tagName)) 
                return { err: { code:"InvalidTag",msg:"Tag " + tagName + " is an invalid name."}};


                var result = readAttributeStr(xmlData,i);
                if(result === false) {
                    return { err: { code:"InvalidAttr",msg:"Attributes for " + tagName + " have open quote"}};
                }
                var attrStr = result.value;
                i = result.index;

                if(attrStr[attrStr.length-1] === "/" ){//self closing tag
                    attrStr = attrStr.substring(0,attrStr.length-1);
                    var isValid = validateAttributeString(attrStr, options);
                    if(isValid === true){
                        tagFound = true;
                        continue;
                    }else{
                        return isValid;
                    }
                }else if(closingTag){
                    if(attrStr.trim().length > 0){
                        return { err: { code:"InvalidTag",msg:"closing tag " + tagName + " can't have attributes or invalid starting."}};
                    }else{
                        var otg = tags.pop();
                        if(tagName !== otg){
                            return { err: { code:"InvalidTag",msg:"closing tag " + otg + " is expected inplace of "+tagName+"."}};
                        }
                    }
                }else{
                    var isValid = validateAttributeString(attrStr, options);
                    if(isValid !== true ){
                        return isValid;
                    }
                    tags.push(tagName); tagFound = true;
                }

                //skip tag text value
                //It may include comments and CDATA value
                for(i++;i < xmlData.length ; i++){
                    if(xmlData[i] === "<"){
                        if(xmlData[i+1] === "!"){//comment or CADATA
                            i++;
                            i = readCommentAndCDATA(xmlData,i);
                            continue;
                        }else{
                            break;
                        }
                    }
                }//end of reading tag text value
                if(xmlData[i] === "<") i--;
            }
        }else{

            if(xmlData[i] === " " || xmlData[i] === "\t" || xmlData[i] === "\n" || xmlData[i] === "\r") continue;
            return { err: { code:"InvalidChar",msg:"char " + xmlData[i] +" is not expected ."}};
        }
    }


    if(!tagFound){
        return {err : { code : "InvalidXml", msg : "Start tag expected."}};
    }else if(tags.length > 0){
        return { err: { code:"InvalidXml",msg:"Invalid " + JSON.stringify(tags,null,4).replace(/\r?\n/g,"") +" found."}};
    }

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
    }else if( xmlData.length > i+8
        && xmlData[i+1] === "D"
        && xmlData[i+2] === "O"
        && xmlData[i+3] === "C"
        && xmlData[i+4] === "T"
        && xmlData[i+5] === "Y"
        && xmlData[i+6] === "P"
        && xmlData[i+7] === "E"){
            var angleBracketsCount = 1;
            for(i+=8;i<xmlData.length;i++){
                if(xmlData[i] == "<") {angleBracketsCount++;}
                else if(xmlData[i] == ">") {
                    angleBracketsCount--;
                    if(angleBracketsCount === 0) break;
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

/**
 * Keep reading xmlData until '<' is found outside the attribute value.
 * @param {string} xmlData 
 * @param {number} i 
 */
function readAttributeStr(xmlData,i){
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
    if(startChar !== "") return false;

    return { value: attrStr, index: i};
}

/**
 * Select all the attributes whether valid or invalid.
 */
var validAttrStrRegxp = new RegExp("(\\s*)([^\\s=]+)(\\s*=)?(\\s*(['\"])((.|\\n)*?)\\5)?", "g");

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr,options){
    //console.log("start:"+attrStr+":end");

    //if(attrStr.trim().length === 0) return true; //empty string

    var matches = util.getAllMatches(attrStr,validAttrStrRegxp);
    var attrNames = [];
    var attrObj = {};


    for(var i=0;i<matches.length;i++){
        //console.log(matches[i]);
        
        if(matches[i][1].length === 0){//nospace before attribute name: a="sd"b="saf"
            return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no space in starting."}};
        }else if(matches[i][3] === undefined && !options.allowBooleanAttributes){//independent attribute: ab 
            return { err: { code:"InvalidAttr",msg:"boolean attribute " + matches[i][2] + " is not allowed."}};
        }/* else if(matches[i][6] === undefined){//attribute without value: ab=
            return { err: { code:"InvalidAttr",msg:"attribute " + matches[i][2] + " has no value assigned."}};
        } */
        var attrName=matches[i][2];
        if(!validateAttrName(attrName)){
            return { err: { code:"InvalidAttr",msg:"attribute " + attrName + " is an invalid name."}};
        }
        if(!attrNames.hasOwnProperty(attrName)){//check for duplicate attribute.
            attrNames[attrName]=1;
        }else{
            return { err: { code:"InvalidAttr",msg:"attribute " + attrName + " is repeated."}};
        }
    }

    return true;
    
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


