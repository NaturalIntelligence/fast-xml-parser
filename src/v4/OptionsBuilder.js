
const defaultOptions = {
    preserveOrder: false,
    joinTagValue: false,
    tagValuePropertyName: "__#text",
    //attributesGroupName: "__@attributes",
    attributesGroupName: false,
    attributeNamePrefix: "__@",
    cdataPropertyName: "__CDATA",
    ignoreAttributes: true,
    //ignoreNameSpace: false,
    removeNSPrefix: true, // remove NS from tag name or attribute name
    ignoreNSScoping: true,// Don't check if a NS is bound to correct tag or attribute
    allowBooleanAttributes: false, 
    parseTagValue: true,
    parseAttributeValue: false,
    parseTrueNumberOnly: false,
    arrayMode: false, //true, false, strict
    trimTagValue: true, //Trim string values of tag and attributes
    tagValueProcessor: function(tagName, a) {
        return a;
    },
    attrValueProcessor: function(attrName, a) {
        return a;
    },
    //TODO: support parent.child.leaf syntax to skip a node
    stopNodes: [], //nested tags will not be parsed even for errors
    skipNodes: [], //self and nested tags will not be parsed even for errors
    outputType: "json", // "nimn" , "yaml", "json"
    validation: true, //
    ignoreXmlnsAttributes: true,
}

const props = [
    "preserveOrder",
    "joinTagValue",
    "tagValuePropertyName",
    "attributesGroupName",
    "attributeNamePrefix",
    "cdataPropertyName",
    "ignoreAttributes",
    //"ignoreNameSpace",
    "removeNSPrefix",
    "ignoreNSScoping",
    "allowBooleanAttributes",
    "parseTagValue",
    "parseAttributeValue",
    "parseTrueNumberOnly",
    "arrayMode",
    "trimTagValue",
    "tagValueProcessor",
    "attrValueProcessor",
    "stopNodes",
    "outputType",
    //"suppressEmptyNode", //In experiment: remove self closing tag
    "validation",
    "ignoreXmlnsAttributes"
  ];

function OptionsBuilder(userOptions){
    const options = {};
    if (!userOptions) {
        userOptions = {};
    }
    
    for (let i = 0; i < props.length; i++) {
        if (userOptions[props[i]] !== undefined) {
            options[props[i]] = userOptions[props[i]];
        } else {
            options[props[i]] = defaultOptions[props[i]];
        }
    }

    return options;
}

module.exports = OptionsBuilder;