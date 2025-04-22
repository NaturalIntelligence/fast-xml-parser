import {isName} from '../util.js';

//TODO: handle comments
export default function readDocType(xmlData, i){
    
    const entities = {};
    if( xmlData[i + 3] === 'O' &&
         xmlData[i + 4] === 'C' &&
         xmlData[i + 5] === 'T' &&
         xmlData[i + 6] === 'Y' &&
         xmlData[i + 7] === 'P' &&
         xmlData[i + 8] === 'E')
    {    
        i = i+9;
        let angleBracketsCount = 1;
        let hasBody = false, comment = false;
        let exp = "";
        for(;i<xmlData.length;i++){
            if (xmlData[i] === '<' && !comment) { //Determine the tag type
                if( hasBody && isEntity(xmlData, i)){
                    i += 7; 
                    let entityName, val;
                    [entityName, val,i] = readEntityExp(xmlData,i+1);
                    if(val.indexOf("&") === -1) //Parameter entities are not supported
                        entities[ entityName ] = {
                            regx : RegExp( `&${entityName};`,"g"),
                            val: val
                        };
                }
                else if( hasBody && isElement(xmlData, i))  {
                    i += 8;//Not supported
                    const {index} = readElementExp(xmlData,i+1);
                    i = index;
                }else if( hasBody && isAttlist(xmlData, i)){
                    i += 8;//Not supported
                    // const {index} = readAttlistExp(xmlData,i+1);
                    // i = index;
                }else if( hasBody && isNotation(xmlData, i)) {
                    i += 9;//Not supported
                    const {index} = readNotationExp(xmlData,i+1);
                    i = index;
                }else if( isComment) comment = true;
                else throw new Error("Invalid DOCTYPE");

                angleBracketsCount++;
                exp = "";
            } else if (xmlData[i] === '>') { //Read tag content
                if(comment){
                    if( xmlData[i - 1] === "-" && xmlData[i - 2] === "-"){
                        comment = false;
                        angleBracketsCount--;
                    }
                }else{
                    angleBracketsCount--;
                }
                if (angleBracketsCount === 0) {
                  break;
                }
            }else if( xmlData[i] === '['){
                hasBody = true;
            }else{
                exp += xmlData[i];
            }
        }
        if(angleBracketsCount !== 0){
            throw new Error(`Unclosed DOCTYPE`);
        }
    }else{
        throw new Error(`Invalid Tag instead of DOCTYPE`);
    }
    return {entities, i};
}

const skipWhitespace = (data, index) => {
    while (index < data.length && /\s/.test(data[index])) {
        index++;
    }
    return index;
};

function readEntityExp(xmlData, i) {    
    //External entities are not supported
    //    <!ENTITY ext SYSTEM "http://normal-website.com" >

    //Parameter entities are not supported
    //    <!ENTITY entityname "&anotherElement;">

    //Internal entities are supported
    //    <!ENTITY entityname "replacement text">

    // Skip leading whitespace after <!ENTITY
    i = skipWhitespace(xmlData, i);

    // Read entity name
    let entityName = "";
    while (i < xmlData.length && !/\s/.test(xmlData[i]) && xmlData[i] !== '"' && xmlData[i] !== "'") {
        entityName += xmlData[i];
        i++;
    }
    validateEntityName(entityName);

    // Skip whitespace after entity name
    i = skipWhitespace(xmlData, i);

    // Check for unsupported constructs (external entities or parameter entities)
    if (xmlData.substring(i, i + 6).toUpperCase() === "SYSTEM") {
        throw new Error("External entities are not supported");
    }else if (xmlData[i] === "%") {
        throw new Error("Parameter entities are not supported");
    }

    // Read entity value (internal entity)
    let entityValue = "";
    [i, entityValue] = readIdentifierVal(xmlData, i, "entity");
    i--;
    return [entityName, entityValue, i ];
}

function readNotationExp(xmlData, i) {
    // Skip leading whitespace after <!NOTATION
    i = skipWhitespace(xmlData, i);

    // Read notation name
    let notationName = "";
    while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        notationName += xmlData[i];
        i++;
    }
    validateEntityName(notationName);

    // Skip whitespace after notation name
    i = skipWhitespace(xmlData, i);

    // Check identifier type (SYSTEM or PUBLIC)
    const identifierType = xmlData.substring(i, i + 6).toUpperCase();
    if (identifierType !== "SYSTEM" && identifierType !== "PUBLIC") {
        throw new Error(`Expected SYSTEM or PUBLIC, found "${identifierType}"`);
    }
    i += identifierType.length;

    // Skip whitespace after identifier type
    i = skipWhitespace(xmlData, i);

    // Read public identifier (if PUBLIC)
    let publicIdentifier = null;
    let systemIdentifier = null;

    if (identifierType === "PUBLIC") {
        [i, publicIdentifier ] = readIdentifierVal(xmlData, i, "publicIdentifier");

        // Skip whitespace after public identifier
        i = skipWhitespace(xmlData, i);

        // Optionally read system identifier
        if (xmlData[i] === '"' || xmlData[i] === "'") {
            [i, systemIdentifier ] = readIdentifierVal(xmlData, i,"systemIdentifier");
        }
    } else if (identifierType === "SYSTEM") {
        // Read system identifier (mandatory for SYSTEM)
        [i, systemIdentifier ] = readIdentifierVal(xmlData, i, "systemIdentifier");

        if (!systemIdentifier) {
            throw new Error("Missing mandatory system identifier for SYSTEM notation");
        }
    }
    
    return {notationName, publicIdentifier, systemIdentifier, index: --i};
}

function readIdentifierVal(xmlData, i, type) {
    let identifierVal = "";
    const startChar = xmlData[i];
    if (startChar !== '"' && startChar !== "'") {
        throw new Error(`Expected quoted string, found "${startChar}"`);
    }
    i++;

    while (i < xmlData.length && xmlData[i] !== startChar) {
        identifierVal += xmlData[i];
        i++;
    }

    if (xmlData[i] !== startChar) {
        throw new Error(`Unterminated ${type} value`);
    }
    i++;
    return [i, identifierVal];
}

function readElementExp(xmlData, i) {
    // <!ELEMENT name (content-model)>

    // Skip leading whitespace after <!ELEMENT
    i = skipWhitespace(xmlData, i);

    // Read element name
    let elementName = "";
    while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        elementName += xmlData[i];
        i++;
    }

    // Validate element name
    if (!validateEntityName(elementName)) {
        throw new Error(`Invalid element name: "${elementName}"`);
    }

    // Skip whitespace after element name
    i = skipWhitespace(xmlData, i);

    // Expect '(' to start content model
    if (xmlData[i] !== "(") {
        throw new Error(`Expected '(', found "${xmlData[i]}"`);
    }
    i++; // Move past '('

    // Read content model
    let contentModel = "";
    while (i < xmlData.length && xmlData[i] !== ")") {
        contentModel += xmlData[i];
        i++;
    }

    if (xmlData[i] !== ")") {
        throw new Error("Unterminated content model");
    }

    return {
        elementName,
        contentModel: contentModel.trim(),
        index: i
    };
}

function readAttlistExp(xmlData, i) {
    // Skip leading whitespace after <!ATTLIST
    i = skipWhitespace(xmlData, i);

    // Read element name
    let elementName = "";
    while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        elementName += xmlData[i];
        i++;
    }

    // Validate element name
    validateEntityName(elementName)

    // Skip whitespace after element name
    i = skipWhitespace(xmlData, i);

    // Read attribute name
    let attributeName = "";
    while (i < xmlData.length && !/\s/.test(xmlData[i])) {
        attributeName += xmlData[i];
        i++;
    }

    // Validate attribute name
    if (!validateEntityName(attributeName)) {
        throw new Error(`Invalid attribute name: "${attributeName}"`);
    }

    // Skip whitespace after attribute name
    i = skipWhitespace(xmlData, i);

    // Read attribute type
    let attributeType = "";
    if (xmlData.substring(i, i + 8).toUpperCase() === "NOTATION") {
        attributeType = "NOTATION";
        i += 8; // Move past "NOTATION"

        // Skip whitespace after "NOTATION"
        i = skipWhitespace(xmlData, i);

        // Expect '(' to start the list of notations
        if (xmlData[i] !== "(") {
            throw new Error(`Expected '(', found "${xmlData[i]}"`);
        }
        i++; // Move past '('

        // Read the list of allowed notations
        let allowedNotations = [];
        while (i < xmlData.length && xmlData[i] !== ")") {
            let notation = "";
            while (i < xmlData.length && xmlData[i] !== "|" && xmlData[i] !== ")") {
                notation += xmlData[i];
                i++;
            }

            // Validate notation name
            notation = notation.trim();
            if (!validateEntityName(notation)) {
                throw new Error(`Invalid notation name: "${notation}"`);
            }

            allowedNotations.push(notation);

            // Skip '|' separator or exit loop
            if (xmlData[i] === "|") {
                i++; // Move past '|'
                i = skipWhitespace(xmlData, i); // Skip optional whitespace after '|'
            }
        }

        if (xmlData[i] !== ")") {
            throw new Error("Unterminated list of notations");
        }
        i++; // Move past ')'

        // Store the allowed notations as part of the attribute type
        attributeType += " (" + allowedNotations.join("|") + ")";
    } else {
        // Handle simple types (e.g., CDATA, ID, IDREF, etc.)
        while (i < xmlData.length && !/\s/.test(xmlData[i])) {
            attributeType += xmlData[i];
            i++;
        }

        // Validate simple attribute type
        const validTypes = ["CDATA", "ID", "IDREF", "IDREFS", "ENTITY", "ENTITIES", "NMTOKEN", "NMTOKENS"];
        if (!validTypes.includes(attributeType.toUpperCase())) {
            throw new Error(`Invalid attribute type: "${attributeType}"`);
        }
    }

    // Skip whitespace after attribute type
    i = skipWhitespace(xmlData, i);

    // Read default value
    let defaultValue = "";
    if (xmlData.substring(i, i + 8).toUpperCase() === "#REQUIRED") {
        defaultValue = "#REQUIRED";
        i += 8;
    } else if (xmlData.substring(i, i + 7).toUpperCase() === "#IMPLIED") {
        defaultValue = "#IMPLIED";
        i += 7;
    } else {
        [i, defaultValue] = readIdentifierVal(xmlData, i, "ATTLIST");
    }

    return {
        elementName,
        attributeName,
        attributeType,
        defaultValue,
        index: i
    }
}

function isComment(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === '-' &&
    xmlData[i+3] === '-') return true
    return false
}
function isEntity(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'E' &&
    xmlData[i+3] === 'N' &&
    xmlData[i+4] === 'T' &&
    xmlData[i+5] === 'I' &&
    xmlData[i+6] === 'T' &&
    xmlData[i+7] === 'Y') return true
    return false
}
function isElement(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'E' &&
    xmlData[i+3] === 'L' &&
    xmlData[i+4] === 'E' &&
    xmlData[i+5] === 'M' &&
    xmlData[i+6] === 'E' &&
    xmlData[i+7] === 'N' &&
    xmlData[i+8] === 'T') return true
    return false
}

function isAttlist(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'A' &&
    xmlData[i+3] === 'T' &&
    xmlData[i+4] === 'T' &&
    xmlData[i+5] === 'L' &&
    xmlData[i+6] === 'I' &&
    xmlData[i+7] === 'S' &&
    xmlData[i+8] === 'T') return true
    return false
}
function isNotation(xmlData, i){
    if(xmlData[i+1] === '!' &&
    xmlData[i+2] === 'N' &&
    xmlData[i+3] === 'O' &&
    xmlData[i+4] === 'T' &&
    xmlData[i+5] === 'A' &&
    xmlData[i+6] === 'T' &&
    xmlData[i+7] === 'I' &&
    xmlData[i+8] === 'O' &&
    xmlData[i+9] === 'N') return true
    return false
}

function validateEntityName(name){
    if (isName(name))
	return name;
    else
        throw new Error(`Invalid entity name ${name}`);
}
