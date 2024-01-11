### XML to JSON


```js
const jsonObj = parser.parse(xmlData [,options] );
```

```js
const parser = require('fast-xml-parser');
const he = require('he');

const options = {
    attributeNamePrefix : "@_",
    attrNodeName: "attr", //default is 'false'
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    allowBooleanAttributes : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,
    cdataTagName: "__cdata", //default is 'false'
    cdataPositionChar: "\\c",
    parseTrueNumberOnly: false,
    numParseOptions:{
      hex: true,
      leadingZeros: true,
      //skipLike: /\+[0-9]{10}/
    },
    arrayMode: false, //"strict"
    attrValueProcessor: (val, attrName) => he.decode(val, {isAttributeValue: true}),//default is a=>a
    tagValueProcessor : (val, tagName) => he.decode(val), //default is a=>a
    stopNodes: ["parse-me-as-string"],
    alwaysCreateTextNode: false
};

if( parser.validate(xmlData) === true) { //optional (it'll return an object in case it's not valid)
    let jsonObj = parser.parse(xmlData,options);
}

// Intermediate obj
const tObj = parser.getTraversalObj(xmlData,options);
let jsonObj = parser.convertToJson(tObj,options);

```
As you can notice in the above code, validator is not embedded with in the parser and expected to be called separately. However, you can pass `true` or validation options as 3rd parameter to the parser to trigger validator internally. It is same as above example.

```js
try{
  let jsonObj = parser.parse(xmlData,options, true);
}catch(error){
  console.log(error.message)
}
```

Validator returns the following object in case of error;
```js
{
  err: {
    code: code,
    msg: message,
    line: lineNumber,
  },
};
```


#### Note: [he](https://www.npmjs.com/package/he) library is used in this example

<details>
	<summary>OPTIONS :</summary>

* **parseNodeValue** : Parse the value of text node to float, integer, or boolean.
* **parseAttributeValue** : Parse the value of an attribute to float, integer, or boolean.
* **trimValues** : trim string values of an attribute or node
* **decodeHTMLchar** : This options has been removed from 3.3.4. Instead, use tagValueProcessor, and attrValueProcessor. See above example.
* **cdataTagName** : If specified, parser parse CDATA as nested tag instead of adding it's value to parent tag.
* **cdataPositionChar** : It'll help to covert JSON back to XML without losing CDATA position.
* **parseTrueNumberOnly**: if true then values like "+123", or "0123" will not be parsed as number.
* **arrayMode** : When `false`, a tag with single occurrence is parsed as an object but as an array in case of multiple occurrences. When `true`, a tag will be parsed as an array always excluding leaf nodes. When `strict`, all the tags will be parsed as array only. When instance of `RegEx`, only tags will be parsed as array that match the regex. When `function` a tag name is passed to the callback that can be checked.
* **tagValueProcessor** : Process tag value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.
* **attrValueProcessor** : Process attribute value during transformation. Like HTML decoding, word capitalization, etc. Applicable in case of string only.
* **stopNodes** : an array of tag names which are not required to be parsed. Instead their values are parsed as string.
* **alwaysCreateTextNode** : When `true`, forces the parser always return a property for the `textNodeName` even if there are no attributes or node children.
</details>

<details>
	<summary>To use from <b>command line</b></summary>

```bash
$xml2js [-ns|-a|-c|-v|-V] <filename> [-o outputfile.json]
$cat xmlfile.xml | xml2js [-ns|-a|-c|-v|-V] [-o outputfile.json]
```

* -ns : To include namespaces (by default ignored)
* -a : To ignore attributes
* -c : To ignore value conversion (i.e. "-3" will not be converted to number -3)
* -v : validate before parsing
* -V : only validate
</details>


<details>
	<summary>To use it <b>on webpage</b></summary>

```js
const result = parser.validate(xmlData);
if (result !== true) console.log(result.err);
const jsonObj = parser.parse(xmlData);
```
</details>

### JSON / JS Object to XML

```js
const Parser = require("fast-xml-parser").j2xParser;
//default options need not to set
const defaultOptions = {
    attributeNamePrefix : "@_",
    attrNodeName: "@", //default is false
    textNodeName : "#text",
    ignoreAttributes : true,
    cdataTagName: "__cdata", //default is false
    cdataPositionChar: "\\c",
    format: false,
    indentBy: "  ",
    suppressEmptyNode: false,
    tagValueProcessor: a=> he.encode(a, { useNamedReferences: true}),// default is a=>a
    attrValueProcessor: a=> he.encode(a, {isAttributeValue: isAttribute, useNamedReferences: true}),// default is a=>a
    rootNodeName: "element"
};
const parser = new Parser(defaultOptions);
const xml = parser.parse(json_or_js_obj);
```

<details>
	<summary>OPTIONS :</summary>

With the correct options, you can get the almost original XML without losing any information.

* **attributeNamePrefix** : Identify attributes with this prefix otherwise treat them as a tag.
* **attrNodeName**: Identify attributes when they are grouped under single property.
* **ignoreAttributes** : Don't check for attributes. Treats everything as tag.
* **encodeHTMLchar** : This option has been removed from 3.3.4. Use tagValueProcessor, and attrValueProcessor instead. See above example.
* **cdataTagName** : If specified, parse matching tag as CDATA
* **cdataPositionChar** : Identify the position where CDATA tag should be placed. If it is blank then CDATA will be added in the last of tag's value.
* **format** : If set to true, then format the XML output.
* **indentBy** : indent by this char `when` format is set to `true`
* **suppressEmptyNode** : If set to `true`, tags with no value (text or nested tags) are written as self closing tags.
* **tagValueProcessor** : Process tag value during transformation. Like HTML encoding, word capitalization, etc. Applicable in case of string only.
* **attrValueProcessor** : Process attribute value during transformation. Like HTML encoding, word capitalization, etc. Applicable in case of string only.
* **rootNodeName** : When input js object is array, parser uses array index by default as tag name. You can set this property for proper response.
</details>
