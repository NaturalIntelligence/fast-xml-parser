process.env.NODE_ENV = 'test';
//https://github.com/chaijs/chai-http

const Browser = require('zombie');
const httpServer = require('http-server');

describe("DemoApp", function() {
  var browser = new Browser({site: 'http://localhost:8080'});
  var server = httpServer.createServer();
  server.listen(8080);

  beforeEach(function(done){
      browser.visit('/', done);
  });
    
  describe("Parse XML", function() {

    it("should parse xml to json", function(done) {
       browser.pressButton('#submit');
       //console.log(browser.text('#result'));
       browser.assert.text('#result', '{ "any_name": { "person": [ { "phone": [ 122233344550, 122233344551 ], "name": "Jack", "age": 33, "married": "Yes", "birthday": "Wed, 28 Mar 1979 12:13:14 +0300", "address": [ { "city": "New York", "street": "Park Ave", "buildingNo": 1, "flatNo": 1 }, { "city": "Boston", "street": "Centre St", "buildingNo": 33, "flatNo": 24 } ] }, { "phone": [ 122233344553, 122233344554 ], "name": "Boris", "age": 34, "married": "Yes", "birthday": "Mon, 31 Aug 1970 02:03:04 +0300", "address": [ { "city": "Moscow", "street": "Kahovka", "buildingNo": 1, "flatNo": 2 }, { "city": "Tula", "street": "Lenina", "buildingNo": 3, "flatNo": 78 } ] } ] } }');
       done();
    });
   });

   afterEach(function(){
       server.close();
   })
});