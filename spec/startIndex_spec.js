
import { XMLParser } from "../src/fxp.js";

describe("XMLParser", function () {

    const xmlData = `<root><foo/><bar type="quux"/><bar type="bat"/></root>`;
    const XML_METADATA = XMLParser.getMetaDataSymbol();

    it("should support captureMetadata && !preserveOrder", function () {
        const expected = {
            root: {
                [XML_METADATA]: { startIndex: 0 },
                // TODO: investigate why this is ''
                foo: '',
                // foo: {
                //     [XML_METADATA]: { startIndex: 6 },
                // },
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
                ],
                [XML_METADATA]: { startIndex: 0 },
            }
        ];

        const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, captureMetaData: true });
        const result = parser.parse(xmlData);
        // console.dir({ result, expected }, { depth: Infinity });
        expect(result).toEqual(expected);
    });
});
