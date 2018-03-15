// Copyright 2013 Timothy J Fontaine <tjfontaine@gmail.com>
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the 'Software'), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE

/*

Read any stream all the way to the end and trigger a single cb

const http = require('http');

const rte = require('readtoend');

http.get('http://nodejs.org', function(response) {
  rte.readToEnd(response, function(err, body) {
    console.log(body);
  });
});

*/

const {Transform} = require("stream");

class ReadToEnd extends Transform {
    constructor(opts) {
        super(opts);
        this._rte_encoding = opts.encoding || "utf8";
        this._buff = "";
    }

    _transform(chunk, encoding, done) {
        this._buff += chunk.toString(this._rte_encoding);
        this.push(chunk);
        done();
    }

    _flush(done) {
        this.emit("complete", undefined, this._buff);
        done();
    }
}

const readToEnd = (stream, options, cb) => {
    if (!cb) {
        cb = options;
        options = {};
    }

    const destStream = new ReadToEnd(options);

    stream.pipe(destStream);

    stream.on("error", function(err) {
        stream.unpipe(destStream);
        cb(err);
    });

    destStream.on("complete", cb);

    destStream.resume();

    return destStream;
};

module.exports = {ReadToEnd, readToEnd};
