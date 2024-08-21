"use strict";

const { XMLParser, XMLBuilder, XMLValidator } = require("../src/fxp");

const xmlData = `
<tag
    ns:attr1="a1-value"
    ns:attr2="a2-value"
    ns2:attr3="a3-value"
    ns2:attr4="a4-value">
        value
</tag>`;

const jsonData = {
    tag: {
        '$ns:attr1': 'a1-value',
        '$ns:attr2': 'a2-value',
        '$ns2:attr3': 'a3-value',
        '$ns2:attr4': 'a4-value',
        tag2: {
            '$ns:attr1': 'a1-value',
            '$ns:attr2': 'a2-value',
            '$ns2:attr3': 'a3-value',
            '$ns2:attr4': 'a4-value',            
        }
    }
}

describe("XMLParser", function () {

    it('must ignore parsing attributes by array of strings', () => {

        const options = {
            attributeNamePrefix: "$",
            ignoreAttributes: ['ns:attr1', 'ns:attr2'],
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        expect(parser.parse(xmlData)).toEqual({
            tag: {
                '#text': 'value',
                '$ns2:attr3': 'a3-value',
                '$ns2:attr4': 'a4-value',
            },
        })

        expect(XMLValidator.validate(xmlData)).toBe(true);
    })

    it('must ignore parsing attributes by array of RegExp', () => {

        const options = {
            attributeNamePrefix: "$",
            ignoreAttributes: [/^ns2:/],
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        expect(parser.parse(xmlData)).toEqual({
            tag: {
                '#text': 'value',
                '$ns:attr1': 'a1-value',
                '$ns:attr2': 'a2-value',
            },
        })

        expect(XMLValidator.validate(xmlData)).toBe(true);
    })

    it('must ignore parsing attributes via callback fn', () => {
        const xmlData = `
        <tag
            ns:attr1="a1-value"
            ns:attr2="a2-value"
            ns2:attr3="a3-value"
            ns2:attr4="a4-value">
            <tag2
                ns:attr1="a1-value"
                ns:attr2="a2-value"
                ns2:attr3="a3-value"
                ns2:attr4="a4-value">
                value
            </tag2>
        </tag>`;

        const options = {
            attributeNamePrefix: "$",
            ignoreAttributes: (aName, jPath) => aName.startsWith('ns:') || jPath === 'tag.tag2',
            parseAttributeValue: true
        };
        const parser = new XMLParser(options);
        expect(parser.parse(xmlData)).toEqual({
            tag: {
                '$ns2:attr3': 'a3-value',
                '$ns2:attr4': 'a4-value',
                tag2: 'value',
            },
        })

        expect(XMLValidator.validate(xmlData)).toBe(true);
    })


    it('must ignore building attributes by array of strings', () => {

        const options = {
            attributeNamePrefix: "$",
            ignoreAttributes: ['ns:attr1', 'ns:attr2'],
            parseAttributeValue: true
        };
        const builder = new XMLBuilder(options);
        expect(builder.build(jsonData)).toEqual('<tag ns2:attr3="a3-value" ns2:attr4="a4-value"><tag2 ns2:attr3="a3-value" ns2:attr4="a4-value"></tag2></tag>')

        expect(XMLValidator.validate(xmlData)).toBe(true);
    })

    it('must ignore building attributes by array of RegExp', () => {

        const options = {
            attributeNamePrefix: "$",
            ignoreAttributes: [/^ns2:/],
            parseAttributeValue: true
        };
        const builder = new XMLBuilder(options);
        expect(builder.build(jsonData)).toEqual('<tag ns:attr1="a1-value" ns:attr2="a2-value"><tag2 ns:attr1="a1-value" ns:attr2="a2-value"></tag2></tag>')

        expect(XMLValidator.validate(xmlData)).toBe(true);
    })

    it('must ignore building attributes via callback fn', () => {

        const options = {
            attributeNamePrefix: "$",
            ignoreAttributes: (aName, jPath) => aName.startsWith('ns:') || jPath === 'tag.tag2',
            parseAttributeValue: true
        };
        const builder = new XMLBuilder(options);
        expect(builder.build(jsonData)).toEqual('<tag ns2:attr3="a3-value" ns2:attr4="a4-value"><tag2></tag2></tag>')

        expect(XMLValidator.validate(xmlData)).toBe(true);
    })
})