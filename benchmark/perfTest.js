var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("XML Parser benchmark");

var parser = require("../src/parser");
var xml2js = require("xml2js");
var parser2 = require("../src/parserV2");

var fs = require("fs");
var path = require("path");
var fileNamePath = path.join(__dirname, "../spec/assets/sample.xml");
var xmlData = fs.readFileSync(fileNamePath).toString();

suite
.add('xml to json + validation V1', function() {
  parser.validate(xmlData); 
  parser.parse(xmlData); 
})
.add('xml to json + validation V2 ', function() {
  parser2.parse(xmlData);
})
.add('xml2js ', function() {
  xml2js.parseString(xmlData,function(err,result){
    if (err) throw err;
  });
})
/* .add('xml2js', {
  'defer': true,
  'fn' : function(deferred) {
      xml2js.parseString(xmlData,function(err,result){
        console.log("err", err);
        if (err) throw err;
        deferred.resolve();
      });
    }
}) */

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
    console.log(this[j].name + ":" +   this[j].hz + " requests/second");
  }
})
// run async 
.run({ 'async': true });