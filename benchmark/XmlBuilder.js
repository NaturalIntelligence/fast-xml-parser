"use strict";

const Benchmark = require("benchmark");
const suite = new Benchmark.Suite("XML Builder benchmark");

const {XMLBuilder} = require("../src/fxp");
const xml2js = require("xml2js");
const xml2jsBuilder = new xml2js.Builder();

const fs = require("fs");
const path = require("path");
const fileNamePath = path.join(__dirname, "../spec/assets/test.json");//1.5k
const fileNamePath2 = path.join(__dirname, "../spec/assets/test_ordered.json");//1.5k
const jsonData = JSON.parse(fs.readFileSync(fileNamePath).toString());
const jsonOrderedData = JSON.parse(fs.readFileSync(fileNamePath2).toString());

const fxpBuilder = new XMLBuilder();
const fxpBuilderForOrderedJs = new XMLBuilder({preserveOrder: true});

suite
    .add("fxp", function() {
        fxpBuilder.build(jsonData);
    })
    .add("fxp - preserve order", function() {
        fxpBuilderForOrderedJs.build(jsonOrderedData);
    })
    .add('xml2js ', function() {
        xml2jsBuilder.buildObject(jsonData);
    })

    .on("start", function() {
        console.log("Running Suite: " + this.name);
    })
    .on("error", function(e) {
        console.log("Error in Suite: " + this.name, e);
    })
    .on("abort", function(e) {
        console.log("Aborting Suite: " + this.name, e);
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
