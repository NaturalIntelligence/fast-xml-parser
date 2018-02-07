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
 * @param {*} b
 * @param {*} a 
 */
exports.merge =function (b,a){
  if(b !== undefined)
      for (var attr in a) {
          if (Object.prototype.hasOwnProperty.call(a, attr)) {
              b[attr] = a[attr]; 
          }
      }
}

exports.doesMatch = doesMatch
exports.doesNotMatch = doesNotMatch
exports.getAllMatches = getAllMatches;