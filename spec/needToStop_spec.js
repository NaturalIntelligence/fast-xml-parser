"use strict";

const parser = require("../src/parser");

describe("XMLParser", function() {
    it("stop by tag name", () => {
        const xml = `<content>
        <html><p><a href="hello.world">hello world</a></p></html>
        <obj><title>hello world</title><link>hello.world</link></obj>
        </content>`;

        const result = parser.parse(xml, {
            needToStop: tag => tag === 'html',
        });

        expect(result).toEqual({
            content: {
                html: '<p><a href="hello.world">hello world</a></p>',
                obj: {
                    title: 'hello world',
                    link: 'hello.world'
                }
            }
        });
    });

    it("stop by attr", () => {
        const xml = `<content>
        <html><p><a href="hello.world">hello world</a></p></html>
        <text type="html"><p><a href="hello.world">hello world</a></p></text>
        <text isHTML><p><a href="https://php.net/">PHP is the best programming language</a></p></text>
        <obj><title>hello world</title><link>hello.world</link></obj>
        </content>`;

        const result = parser.parse(xml, {
            attributeNamePrefix: "",
            attrNodeName: "__attr",
            textNodeName: "__text",
            allowBooleanAttributes: true,
            ignoreAttributes: false,
            needToStop: (tag, attr) => tag === "html" || attr.isHTML || attr.type === "html",
        });

        expect(result).toEqual({
            content: {
                html: '<p><a href="hello.world">hello world</a></p>',
                text: [
                    {
                        __text: '<p><a href="hello.world">hello world</a></p>',
                        __attr: {type: 'html'}
                    },
                    {
                        __text: '<p><a href="https://php.net/">PHP is the best programming language</a></p>',
                        __attr: {isHTML: true}
                    }
                ],
                obj: {
                    title: 'hello world',
                    link: 'hello.world'
                }
            }
        });
    });

    it("compatible with stopNodes", () => {
        const xml = `<content>
        <html><p><a href="hello.world">hello world</a></p></html>
        <text type="html"><p><a href="hello.world">hello world</a></p></text>
        <text isHTML><p><a href="https://php.net/">PHP is the best programming language</a></p></text>
        <obj><title>hello world</title><link>hello.world</link></obj>
        </content>`;

        const result = parser.parse(xml, {
            attributeNamePrefix: "",
            attrNodeName: "__attr",
            textNodeName: "__text",
            allowBooleanAttributes: true,
            ignoreAttributes: false,
            stopNodes: ["html"],
            needToStop: (tag, attr) => attr.isHTML || attr.type === "html",
        });

        expect(result).toEqual({
            content: {
                html: '<p><a href="hello.world">hello world</a></p>',
                text: [
                    {
                        __text: '<p><a href="hello.world">hello world</a></p>',
                        __attr: {type: 'html'}
                    },
                    {
                        __text: '<p><a href="https://php.net/">PHP is the best programming language</a></p>',
                        __attr: {isHTML: true}
                    }
                ],
                obj: {
                    title: 'hello world',
                    link: 'hello.world'
                }
            }
        });
    });
})
