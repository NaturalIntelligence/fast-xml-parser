"use strict";

const parser = require("../src/parser");
const xml2js = require("xml2js");

const fs = require("fs");
const path = require("path");
const fileNamePath = path.join(__dirname, "../spec/assets/large.xml");
const xmlData = fs.readFileSync(fileNamePath).toString();

const beforeTime = new Date();
xml2js.parseString(xmlData, function(err, result) {
    if (err) {
        throw err;
    }
    const endTime = new Date();
    console.log(endTime - beforeTime);
    //console.log(result.any_name.person[3].name);
    //console.log(JSON.stringify(result,null,4));
});

const beforeTime = new Date();
parser.validate(xmlData);
const endTime = new Date();
console.log(endTime - beforeTime);
