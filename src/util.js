'use strict';

const nameStartChar = ':A-Za-z_\\u00C0-\\u00D6\\u00D8-\\u00F6\\u00F8-\\u02FF\\u0370-\\u037D\\u037F-\\u1FFF\\u200C-\\u200D\\u2070-\\u218F\\u2C00-\\u2FEF\\u3001-\\uD7FF\\uF900-\\uFDCF\\uFDF0-\\uFFFD';
const nameChar = nameStartChar + '\\-.\\d\\u00B7\\u0300-\\u036F\\u203F-\\u2040';
export const nameRegexp = '[' + nameStartChar + '][' + nameChar + ']*';
const regexName = new RegExp('^' + nameRegexp + '$');

export function getAllMatches(string, regex) {
  const matches = [];
  let match = regex.exec(string);
  while (match) {
    const allmatches = [];
    allmatches.startIndex = regex.lastIndex - match[0].length;
    const len = match.length;
    for (let index = 0; index < len; index++) {
      allmatches.push(match[index]);
    }
    matches.push(allmatches);
    match = regex.exec(string);
  }
  return matches;
}

export const isName = function(string) {
  const match = regexName.exec(string);
  return !(match === null || typeof match === 'undefined');
}

export function isExist(v) {
  return typeof v !== 'undefined';
}

export function isEmptyObject(obj) {
  return Object.keys(obj).length === 0;
}

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} a
 */
export function merge(target, a, arrayMode) {
  if (a) {
    const keys = Object.keys(a); // will return an array of own properties
    const len = keys.length; //don't make it inline
    for (let i = 0; i < len; i++) {
      if (arrayMode === 'strict') {
        target[keys[i]] = [ a[keys[i]] ];
      } else {
        target[keys[i]] = a[keys[i]];
      }
    }
  }
}
/* exports.merge =function (b,a){
  return Object.assign(b,a);
} */

export function getValue(v) {
  if (exports.isExist(v)) {
    return v;
  } else {
    return '';
  }
}

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};