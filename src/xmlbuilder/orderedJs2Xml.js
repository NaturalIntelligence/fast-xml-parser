
function toXml(jObj, options){
    return arrToStr( [jObj], options);
}

function arrToStr(arr, options, level){
    let xmlStr = "";
    for (let i = 0; i < arr.length; i++) {
        const tagObj = arr[i];
        const tagName = propName(tagObj);
        const attStr = attr_to_str(tagObj.attributes, options);
        const propCount = Object.keys(tagObj[tagName]).length;

        let tagStart = `<${tagName}${attStr}`;
        let tagValue = "";
        if( propCount === 0){
            //xmlStr += "";
        }else  if(propCount === 1 && tagObj[tagName][0][options.textNodeName]){
            tagValue = options.tagValueProcessor( tagObj[tagName][0][options.textNodeName] );
        }else  if(propCount === 1 && tagObj[tagName][0][options.cdataTagName]){
            tagValue = `<![CDATA[${tagObj[tagName][0][options.cdataTagName]}]]`;
        }else{
            tagValue = arrToStr(tagObj[tagName], options, level + 1);;
        }

        if(tagValue.length === 0 && options.suppressEmptyNode){
            xmlStr += tagStart + "/>";
        }else{
            xmlStr += tagStart + `>${tagValue}</${tagName}>` ;
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
            attrStr+= ` ${attr.substr(options.attributeNamePrefix.length)}='${options.attrValueProcessor(attrMap[attr])}'`;
        }
    }
    return attrStr;
}

module.exports = toXml;