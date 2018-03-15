const getAllMatches = (string, regex) => {
    const matches = [];
    let match;
    while ((match = regex.exec(string)) !== null) {
        matches.push([...match]);
    }
    return matches;
};

/**
 * Copy all the properties of a into b.
 * @param {*} target
 * @param {*} source
 */
const merge = (target, source) => {
    if (source) {
        for (let key of Object.keys(source)) {
            target[key] = source[key];
        }
    }
    return target;
};

const isEmptyObject = (obj) => Object.keys(obj).length === 0;
const isExist = (v) => typeof v !== "undefined";

const doesMatch = (string, regex) => {
    const match = regex.exec(string);
    return !(match === null || !isExist(match));
};

const doesNotMatch = (string, regex) => !doesMatch(string, regex);

const getValue = (v) => isExist(v) ? v : "";

// const fakeCall = function(a) {return a;};
// const fakeCallNoReturn = function() {};
module.exports = {
    getValue,
    merge,
    isEmptyObject,
    isExist,
    doesMatch,
    doesNotMatch,
    getAllMatches
};
