"use strict";
const path = require("path");

module.exports = {
    entry:  path.resolve(__dirname, "src/parser.js"),
    mode:   "production",
    output: {
        path:          path.resolve(__dirname, "lib"),
        filename:      "parser.js",
        library:       "parser",
        libraryTarget: "umd" //note: due bug in webpack https://github.com/webpack/webpack/issues/6522, need replace windows with this||window
    },
    module: {
        rules: [
            {
                test:   /\.js$/,
                loader: "babel-loader"
            }
        ]
    },
    target: "web"
};
