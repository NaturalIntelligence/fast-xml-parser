
import { XMLParser } from "../src/fxp.js";

const XML_METADATA = XMLParser.getMetaDataSymbol();

/** Collect [rawTagName, metadata] for every node carrying metadata, in document order. */
function collectMeta(node, out = []) {
    if (node === null || typeof node !== "object") return out;
    if (node[XML_METADATA]) {
        const tag = Object.keys(node).find((k) => k !== ":@" && k !== "#text");
        out.push([tag, node[XML_METADATA]]);
    }
    if (Array.isArray(node)) {
        node.forEach((n) => collectMeta(n, out));
    } else {
        for (const k of Object.keys(node)) collectMeta(node[k], out);
    }
    return out;
}

/** Parse xml with metadata capture on and return a Map of rawTagName -> raw text span. */
function parseSpans(xml) {
  const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, captureMetaData: true });
  const result = parser.parse(xml);
  return new Map(collectMeta(result).map(([tag, m]) => [tag, xml.slice(m.startIndex, m.endIndex)]));
}

describe("XMLParser captureMetaData endIndex", function () {
  it("does not add metadata (start or end) when captureMetaData is off", function () {
    const xml = `<root><child/></root>`;
    const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false });
    const result = parser.parse(xml);
    expect(collectMeta(result).length).toBe(0);
  });

  it("records an exclusive endIndex", function () {
        const xml = `<root><foo/><bar type="quux"/><baz type="foo">FOO</baz></root>`;
        const parser = new XMLParser({ preserveOrder: true, ignoreAttributes: false, captureMetaData: true });
        const result = parser.parse(xml);

        const meta = collectMeta(result);
        const spans = meta.map(([tag, m]) => [tag, xml.slice(m.startIndex, m.endIndex)]);

        expect(spans).toEqual([
            ["root", `<root><foo/><bar type="quux"/><baz type="foo">FOO</baz></root>`],
            ["foo", `<foo/>`],
            ["bar", `<bar type="quux"/>`],
            ["baz", `<baz type="foo">FOO</baz>`],
        ]);
    });

    it("covers self-closing elements", function () {
        const xml = `<a><c/></a>`;
        expect(parseSpans(xml).get("c")).toBe(`<c/>`);
    });

    it("covers paired elements with text content", function () {
        const xml = `<a><d>text</d></a>`;
        expect(parseSpans(xml).get("d")).toBe(`<d>text</d>`);
    });

    it("covers elements with inline attributes", function () {
        const xml = `<a><e id="1" name="foo"/><f class="bar">text</f></a>`;
        const byTag = parseSpans(xml);
        expect(byTag.get("e")).toBe(`<e id="1" name="foo"/>`);
        expect(byTag.get("f")).toBe(`<f class="bar">text</f>`);
    });

    it("covers deeply nested elements", function () {
        const xml = `<a><b><c/></b><d>text</d></a>`;
        const byTag = parseSpans(xml);
        expect(byTag.get("a")).toBe(`<a><b><c/></b><d>text</d></a>`);
        expect(byTag.get("b")).toBe(`<b><c/></b>`);
    });

    it("covers processing-instruction nodes", function () {
        const xml = `<?xml version="1.0"?><a><?pi target?><c/></a>`;
        const byTag = parseSpans(xml);
        expect(byTag.get("?xml")).toBe(`<?xml version="1.0"?>`);
        expect(byTag.get("?pi")).toBe(`<?pi target?>`);
    });

    it("does not corrupt a sibling's endIndex when updateTag drops a node", function () {
        const xml = `<a><b>x</b><skip/><?skip pi?><skip>y</skip></a>`;
        const parser = new XMLParser({
            preserveOrder: true,
            ignoreAttributes: false,
            captureMetaData: true,
            updateTag: (tagName) => (tagName === "skip" || tagName === "?skip" ? false : tagName),
        });
        const result = parser.parse(xml);

        const byTag = new Map(collectMeta(result).map(([tag, m]) => [tag, xml.slice(m.startIndex, m.endIndex)]));
        expect(byTag.get("b")).toBe(`<b>x</b>`);
        expect(byTag.get("a")).toBe(xml);
    });
});
