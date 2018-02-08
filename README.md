# [fast-xml-parser](https://www.npmjs.com/package/fast-xml-parser)
Validate XML or Parse XML to JS/JSON very fast without C/C++ based libraries and no callback

**Changes for V 3.0.0 are in progress** which will combine validator and parser and will be able to handle large XML files. So keep [watching](https://github.com/NaturalIntelligence/fast-xml-parser/watchers).

You can use this library online (press try me button above), or as command from CLI, or in your website, or in npm repo.

* This library let you validate the XML data syntactically. 
* Or you can transform/covert/parse XML data to JS/JSON object.
* Or you can transform the XML in traversable JS object which can later be converted to JS/JSON object.

[![Code Climate](https://codeclimate.com/github/NaturalIntelligence/fast-xml-parser/badges/gpa.svg)](https://codeclimate.com/github/NaturalIntelligence/fast-xml-parser) 
[<img src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_92x26.png" alt="Stubmatic donate button"/>](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC) 
<a href="https://liberapay.com/amitgupta/donate"><img alt="Donate using Liberapay" src="https://liberapay.com/assets/widgets/donate.svg"></a> 
[![Known Vulnerabilities](https://snyk.io/test/github/naturalintelligence/fast-xml-parser/badge.svg)](https://snyk.io/test/github/naturalintelligence/fast-xml-parser) 
[![NPM quality][quality-image]][quality-url]
[![Travis ci Build Status](https://travis-ci.org/NaturalIntelligence/fast-xml-parser.svg?branch=master)](https://travis-ci.org/NaturalIntelligence/fast-xml-parser) 
[![Coverage Status](https://coveralls.io/repos/github/NaturalIntelligence/fast-xml-parser/badge.svg?branch=master)](https://coveralls.io/github/NaturalIntelligence/fast-xml-parser?branch=master) 
[<img src="https://img.shields.io/badge/Try-me-blue.svg?colorA=FFA500&colorB=0000FF" alt="Try me"/>](https://naturalintelligence.github.io/fast-xml-parser/)
[![bitHound Dev Dependencies](https://www.bithound.io/github/NaturalIntelligence/fast-xml-parser/badges/devDependencies.svg)](https://www.bithound.io/github/NaturalIntelligence/fast-xml-parser/master/dependencies/npm)
[![bitHound Overall Score](https://www.bithound.io/github/NaturalIntelligence/fast-xml-parser/badges/score.svg)](https://www.bithound.io/github/NaturalIntelligence/fast-xml-parser) 
[![NPM total downloads](https://img.shields.io/npm/dt/fast-xml-parser.svg)](https://npm.im/fast-xml-parser)

[quality-image]: http://npm.packagequality.com/shield/fast-xml-parser.svg?style=flat-square
[quality-url]: http://packagequality.com/#?package=fast-xml-parser

<a href="https://opencollective.com/fast-xml-parser/donate" target="_blank">
  <img src="https://opencollective.com/fast-xml-parser/donate/button@2x.png?color=blue" width=300 />
</a>

### How to use
**Installation**

`$npm install fast-xml-parser`

or using [yarn](https://yarnpkg.com/)

`$yarn add fast-xml-parser`

**Usage**
```js
var fastXmlParser = require('fast-xml-parser');
var jsonObj = fastXmlParser.parse(xmlData);

// when a tag has attributes
/* upto 2.9.x
var options = {
    attrPrefix : "@_",
    attrNodeName: false,
    textNodeName : "#text",
    ignoreNonTextNodeAttr : true,
    ignoreTextNodeAttr : true,
    ignoreNameSpace : true,
    ignoreRootElement : false,
    textNodeConversion : true,
    textAttrConversion : false,
    arrayMode : false
};
*/
//from 3.0.0
var options = {
    attributeNamePrefix : "@_",
    attrNodeName: false,
    textNodeName : "#text",
    ignoreAttributes : true,
    ignoreNameSpace : false,
    parseNodeValue : true,
    parseAttributeValue : false,
    trimValues: true,                                //Trim string values of tag and attributes 
};
if(fastXmlParser.validate(xmlData)=== true){//optional
	var jsonObj = fastXmlParser.parse(xmlData,options);
}

//Intermediate obj
var tObj = fastXmlParser.getTraversalObj(xmlData,options);
var jsonObj = fastXmlParser.convertToJson(tObj);

```

* **attributeNamePrefix** : prepend given string to attribute name for identification
* **attrNodeName**: (Valid name) Group all the attributes as properties of given name.  
* **ignoreAttributes** : Ignore attributes to be parsed.
* **ignoreNameSpace** : Remove namespace string from tag and attribute names. 
* **parseNodeValue** : Parse the value of text node to float, integer, or boolean.
* **parseAttributeValue** : Parse the value of an attribute to float, integer, or boolean.
* **trimValues** : trim string values of an attribute or node

To use from command line
```bash
$xml2js [-ns|-a|-c] <filename> [-o outputfile.json]
$cat xmlfile.xml | xml2js [-ns|-a|-c] [-o outputfile.json]
```

-ns : To include namespaces (bedefault ignored)
-a : To ignore attributes
-c : To ignore value conversion (i.e. "-3" will not be converted to number -3)

To use it **on webpage**

1. Download and include [parser.js](https://github.com/NaturalIntelligence/fast-xml-parser/blob/master/lib/parser.js)
```js
var isValid = parser.validate(xmlData);
var jsonObj = parser.parse(xmlData);
```

Or use directly from [CDN](https://cdnjs.com/libraries/fast-xml-parser)

## Comparision
I decided to created this library when I couldn't find any library which can convert XML data to json without any callback and which is not based on any C/C++ library.

Libraries that I compared
* xml-mapping : fast, result is not satisfactory
* xml2js : fast, result is not satisfactory
* xml2js-expat : couldn't test performance as it gives error on high load. Installation failed on travis and on my local machine using 'yarn'.
* xml2json : based on node-expat which is based on C/C++. Installation failed on travis.
* fast-xml-parser : very very fast.

Why not C/C++ based libraries?
Installation of such libraries fails on some OS. You may require to install missing dependency manually.

### Benchmark report

| file size | fxp 3.0 validator (rps) | fxp 3.0 parser (rps) | xml2js 0.4.19 (rps) |
| ---------- | ----------------------- | ------------------- | ------------------- |
| 1.5k | 16581.06758 | 14032.09323 | 4615.930805 |
| 1.5m | 14918.47793 | 13.23366098 | 5.90682005 |
| 13m | 1.834479235 | 1.135582008 | -1 |
| 1.3k with CDATA | 30583.35319 | 43160.52342 | 8398.556349 |
| 1.3m with CDATA | 27.29266471 | 52.68877009 | 7.966000795 |
| 1.6k with cdata,prolog,doctype | 27690.26082 | 41433.98547 | 7872.399268 |
| 98m | 0.08473858148 | 0.2600104004 | -1 |

* -1 indicates error or incorrect output.

![npm_xml2json_compare](static/img/fxpv3-vs-xml2jsv0419_chart.png)

![npm_xml2json_compare](static/img/fxp-validatorv3.png)



**validator benchmark: 21000 tps**

Your contribution in terms of donation, testing, bug fixes, code development etc. can help me to write fast algorithms.
[<img src="https://www.paypalobjects.com/webstatic/en_US/btn/btn_donate_92x26.png" alt="Stubmatic donate button"/>](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=KQJAX48SPUKNC) 

**Give a [star](https://github.com/NaturalIntelligence/fast-xml-parser)**, if you really like this project.

# Changes from v3

* It can handle big file now. Performance report is given above.
* Meaningful error messages from validator

```
"err": {
    "code": "InvalidAttr",
    "msg": "Attributes for rootNode have open quote"
}
```

* Updated options 

```
    var defaultOptions = {
        attributeNamePrefix : "@_",                  //prefix for attributes
        attrNodeName: false,                    //Group attributes in separate node
        textNodeName : "#text",                 //Name for property which will have value of the node in case nested nodes are present, or attributes
        ignoreAttributes : true,                //ignore attributes
        ignoreNameSpace : false,                //ignore namespace from the name of a tag and attribute. It also removes xmlns attribute
        parseNodeValue : true,                  //convert the value of node to primitive type. E.g. "2" -> 2
        parseAttributeValue : false,            //convert the value of attribute to primitive type. E.g. "2" -> 2
        trimValues: true,                       //Trim string values of tag and attributes 
    };
```
* Parse boolean values as well. E.g. `"true"` to `true` 
* You can set pasrer not to *trim* whitespaces from attribute or tag /node value.
* Tag / node and attribute value is by default HTML decoded. However CDATA value will not be decoded.
* Tag / node value will not be parsed if CDATA presents.
* Few validation and parsing bugs are also fixed


Some of my other NPM pojects
 - [stubmatic](https://github.com/NaturalIntelligence/Stubmatic) : A stub server to mock behaviour of HTTP(s) / REST / SOAP services. Stubbing redis is on the way.
  - [fast-lorem-ipsum](https://github.com/amitguptagwl/fast-lorem-ipsum) : Generate lorem ipsum words, sentences, paragraph very quickly.

### TODO
* P2: validating XML stream data
* P2: validator cli
* P2: fast XML prettyfier
