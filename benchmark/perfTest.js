var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("XML Parser benchmark");

var parser = require("../src/parser");

var fs = require("fs");
var path = require("path");
var fileNamePath = path.join(__dirname, "sample.xml");
var xmlData = fs.readFileSync(fileNamePath).toString();
var config = {
            ignoreTextNodeAttr: false,
            ignoreNonTextNodeAttr: false,
            attrPrefix: "@",
            textNodeName: "#_text",
            ignoreNameSpace: true,
        };

suite.add('xml to traversal object', function() {
  parser.getTraversalObj(xmlData, config);//14000
})
.add('xml to json', function() {
  parser.parse(xmlData, config); //12300
})
.add('xml validation', function() {
  parser.validate(xmlData); //2000
})

.on('start',function(){
	console.log("Running Suite: " + this.name);
})
.on('error',function(e){
	console.log("Error in Suite: " + this.name);
})
.on('abort',function(e){
	console.log("Aborting Suite: " + this.name);
})
/*.on('cycle',function(event){
	console.log("Suite ID:" + event.target.id);
})*/
// add listeners 
.on('complete', function() {
  for (var j = 0; j < this.length; j++) {
    console.log(this.name + ":" +   this[j].hz + " requests/second");
  }
})
// run async 
.run({ 'async': true });