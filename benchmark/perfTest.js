"use strict";

const Benchmark = require("benchmark");
const suite = new Benchmark.Suite("XML Parser benchmark");

const parser = require("../src/parser");
//const xml2js = require("xml2js");

const fs = require("fs");
const path = require("path");
const fileNamePath = path.join(__dirname, "../spec/assets/sample.xml");
const xmlData = fs.readFileSync(fileNamePath).toString();

suite
    .add("validate", function() {
        parser.validate(xmlData);
    })
    .add("parse", function() {
        parser.parse(xmlData);
    })
    /* .add('xml2js ', function() {
      xml2js.parseString(xmlData,function(err,result){
        if (err) throw err;
      });
    }) */

    .on("start", function() {
        console.log("Running Suite: " + this.name);
    })
    .on("error", function(e) {
        console.log("Error in Suite: " + this.name);
    })
    .on("abort", function(e) {
        console.log("Aborting Suite: " + this.name);
    })
    /*.on('cycle',function(event){
        console.log("Suite ID:" + event.target.id);
    })*/
    // add listeners
    .on("complete", function() {
        for (let j = 0; j < this.length; j++) {
            console.log(this[j].name + " : " + this[j].hz + " requests/second");
        }
    })
    // run async
    .run({"async": true});
