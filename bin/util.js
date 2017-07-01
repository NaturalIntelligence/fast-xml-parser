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

exports.doesMatch = doesMatch
exports.doesNotMatch = doesNotMatch
exports.getAllMatches = getAllMatches;