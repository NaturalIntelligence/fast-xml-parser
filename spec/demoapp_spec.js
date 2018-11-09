"use strict";

process.env.NODE_ENV = "test";
//https://github.com/chaijs/chai-http
const portfinder = require("portfinder");
const Browser = require("zombie");
const httpServer = require("http-server");

describe("DemoApp", function() {
    let server;
    let browser;

    beforeEach(function(done) {
        portfinder.getPort(function(err, port) {
            if (err) {
                return done(err);
            }
            server = httpServer.createServer();
            server.listen(port);
            browser = new Browser({site: "http://localhost:" + port});
            //
            // `port` is guaranteed to be a free port
            // in this scope.
            //
            browser.visit("/", done);
        });
    });

    describe("Parse XML", function() {
        it("should parse xml to json", function(done) {
            //browser.assert.input('#textNodeConversion', true);
          browser.pressButton("#toJson");
          browser.assert.attribute("#result",
            "{ \"any_name\": { \"person\": [ { \"phone\": [ 122233344550, 122233344551 ], \"name\": \"Jack\", \"age\": 33, \"married\": \"Yes\", \"birthday\": \"Wed, 28 Mar 1979 12:13:14 +0300\", \"address\": [ { \"city\": \"New York\", \"street\": \"Park Ave\", \"buildingNo\": 1, \"flatNo\": 1 }, { \"city\": \"Boston\", \"street\": \"Centre St\", \"buildingNo\": 33, \"flatNo\": 24 } ] }, { \"phone\": [ 122233344553, 122233344554 ], \"name\": \"Boris\", \"age\": 34, \"married\": \"Yes\", \"birthday\": \"Mon, 31 Aug 1970 02:03:04 +0300\", \"address\": [ { \"city\": \"Moscow\", \"street\": \"Kahovka\", \"buildingNo\": 1, \"flatNo\": 2 }, { \"city\": \"Tula\", \"street\": \"Lenina\", \"buildingNo\": 3, \"flatNo\": 78 } ] } ] } }");
          done();
        });
    });

    afterEach(function() {
        server.close();
    });
});
