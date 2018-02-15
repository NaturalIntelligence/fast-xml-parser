//parse Empty Node as self closing node

var defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: false,
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,         //a tag can have attributes without any value
    //ignoreRootElement : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    arrayMode : false,
    trimValues: true,                                //Trim string values of tag and attributes 
    decodeHTMLchar: false,
    cdataTagName: false,
    cdataPositionChar: "\\c"
    //decodeStrict: false,
};

function Parser(options){
    this.options = Object.assign({},defaultOptions,options);
    if(this.options.ignoreAttributes) {
        this.isAttribute = a => false;
    }else{
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
    }
}


Parser.prototype.parse = function(jObj){
    return this.j2x(jObj).val;
    /* if(options.ignoreAttributes){
        //don't check for attribute prefix of attribute group
    }else if(options.attrNodeName) {
        //then avoid checking for prefix
    }else{
        //then check each property if it is prefixed with options.attributeNamePrefix
    }

    if(options.allowBooleanAttributes){
        //then 
    } */
}

Parser.prototype.j2x = function(jObj){
    var xmlStr = "", attrStr = "" , val = "";
    var keys = Object.keys(jObj);
    var len = keys.length;
    for(var i=0;i<len;i++){
        var key = keys[i];
        if(typeof jObj[key] !== "object"){//premitive type
            var attr = this.isAttribute(key);
            if(attr){
                attrStr += " " +attr+"=\""+jObj[key]+"\"";
            }else{
                if(key === this.options.textNodeName){
                    val += jObj[key];
                }else{
                    val += "<" + key + ">"+jObj[key]+"</"+key+">";
                }
            }
        }else if(Array.isArray(jObj[key])){
            var arrLen = jObj[key].length;
            for(var j=0;j<arrLen;j++){
                var item = jObj[key][j];
                if(typeof item === "object"){
                    var result = this.j2x(item);
                    val += "<"+key + result.attrStr +">" +  result.val + "</"+key+">";
                }else{
                    val += "<"+key+">" +  item + "</"+key+">";
                }
            }
        }else{
            
            if(key === this.options.attrNodeName){
                var Ks = Object.keys(jObj[key]);
                var L = Ks.length;
                for(var j=0;j<L;j++){
                    attrStr += " "+Ks[j]+"=\"" + jObj[key][Ks[j]] + "\"";
                }
            }else{
                var result = this.j2x(jObj[key]);
                val  += "<" + key + result.attrStr + ">"+result.val + "</"+key+">";
            }
        }
    }
    return {attrStr : attrStr , val : val};
}

function isAttribute(name,options){
    if(name.startsWith(this.options.attributeNamePrefix)){
        return name.substr(this.attrPrefixLen);
    }else{
        return false;
    }
}
//formatting
//indentation
//\n after each closing or self closing tag


module.exports = Parser;