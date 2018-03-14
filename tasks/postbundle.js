var fs = require('fs')
fs.readFile("lib/parser.js", 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var result = data.replace(/const |let /g, 'var ');

  fs.writeFile("lib/parser.js", result, 'utf8', function (err) {
     if (err) return console.log(err);
  });
});