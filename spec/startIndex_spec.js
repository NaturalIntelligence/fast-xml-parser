
import { XMLParser } from "../src/fxp.js";

describe("XMLParser", function () {

    const xmlData = `<root><foo/><bar type="quux"/><bar type="bat"/><baz type="foo">FOO</baz></root>`;
    const XML_METADATA = XMLParser.getMetaDataSymbol();

    it("should support captureMetadata && !preserveOrder", function () {
        const expected = {
            root: {
                [XML_METADATA]: { startIndex: 0 },
                foo: '',
                bar: [
                    {
                        [XML_METADATA]: { startIndex: 12 },
                        "@_type": 'quux'
                    },
                    {
                        [XML_METADATA]: { startIndex: 30 },
                        "@_type": 'bat'
                    },
                ],
                baz: {
                    '@_type': 'foo',
                    '#text': 'FOO',
                    [XML_METADATA]: {startIndex: 47},
                }
            }
        };

        const parser = new XMLParser({ preserveOrder: false, ignoreAttributes: false, captureMetaData: true });
        const result = parser.parse(xmlData);
        // console.dir({ result, expected }, { depth: Infinity });
        expect(result).toEqual(expected);
    });
    it("should support captureMetadata && preserveOrder", function () {
        const expected = [
            {
                root: [
                    { foo: [], [XML_METADATA]: { startIndex: 6 } },
                    {
                        bar: [],
                        ':@': { "@_type": 'quux' },
                        [XML_METADATA]: { startIndex: 12 },
                    },
                    {
                        bar: [],
                        ':@': { "@_type": 'bat' },
                        [XML_METADATA]: { startIndex: 30 },
                    },
                    {
                        baz: [{ '#text': 'FOO' }],
                        ':@': { '@_type': 'foo' },
                        [XML_METADATA]: {startIndex: 47},
                    },
                ],
                [XML_METADATA]: { startIndex: 0 },
            }
        ];

        const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, captureMetaData: true });
        const result = parser.parse(xmlData);
        // console.dir({ result, expected }, { depth: Infinity });
        expect(result).toEqual(expected);
    });
    const xmlData2 = `<root><foo/><bar type="quux"/><bar type="bat"/><baz type="foo">FOO</baz><stop>This is a <b>stop</b> node.</stop><unpaired attr="1"></root>`;

    it("should support captureMetadata && isArray && stopNodes && unpairedTags && updateTag", function () {
        const expected = {
            ROOT: {
                [XML_METADATA]: { startIndex: 0 },
                foo: [''],
                bar: [
                    {
                        [XML_METADATA]: { startIndex: 12 },
                        "@_type": 'quux'
                    },
                    {
                        [XML_METADATA]: { startIndex: 30 },
                        "@_type": 'bat'
                    },
                ],
                baz: {
                    '#text': 'FOO',
                    '@_type': 'foo',
                    [XML_METADATA]: { startIndex: 47 },
                },
                // no metadata on stop nodes.
                stop: 'This is a <b>stop</b> node.',
                unpaired: {
                    '@_attr': '1',
                    [XML_METADATA]: { startIndex: 112 },
                }
            }
        };

        const parser = new XMLParser({
            preserveOrder: false, ignoreAttributes: false, captureMetaData: true,
            isArray(tagName) {
                return (tagName == 'foo');
            },
            stopNodes: [ 'root.stop' ], unpairedTags: ['unpaired'], 
            updateTag(tagName) {
                if (tagName === 'root') {
                    tagName = 'ROOT';
                }
                return tagName;
            },
        });
        const result = parser.parse(xmlData2);
        // console.dir({ result, expected }, { depth: Infinity });
        expect(result).toEqual(expected);
    });


});
