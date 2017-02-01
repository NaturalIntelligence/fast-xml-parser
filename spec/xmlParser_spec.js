var parser = require("../lib/parser");

describe("XMLParser", function() {

  it("should parse all values as string,int, or float", function() {
  	var xmlData = "<rootNode><tag>value</tag><intTag>45</intTag><floatTag>65.34</floatTag></rootNode>";
    var expected = { "rootNode" :{ "tag" : "value", "intTag" : 45, "floatTag" : 65.34}};

    var result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should skip tag arguments", function() {
  	var xmlData = "<rootNode><tag ns:arg='value'>value</tag><intTag ns:arg='value' ns:arg2='value2' >45</intTag><floatTag>65.34</floatTag></rootNode>";
    var expected = { "rootNode" :{ "tag" : "value", "intTag" : 45, "floatTag" : 65.34}};

    var result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse empty text Node", function() {
  	var xmlData = "<rootNode><tag></tag></rootNode>";
    var expected = { "rootNode" :{ "tag" : ""}};

    var result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse self closing tags", function() {
  	var xmlData = "<rootNode><tag ns:arg='value'/></rootNode>";
    var expected = { "rootNode" :{ "tag" : { "@_ns:arg" : "value"}}};

    var result = parser.parse(xmlData,{ignoreTextNodeAttr: false});
    expect(result).toEqual(expected);
  });

  it("should parse repeated nodes in array", function() {
  	var xmlData = "<rootNode>"
                    + "<tag>value</tag>"
                    + "<tag>45</tag>"
                    + "<tag>65.34</tag>"
                + "</rootNode>";
    var expected = { "rootNode" :{ "tag" : [ "value", 45,65.34]} };

    var result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse nested nodes in nested properties", function() {
  	var xmlData = "<rootNode>"
                    + "<parenttag>"
                        + "<tag>value</tag>"
                        + "<tag>45</tag>"
                        + "<tag>65.34</tag>"
                    + "</parenttag>"
                + "</rootNode>";
    var expected = { "rootNode" :{ "parenttag" : { "tag" : [ "value", 45,65.34]} }};

    var result = parser.parse(xmlData);
    expect(result).toEqual(expected);
  });

  it("should parse text nodes with value", function() {
  	var xmlData = "<rootNode>"
                    + "<parenttag attr1='some val' attr2='another val'>"
                        + "<tag attr1='val'>value</tag>"
                        + "<tag attr1='val' attr2='234'>45</tag>"
                        + "<tag>65.34</tag>"
                    + "</parenttag>"
                + "</rootNode>";
    var expected = { "rootNode" :{ "parenttag" : { "tag" : [  { "@_attr1" : "val", "#text" : "value"}, { "@_attr1" : "val", "@_attr2" : "234", "#text" : 45},65.34]} }};

    var result = parser.parse(xmlData,{ ignoreTextNodeAttr : false });
    expect(result).toEqual(expected);
  });

  it("should parse non-text nodes with value", function() {
  	var xmlData = "<rootNode>"
                    + "<parenttag attr1='some val' attr2='another val'>"
                        + "<tag>value</tag>"
                        + "<tag attr1='val' attr2='234'>45</tag>"
                        + "<tag>65.34</tag>"
                    + "</parenttag>"
                + "</rootNode>";
    var expected = { "rootNode" :{ "parenttag" : { "@_attr1" : "some val", "@_attr2" : "another val", "tag" : [ "value", 45,65.34]} }};

    var result = parser.parse(xmlData,{ ignoreNonTextNodeAttr : false });
    expect(result).toEqual(expected);
  });

  it("should parse non-text nodes with value for repeated nodes", function() {
  	var xmlData = "<rootNode>"
                    + "<parenttag attr1='some val' attr2='another val'>"
                        + "<tag>value</tag>"
                        + "<tag attr1='val' attr2='234'>45</tag>"
                        + "<tag>65.34</tag>"
                    + "</parenttag>"
                    + "<parenttag attr1='some val' attr2='another val'>"
                        + "<tag>value</tag>"
                        + "<tag attr1='val' attr2='234'>45</tag>"
                        + "<tag>65.34</tag>"
                    + "</parenttag>"
                + "</rootNode>";
    var expected = {
        "rootNode": {
            "parenttag": [
                {
                    "@_attr1": "some val",
                    "@_attr2": "another val",
                    "tag": [ "value", 45, 65.34]
                },{
                    "@_attr1": "some val",
                    "@_attr2": "another val",
                    "tag": [ "value", 45, 65.34]
                }
            ]
        }
    };

    var result = parser.parse(xmlData,{ ignoreNonTextNodeAttr : false });
    expect(result).toEqual(expected);
  });


  it("should parse all type of nodes", function() {
  	var fs = require("fs");
    var path = require("path");
    var fileNamePath = path.join(__dirname,"assets/sample.xml");
    var xmlData = fs.readFileSync(fileNamePath).toString();

    var expected = {"any_name": { "@attr": "https://example.com/somepath","person": [{"@id": "101","phone": [122233344550,122233344551],"name": "Jack","age": 33,"emptyNode": "","booleanNode": ["false","true"],"selfclosing": {"@with": "value"},"married": {"@firstTime": "No","@attr": "val 2","#_text": "Yes"},"birthday": "Wed, 28 Mar 1979 12:13:14 +0300","address": [{"city": "New York","street": "Park Ave","buildingNo": 1,"flatNo": 1},{"city": "Boston","street": "Centre St","buildingNo": 33,"flatNo": 24}]},{"@id": "102","phone": [122233344553,122233344554],"name": "Boris","age": 34,"married": {"@firstTime": "Yes","#_text": "Yes"},"birthday": "Mon, 31 Aug 1970 02:03:04 +0300","address": [{"city": "Moscow","street": "Kahovka","buildingNo": 1,"flatNo": 2},{"city": "Tula","street": "Lenina","buildingNo": 3,"flatNo": 78}]}]}};

    var result = parser.parse(xmlData,{ 
        ignoreTextNodeAttr : false ,
        ignoreNonTextNodeAttr : false,
        attrPrefix : "@",
        textNodeName : "#_text",
      });
    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);
  });

});	