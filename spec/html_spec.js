
const {XMLParser, XMLBuilder} = require("../src/fxp");

describe("XMLParser", function() {

    it("should parse HTML with basic entities, <pre>, <script>, <br>", function() {
      Object.prototype.something = 'strange';
      const html = `
        <html lang="en">
            <head>
                <script>
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
        
                    gtag('config', 'UA-80202630-2');
                </script>
        
                <title>Fast XML Parser</title>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <link rel="stylesheet" href="static/css/bootstrap.min.css">
                <link rel="stylesheet" href="static/css/jquery-confirm.min.css">
                <link rel="stylesheet" type="text/css" href="style.css">
        
                <script src="static/js/jquery-3.2.1.min.js"></script>
                <style>
                    .CodeMirror{
                        height: 100%;
                        width: 100%;
                    }
                </style>
            </head>
            <body role="document" style="background-color: #2c3e50;">
            <h1>Heading</h1>
            <hr>
            <h2>&inr;</h2>
                <pre>
                    <h1>Heading</h1>
                    <hr>
                    <h2>&inr;</h2>
                </pre>
                <script>
                  let highlightedLine = null;
                  let editor;
                    <!-- this should not be parsed separately -->
                  function updateLength(){
                      const xmlData = editor.getValue();
                      $("#lengthxml")[0].innerText = xmlData.replace(/>\s*</g, "><").length;
                  }
                </script>
            </body>
        </html>`;

const parsingOptions = {
    ignoreAttributes: false,
    preserveOrder: true,
    unpairedTags: ["hr", "br", "link", "meta"],
    stopNodes : [ "*.pre", "*.script"],
    processEntities: true,
    htmlEntities: true,
    
  };
  const parser = new XMLParser(parsingOptions);
  let result = parser.parse(html);
//   console.log(JSON.stringify(result, null,4));

  const builderOptions = {
    ignoreAttributes: false,
    format: true,
    preserveOrder: true,
    suppressEmptyNode: false,
    unpairedTags: ["hr", "br", "link", "meta"],
    stopNodes : [ "*.pre", "*.script"],
  }
  const builder = new XMLBuilder(builderOptions);
  let output = builder.build(result);
//   console.log(output);
    output = output.replace('₹','&inr;');
  expect(output.replace(/\s+/g, "")).toEqual(html.replace(/\s+/g, ""));
    });
});