var getAllMatches = function(string, regex) {
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


var doesMatch = function(string,regex){
  var match = regex.exec(string);
  if(match === null || match === undefined) return false;
  else return true;
}

var doesNotMatch = function(string,regex){
  return !doesMatch(string,regex);
}


exports.isExist= function(v){
  return v !== undefined  & v !== null
}

exports.isEmptyObject= function(obj) {
  return Object.keys(obj).length === 0
}

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a 
 */
exports.merge =function (target,a){
  if(a){
    var keys = Object.keys(a) // will return an array of own properties

    for(var i = 0; i < keys.length; i++){
      target[keys[i]] = a[keys[i]] ;
    }
  }
}
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

exports.getValue = function (v){
  if(exports.isExist(v)){
      return v;
  }else{
      return "";
  }
}

exports.doesMatch = doesMatch
exports.doesNotMatch = doesNotMatch
exports.getAllMatches = getAllMatches;