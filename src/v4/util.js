//polyfill
/* if (!Number.parseInt && window.parseInt) {
    Number.parseInt = window.parseInt;
  }
  if (!Number.parseFloat && window.parseFloat) {
    Number.parseFloat = window.parseFloat;
  }
 */
const getAllMatches = function(string, regex) {
    const matches = [];
    let match = regex.exec(string);
    while (match) {
      const allmatches = [];
      const len = match.length;
      for (let index = 0; index < len; index++) {
        allmatches.push(match[index]);
      }
      matches.push(allmatches);
      match = regex.exec(string);
    }
    return matches;
  };


module.exports.getAllMatches = getAllMatches;