"use strict";

module.exports = [
    {
        context: __dirname,
        entry: "./src/fxp.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxp.min.js",
            library: "fxp",
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
    },{
        context: __dirname,
        entry: "./src/xmlbuilder/json2xml.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxbuilder.min.js",
            library: "XMLBuilder",
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
    },{
        context: __dirname,
        entry: "./src/xmlparser/XMLParser.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxparser.min.js",
            library: "XMLParser",
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
    },{
        context: __dirname,
        entry: "./src/validator.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxvalidator.min.js",
            library: "XMLValidator",
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
