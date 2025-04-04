"use strict";

import Benchmark from "benchmark";
import {XMLParser} from "../src/fxp.js";
import xml2js from "xml2js";
import fxpv3 from "fast-xml-parser";
import { convert } from 'xmlbuilder2';
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
    
// compatibility
const __dirname = dirname(fileURLToPath(import.meta.url));

const suite = new Benchmark.Suite("XML Parser benchmark");

import fs from "fs";
import path from "path";
const fileNamePath = path.join(__dirname, "../spec/assets/ptest.xml");//with CDATA
// const fileNamePath = path.join(__dirname, "../spec/assets/ptest_with_prolog.xml");//with CDATA
// const fileNamePath = path.join(__dirname, "../spec/assets/sample.xml");//1.5k
// const fileNamePath = path.join(__dirname, "../spec/assets/midsize.xml");//13m
// const fileNamePath = path.join(__dirname, "../spec/assets/large.xml");//98m
const xmlData = fs.readFileSync(fileNamePath).toString();

const fxpParser = new XMLParser();
const fxpParserForOrderedJs = new XMLParser({preserveOrder: true});

suite
    .add("fxp v3", function() {
        fxpv3.parse(xmlData);
    })
    .add("fxp", function() {
        fxpParser.parse(xmlData);
    })
    .add("fxp - preserve order", function() {
        fxpParserForOrderedJs.parse(xmlData);
    })
    .add("xmlbuilder2", function() {
        convert(xmlData);
    })
    .add('xml2js ', function() {
      xml2js.parseString(xmlData,function(err,result){
        if (err) throw err;
        // 2 for sample, 18432 for midsize, 138240 for large
        //if(2 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
        //if(18432 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
        //if(2 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
        // if(138240 !== result["any_name"]["person"].length) console.log("incorrect length", result["any_name"]["person"].length);
      });
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
