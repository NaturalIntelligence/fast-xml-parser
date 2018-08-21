"use strict";

module.exports = [
    {
        context: __dirname,
        entry: "./src/parser.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/parser.js",
            library: "parser",
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
    },
    {
        context: __dirname,
        entry: "./src/parser.js",
        mode: "development",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/parser.node.js",
            devtoolModuleFilenameTemplate: "[resource-path]",
            library: "parser",
            libraryTarget: "commonjs2"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                }
            ]
        },
        externals: Object.keys(require("./package.json").dependencies)
                         .reduce(function(acc, key) {
                             acc[key] = `commonjs ${key}`;
                             return acc;
                         }, {}),
        target: "node"
    }
];
