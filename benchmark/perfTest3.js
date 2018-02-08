var Benchmark = require('benchmark');
var suite = new Benchmark.Suite("XML Parser benchmark");

var parser = require("../src/parser");
var xml2js = require("xml2js");

var fs = require("fs");
var path = require("path");
//var fileNamePath = path.join(__dirname, "../spec/assets/ptest.xml");//with CDATA
//var fileNamePath = path.join(__dirname, "../spec/assets/ptest_with_prolog.xml");//with CDATA
var fileNamePath = path.join(__dirname, "../spec/assets/sample.xml");//1.5k
//var fileNamePath = path.join(__dirname, "../spec/assets/midsize.xml");//13m
var xmlData = fs.readFileSync(fileNamePath).toString();
//xmlData=`<root>${xmlData.repeat(1000)}</root>`;

suite
.add('validation', function() {
  var result = parser.validate(xmlData); 
})
.add('xml to json V1', function() {
    parser.parse(xmlData); 
})
.add('xml2js ', function() {
  xml2js.parseString(xmlData,function(err,result){
    if (err) throw err;
    // 2 for sample, 18432 for midsize
    //if(2 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
    //if(18432 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
    //if(2 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
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
	console.log("Error in Suite: ",e);
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
    console.log(this[j].name + " : " +   this[j].hz + " requests/second");
  }
})
// run async 
.run({ 'async': true });