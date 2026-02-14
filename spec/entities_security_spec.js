import { XMLParser } from "../src/fxp.js";

describe("XMLParser entity expansion security", function () {

  // =================================================================
  // MAX ENTITY SIZE TESTS
  // =================================================================

  describe("maxEntitySize limit", function () {
    it("should throw error when entity size exceeds maxEntitySize", function () {
      const entity = 'A'.repeat(15000);
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>&big;</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 10000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Entity "big" size .* exceeds maximum allowed size/);
    });

    it("should allow entity within maxEntitySize", function () {
      const entity = 'A'.repeat(5000);
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>&big;</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 10000
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual(entity);
    });

    it("should use default maxEntitySize of 10000", function () {
      const entity = 'A'.repeat(15000);
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>&big;</root>`;

      const options = {
        processEntities: {}  // Use defaults
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Entity "big" size .* exceeds maximum allowed size/);
    });
  });

  // =================================================================
  // MAX TOTAL EXPANSIONS TESTS
  // =================================================================

  describe("maxTotalExpansions limit", function () {
    it("should throw error when total expansions exceed limit", function () {
      const entity = 'A'.repeat(10);
      const refs = '&big;'.repeat(1500);  // 1500 expansions
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxTotalExpansions: 1000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Entity expansion limit exceeded/);
    });

    it("should allow expansions within limit", function () {
      const entity = 'A'.repeat(10);
      const refs = '&big;'.repeat(500);  // 500 expansions
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxTotalExpansions: 1000
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual('A'.repeat(5000));
    });

    it("should count expansions across multiple tags", function () {
      const entity = 'X';
      const refs = '&e;'.repeat(600);
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]>
                <root>
                    <tag1>${refs}</tag1>
                    <tag2>${refs}</tag2>
                </root>`;

      const options = {
        processEntities: {
          maxTotalExpansions: 1000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Entity expansion limit exceeded/);
    });
  });

  // =================================================================
  // MAX EXPANDED LENGTH TESTS
  // =================================================================

  describe("maxExpandedLength limit", function () {
    it("should throw error when expanded content exceeds maxExpandedLength", function () {
      const entity = 'A'.repeat(1000);
      const refs = '&big;'.repeat(150);  // 150 * 1000 = 150,000 chars
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxExpandedLength: 100000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Total expanded content size exceeded/);
    });

    it("should allow expansions within maxExpandedLength", function () {
      const entity = 'A'.repeat(100);
      const refs = '&big;'.repeat(500);  // 500 * 100 = 50,000 chars
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxExpandedLength: 100000
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual('A'.repeat(50000));
    });
  });

  // =================================================================
  // BILLION LAUGHS ATTACK PREVENTION
  // =================================================================

  describe("Billion laughs attack prevention", function () {
    it("should prevent billion laughs attack with maxEntitySize", function () {
      const entity = 'A'.repeat(50000);
      const refs = '&big;'.repeat(100);  // Would be 5MB but blocked at definition
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 10000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Entity "big" size .* exceeds maximum allowed size/);
    });

    it("should prevent billion laughs with maxTotalExpansions", function () {
      const entity = 'A'.repeat(100);
      const refs = '&big;'.repeat(5000);  // Too many expansions
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxTotalExpansions: 1000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Entity expansion limit exceeded/);
    });

    it("should prevent billion laughs with maxExpandedLength", function () {
      const entity = 'A'.repeat(1000);
      const refs = '&big;'.repeat(200);  // 200KB output
      const xmlData = `<!DOCTYPE foo [<!ENTITY big "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxExpandedLength: 100000
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Total expanded content size exceeded/);
    });
  });

  // =================================================================
  // TAG FILTERING - ALLOWEDTAGS TESTS
  // =================================================================

  describe("allowedTags filtering", function () {
    it("should only expand entities in allowed tags", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "REPLACED">]>
                <root>
                    <allowed>&test;</allowed>
                    <blocked>&test;</blocked>
                </root>`;

      const options = {
        processEntities: {
          allowedTags: ['allowed']
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.allowed).toEqual("REPLACED");
      expect(result.root.blocked).toEqual("&test;");
    });

    it("should expand entities in all tags when allowedTags is null", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "REPLACED">]>
                <root>
                    <tag1>&test;</tag1>
                    <tag2>&test;</tag2>
                </root>`;

      const options = {
        processEntities: {
          allowedTags: null
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.tag1).toEqual("REPLACED");
      expect(result.root.tag2).toEqual("REPLACED");
    });

    it("should work with multiple allowed tags", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "OK">]>
                <root>
                    <description>&test;</description>
                    <content>&test;</content>
                    <script>&test;</script>
                </root>`;

      const options = {
        processEntities: {
          allowedTags: ['description', 'content']
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.description).toEqual("OK");
      expect(result.root.content).toEqual("OK");
      expect(result.root.script).toEqual("&test;");
    });
  });

  // =================================================================
  // TAG FILTERING - TAGFILTER FUNCTION TESTS
  // =================================================================

  describe("tagFilter function", function () {
    it("should use custom filter function to control entity expansion", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "REPLACED">]>
                <root>
                    <safe>&test;</safe>
                    <script>&test;</script>
                    <code>&test;</code>
                </root>`;

      const options = {
        processEntities: {
          tagFilter: (tagName, jPath) => {
            return !['script', 'code'].includes(tagName);
          }
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.safe).toEqual("REPLACED");
      expect(result.root.script).toEqual("&test;");
      expect(result.root.code).toEqual("&test;");
    });

    it("should pass jPath to tagFilter function", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "OK">]>
                <root>
                    <level1>
                        <dangerous>&test;</dangerous>
                    </level1>
                    <safe>&test;</safe>
                </root>`;

      const options = {
        processEntities: {
          tagFilter: (tagName, jPath) => {
            // Block expansion in nested dangerous paths
            return !jPath.includes('level1.dangerous');
          }
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.safe).toEqual("OK");
      expect(result.root.level1.dangerous).toEqual("&test;");
    });
  });

  // =================================================================
  // PERFORMANCE OPTIMIZATION TESTS
  // =================================================================

  describe("Performance optimization", function () {
    it("should skip entity processing when no ampersand present", function () {
      const xmlData = `<root>
                <tag1>No entities here</tag1>
                <tag2>Just plain text</tag2>
                <tag3>More text without entities</tag3>
            </root>`;

      const options = {
        processEntities: true
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.tag1).toEqual("No entities here");
      expect(result.root.tag2).toEqual("Just plain text");
      expect(result.root.tag3).toEqual("More text without entities");
    });

    it("should process standard entities correctly", function () {
      const xmlData = `<root>
                <tag1>&lt;test&gt;</tag1>
                <tag2>&amp; &quot; &apos;</tag2>
            </root>`;

      const options = {
        processEntities: true
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root.tag1).toEqual("<test>");
      expect(result.root.tag2).toEqual('& " \'');
    });
  });

  // =================================================================
  // COMBINED LIMITS TESTS
  // =================================================================

  describe("Combined security limits", function () {
    it("should work with all limits configured", function () {
      const entity = 'A'.repeat(100);
      const refs = '&e;'.repeat(50);
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 1000,
          maxTotalExpansions: 100,
          maxExpandedLength: 10000,
          allowedTags: ['root']
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual('A'.repeat(5000));
    });

    it("should enforce strictest applicable limit", function () {
      const entity = 'X'.repeat(100);
      const refs = '&e;'.repeat(200);  // Would be 20,000 chars
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 1000,         // OK (100 < 1000)
          maxTotalExpansions: 1000,    // OK (200 < 1000)
          maxExpandedLength: 10000     // FAIL (20000 > 10000)
        }
      };
      const parser = new XMLParser(options);

      expect(function () {
        parser.parse(xmlData);
      }).toThrowError(/Total expanded content size exceeded/);
    });
  });

  // =================================================================
  // ENTITY IN ATTRIBUTES TESTS
  // =================================================================

  describe("Entities in attributes", function () {
    it("should expand entities in attributes when enabled", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "value">]>
                <root attr="&test;">text</root>`;

      const options = {
        ignoreAttributes: false,
        processEntities: true
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root["@_attr"]).toEqual("value");
    });

    it("should respect limits for entities in attributes", function () {
      const entity = 'A'.repeat(100);
      const refs = '&e;'.repeat(50);
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]>
                <root attr="${refs}">text</root>`;

      const options = {
        ignoreAttributes: false,
        processEntities: {
          maxTotalExpansions: 100
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root["@_attr"]).toEqual('A'.repeat(5000));
    });
  });

  // =================================================================
  // EDGE CASES
  // =================================================================

  describe("Edge cases", function () {
    it("should handle empty entity definitions", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY empty "">]>
                <root>&empty;test</root>`;

      const options = {
        processEntities: true
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual("test");
    });

    it("should handle multiple different entities", function () {
      const xmlData = `<!DOCTYPE root [
                <!ENTITY e1 "AAA">
                <!ENTITY e2 "BBB">
                <!ENTITY e3 "CCC">
            ]><root>&e1;&e2;&e3;</root>`;

      const options = {
        processEntities: true
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual("AAABBBCCC");
    });

    it("should reset counters between parse calls", function () {
      const entity = 'X';
      const refs = '&e;'.repeat(600);
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxTotalExpansions: 1000
        }
      };
      const parser = new XMLParser(options);

      // First parse should succeed
      const result1 = parser.parse(xmlData);
      expect(result1.root).toEqual('X'.repeat(600));

      // Second parse should also succeed (counters reset)
      const result2 = parser.parse(xmlData);
      expect(result2.root).toEqual('X'.repeat(600));
    });

    it("should handle entity expansion with enabled: false", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "value">]>
                <root>&test;</root>`;

      const options = {
        processEntities: {
          enabled: false
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual("&test;");
    });

    it("should work with small limits for strict security", function () {
      const entity = 'A'.repeat(50);
      const refs = '&e;'.repeat(10);
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 100,
          maxTotalExpansions: 20,
          maxExpandedLength: 1000
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual('A'.repeat(500));
    });
  });

  // =================================================================
  // CONFIGURATION VALIDATION TESTS
  // =================================================================

  describe("Configuration normalization", function () {
    it("should normalize boolean true to object with enabled: true", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "value">]><root>&test;</root>`;

      const options = {
        processEntities: true
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual("value");
    });

    it("should normalize boolean false to object with enabled: false", function () {
      const xmlData = `<!DOCTYPE root [<!ENTITY test "value">]><root>&test;</root>`;

      const options = {
        processEntities: false
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      expect(result.root).toEqual("&test;");
    });

    it("should merge partial config with defaults", function () {
      const entity = 'A'.repeat(100);
      const refs = '&e;'.repeat(50);
      const xmlData = `<!DOCTYPE root [<!ENTITY e "${entity}">]><root>${refs}</root>`;

      const options = {
        processEntities: {
          maxEntitySize: 200  // Only set one option
        }
      };
      const parser = new XMLParser(options);
      const result = parser.parse(xmlData);

      // Should use defaults for other limits
      expect(result.root).toEqual('A'.repeat(5000));
    });
  });
});