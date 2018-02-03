var util = require("./util");


var tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function(xmlData){
    xmlData = xmlData.replace(/(\r\n|\n|\r)/gm,"");//make it single line
    xmlData = xmlData.replace(/(^\s*<\?xml.*?\?>)/g,"");//Remove XML starting tag
    xmlData = xmlData.replace(/(<!DOCTYPE[\s\w\"\.\/\-\:]+(\[.*\])*\s*>)/g,"");//Remove DOCTYPE

    var tags = [];
    for (var i = 0; i < xmlData.length; i++) {

        if(xmlData[i] === "<"){//starting of tag
            //read until you reach to '>' avoiding any '>' in attribute value

            i++;

            if(xmlData[i] === "!"){
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
                //console.log(attrStr);

                if(attrStr[attrStr.length-1] === "/" ){//self closing tag
                    attrStr = attrStr.substring(0,attrStr.length-1);
                    if(!validateAttributeString(attrStr)){
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
                        if(tagName !== otg){
                            return false;
                            //throw new Error("XML validation error: no mathicng closing tag");
                        }
                    }
                }else{
                    if(!validateAttributeString(attrStr)){
                        return false;
                    }
                    tags.push(tagName);
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

            if(xmlData[i] === " " || xmlData[i] === "\t") continue;
            return false;
        }
    }


    if(tags.length > 0){
        return false;
        //throw new Error("XML validation error");
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
 * Select all the attributes whether valid or invalid.
 */
var validAttrStrRegxp = new RegExp("(\\s*)([^\\s=]+)\\s*(=)?(\\s*(['\"])((.|\\n)*?)\\5)?", "g");

//attr, ="sd", a="amit's", a="sd"b="saf", ab  cd=""

function validateAttributeString(attrStr){
    //console.log("start:"+attrStr+":end");

    //if(attrStr.trim().length === 0) return true; //empty string

    var matches = util.getAllMatches(attrStr,validAttrStrRegxp);
    var attrNames = [];


    for(var i=0;i<matches.length;i++){
        //console.log(matches[i]);
        
        if(matches[i][1].length === 0){//nospace before attribute name: a="sd"b="saf"
            return false;
        }else if(matches[i][3] === undefined){//independent attribute: ab 
            return false;
        }else if(matches[i][6] === undefined){//attribute without value: ab=
            return false;
        }
        attrName=matches[i][2];
        if(!validateAttrName(attrName)){
            //console.log("seems invalid");
            return false;
        }
        if(!attrNames.hasOwnProperty(attrName)){//check for duplicate attribute.
            attrNames[attrName]=1;
        }else{
            return false;
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


