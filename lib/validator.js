var getAllMatches = require("./util").getAllMatches;
var InvalidXmlException = require("./InvalidXmlException");

var validate = function (xmlData){
    xmlData = xmlData.replace(/\s/g, " ");
    var eStack = [];
    var currentTag = "";
    var lineNum = 1;
    for (var i = 0; i < xmlData.length;i++) {
        if(xmlData[i] === "\n"){
            lineNum++;
        }else if(xmlData[i] === '<'){
            if(xmlData[i+1] === " "){//comment tag
                throw new InvalidXmlException("Invalid tag at "+ lineNum + ":" + i);
            }else if(xmlData[i+1] === "!"){//comment tag
                var comment = getCommentTag(xmlData,i,lineNum);
                i+=comment.length-1;
            }else if(xmlData[i+1] === "/"){//closing tag
                i+=2;
                currentTag = getEndTagName(xmlData,i,lineNum);
                if(eStack[eStack.length-1] !== currentTag){
                    throw new InvalidXmlException("closing tag is not matching at "+ lineNum + ":" + i);
                }else{
                    eStack.pop();
                }
                i+=currentTag.length;
            }else{
                currentTag = getTagName(xmlData,++i);
                i+=currentTag.length;
                var attrStr = getAttrStr(xmlData,i,lineNum);
                if(attrStr && attrStr[attrStr.length-1] === "/"){
                    i+=attrStr.length;
                }else{
                    eStack.push(currentTag);
                }
                var text = getvalue(xmlData,++i);
                i+=text.length-1;
            }
        }
    }
    if(eStack.length === 0)
        return true;
    else
        throw new InvalidXmlException("closing tag is missing for "+ eStack);
}

function getCommentTag(xmlData,startIndex,lineNum){
    for (var i = startIndex; i < xmlData.length; i++){
        if(xmlData[i] === "-" && xmlData[i+1] === "-" && xmlData[i+2] === ">") break;
    }
    if(xmlData.substr(startIndex,4) === "<!--" && xmlData.substr(i,3) === "-->")
        return xmlData.substring(startIndex,i);
    else
        throw new InvalidXmlException("Invalid comment tag at " + lineNum +":"+ startIndex);
}

function getEndTagName(xmlData,startIndex,lineNum){
    xmlData = xmlData.replace(/\s/g, " ");for (var i = startIndex; i < xmlData.length && xmlData[i] !== " " && xmlData[i] !== ">"; i++);
    if(xmlData[i-1] !== ">"){
        for(var j=i;j<xmlData.length && xmlData[j] !== ">"; j++){
            if(xmlData[j] !== " ")
                throw new InvalidXmlException("Invalid closing tag at " + lineNum +":"+ startIndex);
        }
    }
    return xmlData.substring(startIndex,i);
}

var attrsRegx1 = new RegExp('(?:[\\s]+([\\w:\-]+)[\\s]*=[\\s]*"([^"]*)")',"g");
var attrsRegx2 = new RegExp("(?:[\\s]+([\\w:\-]+)[\\s]*=[\\s]*'([^']*)')","g");
var attrNamesRegx = new RegExp("([\\w: \-]+)[\\s]*=","g");

/**
 * Repeated attributes are not allowed
 * if attribute value is enclosed in \' there can't be \' in value
 * if attribute value is enclosed in \" there can't be \" in value
 * there should be space between 2 attributs
 * attribute name can't have space, \', \", =
 */
function getAttrStr(xmlData,startIndex,lineNum){
    for (var i = startIndex; i < xmlData.length && xmlData[i] !== ">"; i++);
    if(xmlData[i] === ">"){
        var attrStr = xmlData.substring(startIndex,i);
        //attrStr = attrStr.trim();
        if(attrStr.length > 4){ //a=""
            var attrs = getListOfAttrsName([],attrStr,attrsRegx1,startIndex,lineNum);
            attrs = getListOfAttrsName(attrs,attrStr,attrsRegx2,startIndex,lineNum);

            var matches = getAllMatches(attrStr,attrNamesRegx);
            for (var i = 0; i < matches.length; i++) {
                var attrName = matches[i][1].trim();
                if(!attrs[attrName])
                    throw new InvalidXmlException("Invalid arguments at " + lineNum +":"+ startIndex);
            }
        }
        return attrStr;
    }else{
        throw new InvalidXmlException("Not closing tag at " + lineNum +":"+ startIndex);
    }
    
}

function getListOfAttrsName(attrs,attrStr,attrsRegx,startIndex,lineNum){
    var matches = getAllMatches(attrStr,attrsRegx);
    for (var i = 0; i < matches.length; i++) {
        var attrName = matches[i][1];
        if(!attrs[attrName])
            attrs[attrName] = true;
        else
            throw new InvalidXmlException("Argument "+ attrName +" is redefined at " + lineNum +":"+ startIndex);
    }
    return attrs;
}

function getTagName(xmlData,startIndex){
    for (var i = startIndex; i < xmlData.length; i++){
        if(xmlData[i] === " " || xmlData[i] === ">" || (xmlData[i] === "/" && xmlData[i+1] === ">")) break;
    }
    return xmlData.substring(startIndex,i);
}

function getvalue(xmlData,startIndex){
    for (var i = startIndex; i < xmlData.length && xmlData[i] !== "<"; i++);
    return xmlData.substring(startIndex,i);
}

exports.validate = validate;
