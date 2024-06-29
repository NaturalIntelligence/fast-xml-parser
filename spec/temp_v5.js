"use strict";

const XMLParser = require("../src/v5/XMLParser");

describe("unpaired and empty tags", function() {
    it("bug test", function() {
        const parser = new XMLParser();

        var xmlData = `
        <?xml version="1.0" encoding="utf-8" ?><transcript><text start="0.48" dur="4.04">hello everyone this is your daily dose</text><text start="2.36" dur="4.32">of Internet the police in Peru dressed</text><text start="4.52" dur="4.96">up on Valentine&amp;#39;s Day to get a suspect</text><text start="6.68" dur="2.8">to come out of their</text><text start="12.24" dur="5.879">house she thought she had a secret admir</text><text start="15.16" dur="2.959">but got arrested in</text><text start="23.96" dur="6.639">St I got it this</text><text start="28.279" dur="5.201">time I got it this</text><text start="30.599" dur="2.881">oh</text><text start="37.52" dur="5.48">my this guy put an electric muscle</text><text start="40" dur="3">stimulator on his</text><text start="58.92" dur="3.959">face</text><text start="60.76" dur="6.48">hold okay so listen up I&amp;#39;m not going to</text><text start="62.879" dur="6.801">say this again 6th fifth 4th 3D second 1</text><text start="67.24" dur="4.84">and then reverse all the way over and up</text><text start="69.68" dur="5.2">there&amp;#39;s your clutch break gas now you&amp;#39;re</text><text start="72.08" dur="5.2">ready you got</text><text start="74.88" dur="5.279">this this has to be the weirdest sound</text><text start="77.28" dur="2.879">I&amp;#39;ve ever heard from a</text><text start="88.84" dur="3">choir</text><text start="108.68" dur="3.68">how do you even end up in this type of</text><text start="118.28" dur="9.319">situation want to hug him I wish I could</text><text start="121.759" dur="9.881">yeah and kiss him yeah cuz you love him</text><text start="127.599" dur="4.041">yeah well was your dad&amp;#39;s</text><text start="131.84" dur="4.24">dead bro No One Believes me that my dog</text><text start="134.239" dur="3.801">is scared of Kim Jong-un he does not</text><text start="136.08" dur="4.239">like him who is this</text><text start="138.04" dur="5.839">Johnny who is</text><text start="140.319" dur="6.481">that yeah you tell</text><text start="143.879" dur="7.241">him yeah you tell this baby gorilla</text><text start="146.8" dur="7.4">really wants this toy eat it</text><text start="151.12" dur="5.64">yeah I want that I</text><text start="154.2" dur="4.92">know I found a company that makes really</text><text start="156.76" dur="2.36">trippy</text><text start="163.48" dur="3.679">vases this woman somehow gave birth to a</text><text start="166.2" dur="3.679">giant</text><text start="167.159" dur="6.841">baby here he</text><text start="169.879" dur="6.921">is and oh sorry baby I can barely hold</text><text start="174" dur="6.08">him but anyways he is the last time we</text><text start="176.8" dur="5.439">checked he was 24.4 lb this guy proposed</text><text start="180.08" dur="6.92">to his girlfriend at a waffle house I</text><text start="182.239" dur="4.761">just have one question will you marry</text><text start="190.08" dur="3.64">me I got</text><text start="195.08" dur="5.04">you what&amp;#39; you say I will</text><text start="205.08" dur="4.799">okay that is the end of this video we</text><text start="207.64" dur="6.599">hope you enjoyed and I&amp;#39;ll see you guys</text><text start="209.879" dur="4.36">again very very soon later</text></transcript>`;

        // console.log(JSON.stringify(parser.parse(xml)));
        
        let result = parser.parse(xmlData);

        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
 
    
});