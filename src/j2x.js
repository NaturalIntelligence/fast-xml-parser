//parse Empty Node as self closing node
var he = require("he");

var defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: false,
    textNodeName : "#text",
    ignoreAttributes : true,
    encodeHTMLchar: false,
    cdataTagName: false,
    cdataPositionChar: "\\c"
};

function Parser(options){
    this.options = Object.assign({},defaultOptions,options);
    if(this.options.ignoreAttributes) {
        this.isAttribute = a => false;
    }else{
        this.attrPrefixLen = this.options.attributeNamePrefix.length;
        this.isAttribute = isAttribute;
    }
    if(this.options.cdataTagName){
        this.isCDATA = isCDATA;
    }else{
        this.isCDATA = a => false;
    }
    this.replaceCDATAstr = replaceCDATAstr;
    this.replaceCDATAarr = replaceCDATAarr;
    if(this.options.encodeHTMLchar){
        this.encodeHTMLchar = encodeHTMLchar;
    }else{
        this.encodeHTMLchar = a => a;
    }
}


Parser.prototype.parse = function(jObj){
    return this.j2x(jObj).val;
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
                attrStr += " " +attr+"=\""+ this.encodeHTMLchar(jObj[key], true) +"\"";
            }else if(this.isCDATA(key)){
                //check if textnode is present -> replace the value
                //else just add the value

                if(jObj[this.options.textNodeName]){
                    val += this.replaceCDATAstr(jObj[this.options.textNodeName], jObj[key]);
                }else{
                    val += this.replaceCDATAstr("", jObj[key]);
                }
            }else{
                if(key === this.options.textNodeName){
                    if(jObj[this.options.cdataTagName]){
                        //value will added while processing cdata
                    }else{
                        val += this.encodeHTMLchar(jObj[key]);    
                    }
                }else{
                    val += "<" + key + ">"+this.encodeHTMLchar(jObj[key])+"</"+key+">";
                }
            }
        }else if(Array.isArray(jObj[key])){
            if(this.isCDATA(key)){
                //check if textnode is present -> replace the value
                //else just add the value

                if(jObj[this.options.textNodeName]){
                    val += this.replaceCDATAarr(jObj[this.options.textNodeName], jObj[key]);
                }else{
                    val += this.replaceCDATAarr("", jObj[key]);
                }
            }else{
                var arrLen = jObj[key].length;
                for(var j=0;j<arrLen;j++){
                    var item = jObj[key][j];
                    if(typeof item === "object"){
                        var result = this.j2x(item);
                        val += "<"+key + result.attrStr +">" +  result.val + "</"+key+">";
                    }else{
                        val += "<"+key+">" +  this.encodeHTMLchar(item) + "</"+key+">";
                    }
                }
            }
        }else{
            
            if(this.options.attrNodeName && key === this.options.attrNodeName){
                var Ks = Object.keys(jObj[key]);
                var L = Ks.length;
                for(var j=0;j<L;j++){
                    attrStr += " "+Ks[j]+"=\"" + this.encodeHTMLchar(jObj[key][Ks[j]]) + "\"";
                }
            }else{
                var result = this.j2x(jObj[key]);
                val  += "<" + key + result.attrStr + ">"+result.val + "</"+key+">";
            }
        }
    }
    return {attrStr : attrStr , val : val};
}

function replaceCDATAstr(str,cdata){
    str = this.encodeHTMLchar(str);
    if(this.options.cdataPositionChar === "" || str === ""){
        return str + "<![CDATA[" +cdata+"]]>";
    }else{
        return str.replace(this.options.cdataPositionChar,"<![CDATA[" +cdata+"]]>")
    }
}

function replaceCDATAarr(str,cdata){
    str = this.encodeHTMLchar(str);
    if(this.options.cdataPositionChar === "" || str === ""){
        return str + "<![CDATA[" + cdata.join("]]><![CDATA[")+"]]>";
    }else{
        for(var v in cdata){
            str = str.replace(this.options.cdataPositionChar, "<![CDATA[" +cdata[v]+"]]>");
        }
        return str;
    }
}

function encodeHTMLchar(val, isAttribute){
    return he.encode("" + val, {isAttributeValue : isAttribute, useNamedReferences: true});
}

function isAttribute(name,options){
    if(name.startsWith(this.options.attributeNamePrefix)){
        return name.substr(this.attrPrefixLen);
    }else{
        return false;
    }
}

function isCDATA(name){
    if(name === this.options.cdataTagName){
        return true;
    }else{
        return false;
    }
}
//formatting
//indentation
//\n after each closing or self closing tag


module.exports = Parser;