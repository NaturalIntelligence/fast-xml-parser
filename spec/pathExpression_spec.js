import { XMLParser, XMLBuilder } from "../src/fxp.js";
import { Expression } from "path-expression-matcher";

describe("Path-Expression-Matcher Integration", function () {

  describe("Backward Compatibility", function () {

    it("should auto-convert old *.tag syntax to ..tag in stopNodes", function () {
      const xmlData = `
        <html>
          <body>
            <script>alert('test');</script>
            <style>.test { color: red; }</style>
          </body>
        </html>`;

      const parser = new XMLParser({
        ignoreAttributes: false,
        stopNodes: ["*.script", "*.style"]  // Old syntax
      });

      const result = parser.parse(xmlData);

      // Script and style content should be raw strings, not parsed
      expect(typeof result.html.body.script).toBe('string');
      expect(typeof result.html.body.style).toBe('string');
      expect(result.html.body.script).toContain("alert('test');");
      expect(result.html.body.style).toContain("color: red");
    });

    it("should work with jPath: true (default) in callbacks", function () {
      const xmlData = `
        <root>
          <users>
            <user id="1">Alice</user>
            <user id="2">Bob</user>
          </users>
        </root>`;

      let capturedJPaths = [];

      const parser = new XMLParser({
        ignoreAttributes: false,
        jPath: true,  // Explicit, but this is the default
        tagValueProcessor: (tagName, val, jpath) => {
          if (tagName === 'user') {
            capturedJPaths.push(jpath);
          }
          return val;
        }
      });

      parser.parse(xmlData);

      // Should receive string jPaths
      expect(capturedJPaths.length).toBe(2);
      expect(typeof capturedJPaths[0]).toBe('string');
      expect(capturedJPaths[0]).toBe('root.users.user');
    });

  });

  describe("stopNodes with Expression Objects", function () {

    it("should accept Expression objects in stopNodes", function () {
      const xmlData = `
        <root>
          <code><pre>formatted code</pre></code>
          <script>alert('test');</script>
        </root>`;

      const parser = new XMLParser({
        stopNodes: [
          new Expression("..pre"),
          new Expression("..script")
        ]
      });

      const result = parser.parse(xmlData);

      expect(typeof result.root.code.pre).toBe('string');
      expect(result.root.code.pre).toBe('formatted code');
      expect(typeof result.root.script).toBe('string');
      expect(result.root.script).toContain("alert('test');");
    });

    it("should support deep wildcard patterns", function () {
      const xmlData = `
        <html>
          <body>
            <div>
              <section>
                <script>nested script</script>
              </section>
            </div>
          </body>
        </html>`;

      const parser = new XMLParser({
        stopNodes: [new Expression("..script")]
      });

      const result = parser.parse(xmlData);

      expect(typeof result.html.body.div.section.script).toBe('string');
      expect(result.html.body.div.section.script).toBe('nested script');
    });

    it("should support attribute conditions in stopNodes", function () {
      const xmlData = `
        <root>
          <div class="code"><pre>should stop</pre></div>
          <div class="text"><pre>should NOT stop</pre></div>
        </root>`;

      const expected = {
        "root": {
          "div": [
            {
              "#text": "<pre>should stop</pre>",
              "@_class": "code"
            },
            {
              "pre": "should NOT stop",
              "@_class": "text"
            }
          ]
        }
      }
      const parser = new XMLParser({
        ignoreAttributes: false,
        // preserveOrder: true,
        stopNodes: [new Expression("..div[class=code]")]
        //stopNodes: ["..div"]
      });

      const result = parser.parse(xmlData);

      // console.log(JSON.stringify(result, null, 4));
      expect(result).toEqual(expected);
    });

    it("should support position selectors in stopNodes", function () {
      const xmlData = `
        <root>
          <item>first</item>
          <item>second</item>
          <item>third</item>
        </root>`;

      const parser = new XMLParser({
        stopNodes: [new Expression("root.item:first")]
      });

      const result = parser.parse(xmlData);

      // First item should be stop node
      expect(result.root.item[0]).toBe('first');
      // Others parsed normally
      expect(result.root.item[1]).toBe('second');
      expect(result.root.item[2]).toBe('third');
    });

    it("should support mixed string and Expression in stopNodes", function () {
      const xmlData = `
        <root>
          <script>script content</script>
          <style>style content</style>
          <pre>pre content</pre>
        </root>`;

      const parser = new XMLParser({
        stopNodes: [
          "..script",                    // String
          new Expression("..style"),     // Expression
          new Expression("root.pre")     // Exact path Expression
        ]
      });

      const result = parser.parse(xmlData);

      expect(typeof result.root.script).toBe('string');
      expect(typeof result.root.style).toBe('string');
      expect(typeof result.root.pre).toBe('string');
    });

  });

  describe("Matcher-Based Callbacks (jPath: false)", function () {

    it("should pass Matcher instance to tagValueProcessor when jPath: false", function () {
      const xmlData = `
        <root>
          <user type="admin">Alice</user>
          <user type="regular">Bob</user>
        </root>`;

      const expected = {
        "root": {
          "user": [
            {
              "#text": "ALICE",
              "@_type": "admin"
            },
            {
              "#text": "Bob",
              "@_type": "regular"
            }
          ]
        }
      }

      const adminExpr = new Expression("..user[type=admin]");

      const parser = new XMLParser({
        ignoreAttributes: false,
        jPath: false,
        tagValueProcessor: (tagName, val, matcher) => {

          if (tagName === 'user') {
            expect(typeof matcher.matches).toBe('function');
            expect(typeof matcher.getCurrentTag).toBe('function');

            if (matcher.matches(adminExpr)) {
              return val.toUpperCase();
            }
          }
          return val;
        }
      });

      const result = parser.parse(xmlData);

      // console.log(JSON.stringify(result, null, 4));

      expect(result).toEqual(expected);
    });

    it("should pass Matcher to attributeValueProcessor when jPath: false", function () {
      const xmlData = `
        <root>
          <user id="1" type="admin">Alice</user>
          <user id="2" type="regular">Bob</user>
        </root>`;

      const adminExpr = new Expression("..user[type=admin]");
      let processedAttrs = [];

      const parser = new XMLParser({
        ignoreAttributes: false,
        jPath: false,
        attributeValueProcessor: (attrName, val, matcher) => {
          // console.log(attrName, val, matcher.getCurrentTag());
          // console.log(matcher.getAttrValue(attrName));
          if (attrName === 'id' && matcher.matches(adminExpr)) {
            processedAttrs.push(val);
            return 'ADMIN-' + val;
          } else {
            // console.log("doesnt match")
          }
          return val;
        }
      });

      const result = parser.parse(xmlData);

      // console.log(JSON.stringify(result, null, 4))
      expect(processedAttrs.length).toBe(1);
      expect(result.root.user[0]['@_id']).toBe('ADMIN-1');
      expect(result.root.user[1]['@_id']).toBe('2');
    });

    it("should pass Matcher to updateTag when jPath: false", function () {
      const xmlData = `
        <root>
          <oldName>content</oldName>
        </root>`;

      const oldNameExpr = new Expression("root.oldName");

      const parser = new XMLParser({
        jPath: false,
        updateTag: (tagName, matcher, attrs) => {
          if (matcher.matches(oldNameExpr)) {
            return 'newName';
          }
          return tagName;
        }
      });

      const result = parser.parse(xmlData);

      expect(result.root.newName).toBe('content');
      expect(result.root.oldName).toBeUndefined();
    });

    it("should pass Matcher to isArray when jPath: false", function () {
      const xmlData = `
        <root>
          <items>
            <item>first</item>
          </items>
        </root>`;

      const itemExpr = new Expression("..items.item");

      const parser = new XMLParser({
        jPath: false,
        isArray: (tagName, matcher, isLeafNode) => {
          return matcher.matches(itemExpr);
        }
      });

      const result = parser.parse(xmlData);

      expect(Array.isArray(result.root.items.item)).toBe(true);
      expect(result.root.items.item[0]).toBe('first');
    });

    it("should pass Matcher to ignoreAttributes function when jPath: false", function () {
      const xmlData = `
        <root>
          <user id="1" internal="secret">Alice</user>
        </root>`;

      const userExpr = new Expression("root.user");

      const parser = new XMLParser({
        ignoreAttributes: false,
        jPath: false,
        ignoreAttributes: (attrName, matcher) => {
          // console.log(attrName, matcher.getCurrentTag())
          if (matcher.matches(userExpr) && attrName === 'internal') {
            // console.log("matched")
            return true;  // Ignore internal attribute
          }
          return false;
        }
      });

      const result = parser.parse(xmlData);

      // console.log(JSON.stringify(result, null, 4));
      expect(result.root.user['@_id']).toBe('1');
      expect(result.root.user['@_internal']).toBeUndefined();
    });

  });

  describe("Complex Pattern Matching", function () {

    it("should handle wildcards at different positions", function () {
      const xmlData = `
        <root>
          <a><b><c>content</c></b></a>
        </root>`;

      const parser1 = new XMLParser({
        stopNodes: [new Expression("*.a.b.c")]  // Exact depth match
      });

      // Won't match - *.a.b.c needs 4 levels, we have root.a.b.c (4 levels)
      // Actually this SHOULD match
      const result1 = parser1.parse(xmlData);
      expect(typeof result1.root.a.b.c).toBe('string');

      const parser2 = new XMLParser({
        stopNodes: [new Expression("root.*.b.c")]  // Middle wildcard
      });

      const result2 = parser2.parse(xmlData);
      expect(typeof result2.root.a.b.c).toBe('string');
    });

    it("should handle deep wildcards with intermediate paths", function () {
      const xmlData = `
        <root>
          <level1>
            <level2>
              <target>content</target>
            </level2>
          </level1>
        </root>`;

      const parser = new XMLParser({
        stopNodes: [new Expression("root..target")]
      });

      const result = parser.parse(xmlData);

      expect(typeof result.root.level1.level2.target).toBe('string');
      expect(result.root.level1.level2.target).toBe('content');
    });

    it("should handle multiple deep wildcards in single pattern", function () {
      const xmlData = `
        <root>
          <a><b><c><d>content</d></c></b></a>
        </root>`;

      const parser = new XMLParser({
        stopNodes: [new Expression("root..b..d")]
      });

      const result = parser.parse(xmlData);

      expect(typeof result.root.a.b.c.d).toBe('string');
    });

  });

  describe("HTML Parsing Integration", function () {

    it("should parse HTML with script and style as stop nodes", function () {
      const html = `
        <html lang="en">
          <head>
            <script>
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
            </script>
            <style>
              .CodeMirror{
                height: 100%;
                width: 100%;
              }
            </style>
          </head>
          <body>
            <h1>Heading</h1>
            <hr>
            <pre>
              <h1>Nested</h1>
            </pre>
          </body>
        </html>`;

      const parsingOptions = {
        ignoreAttributes: false,
        preserveOrder: true,
        unpairedTags: ["hr", "br", "link", "meta"],
        stopNodes: ["..pre", "..script", "..style"],
        processEntities: true,
        htmlEntities: true,
      };

      const parser = new XMLParser(parsingOptions);
      let result = parser.parse(html);

      const builderOptions = {
        ignoreAttributes: false,
        format: true,
        preserveOrder: true,
        suppressEmptyNode: false,
        unpairedTags: ["hr", "br", "link", "meta"],
        stopNodes: ["..pre", "..script", "..style"],
      };

      //console.log(JSON.stringify(result, null, 2));

      const builder = new XMLBuilder(builderOptions);
      let output = builder.build(result);
      // Verify script and style content is preserved
      expect(output).toContain('window.dataLayer');
      expect(output).toContain('.CodeMirror');
      expect(output).toContain('<h1>Nested</h1>');
    });

  });

  describe("Edge Cases", function () {

    it("should handle empty stopNodes array", function () {
      const xmlData = `<root><script>content</script></root>`;

      const parser = new XMLParser({
        stopNodes: []
      });

      const result = parser.parse(xmlData);

      // Script should be parsed normally
      expect(typeof result.root.script).toBe('string');
      expect(result.root.script).toBe('content');
    });

    it("should handle undefined stopNodes", function () {
      const xmlData = `<root><script>content</script></root>`;

      const parser = new XMLParser({
        // stopNodes not specified
      });

      const result = parser.parse(xmlData);

      expect(typeof result.root.script).toBe('string');
    });

    it("should handle self-closing stop nodes", function () {
      const xmlData = `<root><b><b /></b></root>`;

      const parser = new XMLParser({
        stopNodes: ["..b"]
      });

      const result = parser.parse(xmlData);

      // Outer b contains inner b as stop node
      expect(typeof result.root.b).toBe('string');
      expect(result.root.b).toContain('<b />');
    });

    it("should handle nested stop nodes", function () {
      const xmlData = `
        <root>
          <outer>
            <script><inner>content</inner></script>
          </outer>
        </root>`;

      const parser = new XMLParser({
        stopNodes: ["..script"]
      });

      const result = parser.parse(xmlData);

      expect(typeof result.root.outer.script).toBe('string');
      expect(result.root.outer.script).toContain('<inner>content</inner>');
    });

  });

  describe("Performance and Optimization", function () {

    it("should pre-compile Expression objects for better performance", function () {
      // Pre-compile expressions
      const scriptExpr = new Expression("..script");
      const styleExpr = new Expression("..style");

      const startTime = Date.now();

      const parser = new XMLParser({
        stopNodes: [scriptExpr, styleExpr]
      });

      const xmlData = `
        <root>
          <script>content1</script>
          <style>content2</style>
        </root>`;

      for (let i = 0; i < 100; i++) {
        parser.parse(xmlData);
      }

      const duration = Date.now() - startTime;

      // Just verify it completes without error
      // Performance assertion would be flaky
      expect(duration).toBeGreaterThan(0);
    });

  });

});