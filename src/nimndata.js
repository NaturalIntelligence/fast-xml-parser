var char = function (a){
    return String.fromCharCode(a);
}

const chars = {
    nilChar : char(254),
    missingChar : char(200),
    nilPremitive : char(176),
    missingPremitive : char(201),
    emptyChar : char(177),
    emptyValue:  char(178),
    boundryChar : char(186),
    arrayEnd: char(197),
    objStart: char(198),
    arrStart: char(199)
};


const charsArr = [
    chars.nilChar ,
    chars.nilPremitive,
    chars.missingChar,
    chars.missingPremitive,
    chars.boundryChar ,
    chars.emptyChar,
    chars.arrayEnd,
    chars.objStart,
    chars.arrStart
]


var _e = function(node,e_schema){
    if(typeof e_schema === "string"){//premitive
        return getValue(node.val,e_schema);
    }else{
        var hasValidData = hasData(node);
        if(hasValidData === true){
            var str = "";
            if(Array.isArray(e_schema)){
                str += chars.arrStart;
                var itemSchema = e_schema[0];
                //var itemSchemaType = itemSchema;
                var arr_len = node.child[e_schema].length;
                for(var arr_i=0;arr_i < arr_len;arr_i++){
                    var r = _e(node.child[e_schema][arr_i],itemSchema) ;
                    str = processValue(str,r);
                }
                str += chars.arrayEnd;//indicates that next item is not array item
            }else{//object
                str += chars.objStart;
                var keys = Object.keys(e_schema);
                for(var i in keys){
                    var key = keys[i];
                    var r =  _e(node.child[key][0],e_schema[key]) ;
                    str = processValue(str,r);
                }
            }
            return str;
        }else{
            return hasValidData;
        }
    }
}

var getValue= function(a,type){
    switch(a){
        case undefined: return chars.missingPremitive;
        case null: return chars.nilPremitive;
        case "": return chars.emptyValue;
        default: return a;
    }
}

var processValue= function(str,r){
    if(! isAppChar(r[0]) && ! isAppChar(str[str.length -1])){
        str += chars.boundryChar;
    }
    return str + r;
}

var isAppChar = function(ch){
    return charsArr.indexOf(ch) !== -1;
}

function hasData(jObj){
    if(jObj === undefined) return chars.missingChar;
    else if(jObj === null) return chars.nilChar;
    else if(jObj.child && Object.keys(jObj.child).length === 0 && jObj.attrsMap && Object.keys(jObj.attrsMap).length === 0){
    //else  if( jObj.length === 0 || Object.keys(jObj).length === 0){
        return chars.emptyChar;
    }else{
        return true;
    }
}

var convert2nimn = function(node,e_schema){
    return _e(node.child[Object.keys(node)[0]],e_schema)
    //return _e(node,e_schema)
}

exports.convert2nimn = _e;