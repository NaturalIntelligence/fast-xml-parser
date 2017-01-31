var getAllMatches = function(string, regex) {
  //var regex = new RegExp(regex_str,"g");
  var matches = [];
  var match = regex.exec(string);
  while (match) {
  	var allmatches = [];
    for (var index = 0; index < match.length; index++) {
  		allmatches.push(match[index]);
  	}
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
};

var xmlNode = function(tagname,parent){
    this.tagname = tagname;
    this.parent = parent;
    this.child = [];
    this.addChild = function (child){
        this.child.push(child);
    };
};

var tagsRegx = new RegExp("<(\\/?[a-zA-Z0-9_:]+)([^>]*)>","g");
var valsRegx = new RegExp(">([^<]+)<","g");

var xml2json = function (xmlData){
    xmlData = xmlData.replace(/>(\s+)/g, ">");//Remove spaces and make it single line.
    var tags = getAllMatches(xmlData,tagsRegx);
    var values = getAllMatches(xmlData,valsRegx);

    var rootNode = new xmlNode(tags[0][1]);
    var currentNode = rootNode;
    for (var i = 1,j=0; i < tags.length -1 ; i++) {
        var tag = tags[i][1];
        var nexttag = tags[i+1][1];
        
        if( ("/" + tag) === nexttag){ //leaf node
            var val = values[j++][1];
            if(isNaN(val)){
                val = "" + val ;
            }else{
                if(val.indexOf(".") !== -1){
                    val = Number.parseFloat(val);
                }else{
                    val = Number.parseInt(val);
                }
            }
            var childNode = new xmlNode(tag,currentNode);
            childNode.val = val;
            currentNode.addChild(childNode);
            i++;
        }else if(tag.indexOf("/") === 0){//ending tag
            currentNode = currentNode.parent;
            continue;
        }else{//starting tag
            var cNode = new xmlNode(tag,currentNode);
            currentNode.addChild(cNode);
            currentNode = cNode;
        }
    }
    //include root node as well
    var xmlObj = new xmlNode('_xml');
    rootNode.param = xmlObj;
    xmlObj.addChild(rootNode);
    return convertToJson(xmlObj);
};

function convertToJson(node){
    var jObj = {};
    if(node.val) {
        return node.val;
    }else{
        for (var index = 0; index < node.child.length; index++) {
            var prop = node.child[index].tagname;
            var obj = convertToJson(node.child[index]);
            if(jObj[prop]){
                if(!Array.isArray(jObj[prop])){
                    var swap = jObj[prop];
                    jObj[prop] = [];
                    jObj[prop].push(swap);
                }
                jObj[prop].push(obj);
            }else{
                jObj[prop] = obj;
            }
        }
    }
    return jObj;
}

if(typeof exports === "undefined"){
    exports = this;
}

exports.parse = xml2json;
