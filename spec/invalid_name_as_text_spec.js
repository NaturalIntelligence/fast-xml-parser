"use strict";

import { XMLParser, XMLBuilder } from "../src/fxp.js";

describe("Invalid XML names kept as text (#779)", function () {
  it("should keep <...> placeholders as text instead of inventing tags", function () {
    const xmlData = `<?xml version="1.0"?>
<root>
  <p>before <...> after <...> end</p>
  <foo></foo>
</root>`;
    const parser = new XMLParser({
      preserveOrder: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
    });
    const result = parser.parse(xmlData);
    expect(result).toEqual([
      {
        root: [
          {
            p: [{ "#text": "before <...> after <...> end" }],
          },
          { foo: [] },
        ],
      },
    ]);
  });

  it("should keep bare '<' comparisons in text (e.g. 1 < 3)", function () {
    const xmlData = `<?xml version="1.0"?>
<root>
<p>if (1 < 3) return text;</p>
</root>
`;
    const parser = new XMLParser({
      preserveOrder: true,
      ignoreAttributes: false,
      ignoreDeclaration: true,
    });
    const result = parser.parse(xmlData);
    expect(result).toEqual([
      {
        root: [
          {
            p: [{ "#text": "if (1 < 3) return text;" }],
          },
        ],
      },
    ]);

    const builder = new XMLBuilder({
      ignoreAttributes: false,
      preserveOrder: true,
    });
    expect(builder.build(result)).toBe(
      "<root><p>if (1 &lt; 3) return text;</p></root>"
    );
  });
});
