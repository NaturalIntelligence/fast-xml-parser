"use strict";
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the file URL of the current module
const __filename = fileURLToPath(import.meta.url);

// Derive the directory name
const __dirname = dirname(__filename);

export default [
    {
        context: __dirname,
        entry: "./src/fxp.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxp.min.esm.js", // Change filename for ESM
            library: {
                type: "module", // Output as ESM
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                }
            ]
        },
        experiments: {
            outputModule: true, // Enable ESM output
        },
        target: "web"
    },
    {
        context: __dirname,
        entry: "./src/xmlbuilder/json2xml.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxbuilder.min.esm.js", // Change filename for ESM
            library: {
                type: "module", // Output as ESM
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                }
            ]
        },
        experiments: {
            outputModule: true, // Enable ESM output
        },
        target: "web"
    },
    {
        context: __dirname,
        entry: "./src/xmlparser/XMLParser.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxparser.min.esm.js", // Change filename for ESM
            library: {
                type: "module", // Output as ESM
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                }
            ]
        },
        experiments: {
            outputModule: true, // Enable ESM output
        },
        target: "web"
    },
    {
        context: __dirname,
        entry: "./src/validator.js",
        mode: "production",
        devtool: "source-map",
        output: {
            path: __dirname,
            filename: "./lib/fxvalidator.min.esm.js", // Change filename for ESM
            library: {
                type: "module", // Output as ESM
            },
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader"
                }
            ]
        },
        experiments: {
            outputModule: true, // Enable ESM output
        },
        target: "web"
    }
];
