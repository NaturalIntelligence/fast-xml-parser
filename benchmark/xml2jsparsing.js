


var parser3 = require("../src/parserV3");
var parser2 = require("../src/parserV2");
var parser = require("../src/parser");
var xml2js = require("xml2js");

var fs = require("fs");
var path = require("path");
var fileNamePath = path.join(__dirname, "../spec/assets/large.xml");
var xmlData = fs.readFileSync(fileNamePath).toString();

var beforeTime = new Date();
xml2js.parseString(xmlData,function(err,result){
    if (err) throw err;
    var endTime = new Date();
    console.log(endTime - beforeTime);
    //console.log(result.any_name.person[3].name);
    //console.log(JSON.stringify(result,null,4));
});


var beforeTime = new Date();
parser2.parse(xmlData);
var endTime = new Date();
console.log(endTime - beforeTime);

var beforeTime = new Date();
parser3.parse(xmlData);
var endTime = new Date();
console.log(endTime - beforeTime);

var beforeTime = new Date();
parser.validate(xmlData);
var endTime = new Date();
console.log(endTime.getMilliseconds() - beforeTime.getMilliseconds());

var beforeTime = new Date();
parser.parse(xmlData);
var endTime = new Date();
console.log(endTime.getMilliseconds() - beforeTime.getMilliseconds());