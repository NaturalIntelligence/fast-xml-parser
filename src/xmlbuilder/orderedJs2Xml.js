const {EOL} = require('os');

function toXml(jObj, options){
    return arrToStr( [jObj], options, 0);
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
            xmlStr += options.tagValueProcessor( tagName, tagObj[tagName]);
            continue;
        }else if( tagName === options.cdataTagName){
            xmlStr += `<![CDATA[${tagObj[tagName][0][options.textNodeName]}]]>`;
            continue;
        }
        const attStr = attr_to_str(tagObj.attributes, options);
        let leafNode = false;
        let tagStart =  indentation + `<${tagName}${attStr}`;
        let tagValue = arrToStr(tagObj[tagName], options, level + 1);
        if( (!tagValue || tagValue.length === 0) && options.suppressEmptyNode){ 
            xmlStr += tagStart + "/>"; 
        }else if(leafNode) { 
            xmlStr += tagStart + `>${tagValue}</${tagName}>`; 
        }else{ 
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
            attrStr+= ` ${attr.substr(options.attributeNamePrefix.length)}='${options.attrValueProcessor(attr, attrMap[attr])}'`;
        }
    }
    return attrStr;
}

module.exports = toXml;