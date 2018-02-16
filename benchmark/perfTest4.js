var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("XML Parser benchmark");

var Parser = require("../src/j2x");
var parser = new Parser({
    format: true,
    //supressEmptyNode: true
  });
var xml2js = require("xml2js");
var builder = new xml2js.Builder();
//var jsonxml = require('jsontoxml');

var fs = require("fs");
var path = require("path");
var fileNamePath = path.join(__dirname, "../spec/assets/test.json");//1.5k
var jsonData = JSON.parse(fs.readFileSync(fileNamePath).toString());
//xmlData=`<root>${xmlData.repeat(1000)}</root>`;


/* console.log(parser.parse(jsonData));
console.log("----------------")
console.log(builder.buildObject(jsonData));
console.log("----------------")
console.log(jsonxml(jsonData)); */


suite
.add('j2x', function() {
  parser.parse(jsonData); 
  //parser.parse(jsonData,{format:true}); 
})
.add('xml2js ', function() {
  var xml = builder.buildObject(jsonData);
})
/* .add('jsontoxml ', function() {
  var xml = jsonxml(jsonData);
}) */

.on('start',function(){
	console.log("Running Suite: " + this.name);
})
.on('error',function(e){
	console.log("Error in Suite: ",e);
})
.on('abort',function(e){
	console.log("Aborting Suite: " + this.name);
})
//.on('cycle',function(event){
//	console.log("Suite ID:" + event.target.id);
//})
// add listeners 
.on('complete', function() {
  for (var j = 0; j < this.length; j++) {
    console.log(this[j].name + " : " +   this[j].hz + " requests/second");
  }
})
// run async 
.run({ 'async': true });