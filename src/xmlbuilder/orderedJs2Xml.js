const EOL = "\n";

/**
 * 
 * @param {array} jArray 
 * @param {any} options 
 * @returns 
 */
function toXml(jArray, options){
    return arrToStr( jArray, options, "", 0);
}

function arrToStr(arr, options, jPath, level){
    let xmlStr = "";

    let indentation = "";
    if(options.format && options.indentBy.length > 0){//TODO: this logic can be avoided for each call
        indentation = EOL + "" + options.indentBy.repeat(level);
    }

    for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        let newJPath = "";
        if(jPath.length === 0) newJPath = tagName
        else newJPath = `${jPath}.${tagName}`;

        if(tagName === options.textNodeName){
            let tagText = tagObj[tagName];
            if(!isStopNode(newJPath, options)){
                tagText = options.tagValueProcessor( tagName, tagText);
                tagText = replaceEntitiesValue(tagText, options);
            }
            xmlStr += indentation + tagText;
            continue;
        }else if( tagName === options.cdataPropName){
            xmlStr += indentation + `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
            continue;
        }else if( tagName === options.commentPropName){
            xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
            continue;
        }else if( tagName[0] === "?"){
            const attStr = attr_to_str(tagObj[":@"], options);
            const tempInd = tagName === "?xml" ? "" : indentation;
            let piTextNodeName = tagObj[tagName][0][options.textNodeName];
            piTextNodeName = piTextNodeName.length !== 0 ? " " + piTextNodeName : ""; //remove extra spacing
            xmlStr += tempInd + `<${tagName}${piTextNodeName}${attStr}?>`;
            continue;
        }
        const attStr = attr_to_str(tagObj[":@"], options);
        let tagStart =  indentation + `<${tagName}${attStr}`;
        let tagValue = arrToStr(tagObj[tagName], options, newJPath, level + 1);
        if(options.unpairedTags.indexOf(tagName) !== -1){
            if(options.suppressUnpairedNode)  xmlStr += tagStart + ">"; 
            else xmlStr += tagStart + "/>"; 
        }else if( (!tagValue || tagValue.length === 0) && options.suppressEmptyNode){ 
            xmlStr += tagStart + "/>"; 
        }else{ 
            //TODO: node with only text value should not parse the text value in next line
            xmlStr += tagStart + `>${tagValue}${indentation}</${tagName}>` ;
        }
    }
    
    return xmlStr;
}

function propName(obj){
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      if(key !== ":@") return key;
    }
  }

function attr_to_str(attrMap, options){
    let attrStr = "";
    if(attrMap && !options.ignoreAttributes){
        for (let attr in attrMap){
            let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
            attrVal = replaceEntitiesValue(attrVal, options);
            if(attrVal === true && options.suppressBooleanAttributes){
                attrStr+= ` ${attr.substr(options.attributeNamePrefix.length)}`;
            }else{
                attrStr+= ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
            }
        }
    }
    return attrStr;
}

function isStopNode(jPath, options){
    jPath = jPath.substr(0,jPath.length - options.textNodeName.length - 1);
    let tagName = jPath.substr(jPath.lastIndexOf(".") + 1);
    for(let index in options.stopNodes){
        if(options.stopNodes[index] === jPath || options.stopNodes[index] === "*."+tagName) return true;
    }
    return false;
}

function replaceEntitiesValue(textValue, options){
    if(textValue && textValue.length > 0 && options.processEntities){
      for (let i=0; i< options.entities.length; i++) {
        const entity = options.entities[i];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }
module.exports = toXml;