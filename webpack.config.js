"use strict";

module.exports = [
    {
        context: __dirname,
        entry: "./src/fxp.js",
        mode: "development",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxparser.js",
            library: "fxparser",
            libraryTarget: "var"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                }
            ]
        },
        target: "web"
    }
];
