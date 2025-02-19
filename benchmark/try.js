import fs from "fs";
import path from "path";
// const fileNamePath = path.join(__dirname, "../spec/assets/test.json");//1.5k
// const jsonData = JSON.parse(fs.readFileSync(fileNamePath).toString());


// const xml2js = require("xml2js");

// const xml2jsBuilder = new xml2js.Builder();
// xml2jsBuilder.buildObject(jsonData);

import {XMLParser} from "../src/fxp.js";
const fileNamePath = path.join(__dirname, "../spec/assets/sample.xml");//1.5k
const xmlData = fs.readFileSync(fileNamePath).toString();

const fxpParserForOrderedJs = new XMLParser({preserveOrder: true});
console.log( 
    JSON.stringify(fxpParserForOrderedJs.parse(xmlData), null, 4)
);