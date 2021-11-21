const {EOL} = require('os');

/**
 * 
 * @param {array} jArray 
 * @param {any} options 
 * @returns 
 */
function toXml(jArray, options){
    return arrToStr( jArray, options, 0);
}

function arrToStr(arr, options, level){
    let xmlStr = "";

    let indentation = "";
    if(options.format && options.indentBy.length > 0){//TODO: this logic can be avoided for each call
        indentation = EOL + "" + options.indentBy.repeat(level);
    }

    for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);

        if(tagName === options.textNodeName){
            let tagText = options.tagValueProcessor( tagName, tagObj[tagName]);
            tagText = replaceEntitiesValue(tagText, options);
            xmlStr += indentation + tagText;
            continue;
        }else if( tagName === options.cdataPropName){
            xmlStr += indentation + `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
            continue;
        }else if( tagName === options.commentPropName){
            xmlStr += indentation + `<!--${tagObj[tagName][0][options.textNodeName]}-->`;
            continue;
        }
        const attStr = attr_to_str(tagObj.attributes, options);
        let tagStart =  indentation + `<${tagName}${attStr}`;
        let tagValue = arrToStr(tagObj[tagName], options, level + 1);
        if( (!tagValue || tagValue.length === 0) && options.suppressEmptyNode){ 
            if(options.unpairedTags.indexOf(tagName) !== -1){
                xmlStr += tagStart + ">"; 
            }else{
                xmlStr += tagStart + "/>"; 
            }
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
      if(key !== "attributes") return key;
    }
  }

function attr_to_str(attrMap, options){
    let attrStr = "";
    if(attrMap && !options.ignoreAttributes){
        for( attr in attrMap){
            let attrVal = options.attributeValueProcessor(attr, attrMap[attr]);
            attrVal = replaceEntitiesValue(attrVal, options);
            attrStr+= ` ${attr.substr(options.attributeNamePrefix.length)}="${attrVal}"`;
        }
    }
    return attrStr;
}

function replaceEntitiesValue(textValue, options){
    if(textValue && textValue.length > 0 && options.processEntities){
      for (const entityName in options.entities) {
        const entity = options.entities[entityName];
        textValue = textValue.replace(entity.regex, entity.val);
      }
    }
    return textValue;
  }
module.exports = toXml;