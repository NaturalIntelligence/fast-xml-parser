"use strict";
module.exports = [
    {
        context: __dirname,
        entry: "./src/cli.js",
        mode: "development",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./parser.cli.js",
            devtoolModuleFilenameTemplate: "[resource-path]",
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
        externals: {
            "./parser": "commonjs ./parser",
            "../package.json": "commonjs ./package.json"
        },
        target: "node"
    },
    {
        context: __dirname,
        entry: "./src/parser.js",
        mode: "development",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./parser.js",
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
    },
    {
        context: __dirname,
        entry: "./src/parser.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./parser.browser.js",
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
    }
];
