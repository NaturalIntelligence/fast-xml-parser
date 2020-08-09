function isUndefined(v) {
    return typeof v === 'undefined';
}
function isStringType(v) {
    return typeof v === 'string';
}

function isTrue(v) {
    return v === 'true';
}
function isFalse(v) {
    return v === 'false';
}

/**
 * 
 * @param {string} val 
 * @param {boolean} shouldParse 
 * @param {boolean} parseTrueNumberOnly 
 */
function parseValue(val, parseTrueNumberOnly, shouldParse) {
    if (shouldParse && isStringType(val) && val.trim() !== '') {
        let parsed;
        let tempVal = val.trim();
        if (isNaN(tempVal)) {//string, boolean, custom object
            parsed = isTrue(tempVal) ? true : isFalse(tempVal) ? false : val;
        } else {
            if (tempVal.indexOf('0x') !== -1) { //hexa decimal
                parsed = Number.parseInt(tempVal, 16);
            } else if (tempVal.indexOf('.') !== -1) {//float
                //parsed = Number.parseFloat(tempVal);
                parsed = Number(tempVal);
                tempVal = tempVal.replace(/0+$/, "");
            } else {//Integer
                parsed = Number(tempVal, 10);
            }
            //Dont parse long numbers
            if (parseTrueNumberOnly) {
                parsed = String(parsed) === tempVal ? parsed : tempVal;
            }
        }
        return parsed;
    } else {
        return val;
    }
}


module.exports.parseValue = parseValue;