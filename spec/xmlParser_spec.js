var parser = require("../lib/parser");

describe("Function ", function() {

  it("should parse all values as string,int, or float", function() {
  	var xmlData = "<rootNode><tag>value</tag><intTag>45</intTag><floatTag>65.34</floatTag></rootNode>";
    var expected = { "rootNode" :{ "tag" : "value", "intTag" : 45, "floatTag" : 65.34}};

    var result = parser.parse(xmlData);
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

  it("should parse all type of nodes", function() {
  	var fs = require("fs");
    var path = require("path");
    var fileNamePath = path.join(__dirname,"assets/sample.xml");
    var xmlData = fs.readFileSync(fileNamePath).toString();

    var expected = {"any_name": {"person": [{"phone": [122233344550,122233344551],"name": "Jack","age": 33,"married": "Yes","birthday": "Wed, 28 Mar 1979 12:13:14 +0300","address": [{"city": "New York","street": "Park Ave","buildingNo": 1,"flatNo": 1},{"city": "Boston","street": "Centre St","buildingNo": 33,"flatNo": 24}]},{"phone": [122233344553,122233344554],"name": "Boris","age": 34,"married": "Yes","birthday": "Mon, 31 Aug 1970 02:03:04 +0300","address": [{"city": "Moscow","street": "Kahovka","buildingNo": 1,"flatNo": 2},{"city": "Tula","street": "Lenina","buildingNo": 3,"flatNo": 78}]}]}};

    var result = parser.parse(xmlData);
    //console.log(JSON.stringify(result,null,4));
    expect(result).toEqual(expected);
  });


});	