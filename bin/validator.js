var util = require("./util");


var tagsPattern = new RegExp("<\\/?([\\w:\\-_\.]+)\\s*\/?>","g");
exports.validate = function(xmlData){
    xmlData = xmlData.replace(/\n/g,"");//make it single line
    xmlData = xmlData.replace(/(<!\[CDATA\[.*?\]\]>)/g,"");//Remove all CDATA
    xmlData = xmlData.replace(/(<!--.*?(?:-->))/g,"");//Remove all comments
    if(validateAttributes(xmlData) !== true) return false;
    xmlData = xmlData.replace(/(\s+(?:[\w:\-]+)\s*=\s*(['\"]).*?\2)/g,"");//Remove all attributes
    xmlData = xmlData.replace(/(^\s*<\?xml\s*\?>)/g,"");//Remove XML starting tag
    if(xmlData.indexOf("<![CDATA[") > 0 || xmlData.indexOf("<!--") > 0 ) return false;
    var tags = util.getAllMatches(xmlData,tagsPattern);
    if(tags.length === 0) return false; //non xml string
    
    var result = checkForMatchingTag(tags,0);
    

    if(result !== true) return false; else return true; 
    
}


var startsWithXML = new RegExp("^[Xx][Mm][Ll]");
var startsWith = new RegExp("^([a-zA-Z]|_)[\\w\.\\-_:]*");

function validateTagName(tagname){
    if(util.doesMatch(tagname,startsWithXML)) return false;
    else if(util.doesNotMatch(tagname,startsWith)) return false;
    else return true;
}

var attrStringPattern = new RegExp("<[\\w:\\-_\.]+(.*?)\/?>","g");
var attrPattern = new RegExp("\\s+([\\w:\-]+)\\s*=\\s*(['\"])(.*?)\\2","g");
function validateAttributes(xmlData){
    var attrStrings = util.getAllMatches(xmlData,attrStringPattern);
    for (i=0;i<attrStrings.length;i++){
        if(attrStrings[i][1].trim().length > 0 && attrStrings[i][1].trim().length < 4){ //invalid attributes 
            return false;
        }else if(attrStrings[i][1].trim().length !== 0){
            var attrsList = util.getAllMatches(attrStrings[i][1],attrPattern);
            var attrNames=[];
            for (j=0;j<attrsList.length;j++){
                if(attrNames.hasOwnProperty(attrsList[j][1])){//duplicate attributes
                    return false;
                }else{
                    attrNames[attrsList[j][1]]=1;
                    //validate attribute value
                    //if(!validateAttrValue(attrsList[3])) return false;
                }
            }
        }
    }
    return true;
}

function checkForMatchingTag(tags,i){
    if(tags.length === i) {
        return true;
    }else if(tags[i][0].indexOf("</") === 0) {//closing tag
        return i;
    }else if(tags[i][0].indexOf("/>") === tags[i][0].length-2){//Self closing tag
        if(validateTagName(tags[i][0].substring(1)) === false) return -1;
        return checkForMatchingTag(tags,i+1);

    }else if(tags.length > i+1){
        if(tags[i+1][0].indexOf("</") === 0){//next tag
            if(validateTagName(tags[i][1]) === false) return -1;
            if(tags[i][1] === tags[i+1][1]) {//matching with next closing tag
                return checkForMatchingTag(tags,i+2);
            }else {
                return -1;//not matching
            }
        }else
            var nextIndex = checkForMatchingTag(tags,i+1);
            if(nextIndex !== -1 && tags[nextIndex][0].indexOf("</") === 0){
                if(validateTagName(tags[i][1]) === false) return -1;
                if(tags[i][1] === tags[nextIndex][1]) {
                    return checkForMatchingTag(tags,nextIndex+1);
                }else {
                    return -1;//not matching
                }
            }
    }
    return -1;
}

