
import { XMLParser, XMLBuilder, XMLValidator } from "../src/fxp.js";
import { DANGEROUS_PROPERTY_NAMES, criticalProperties } from "../src/util.js";


describe("XMLParser", function () {

  it("should throw error for deeply nested XML", function () {

    const depth = 102;
    const xmlData = '<a>'.repeat(depth) + 'x' + '</a>'.repeat(depth);

    const parser = new XMLParser();
    expect(() => parser.parse(xmlData)).toThrowError("Maximum nested tags exceeded");
  });
  it("should not throw error when max depth is not reached", function () {

    const depth = 100;
    const xmlData = '<a>'.repeat(depth) + 'x' + '</a>'.repeat(depth);

    const parser = new XMLParser({ maxNestedTags: 101 });
    parser.parse(xmlData);
  });

  it("should throw error for tag name with reserved name", function () {
    const xmlData = `
        <root>
          <__comment>1</__comment>
        </root>
        `;
    const parser = new XMLParser({
      commentPropName: "__comment"
    });
    expect(() => parser.parse(xmlData)).toThrowError("Invalid tag name: __comment");
  });


  it("should not throw error for tag name with reserved name when strictReservedNames is false", function () {
    const xmlData = `
        <root>
          <__comment>1</__comment>
        </root>
        `;
    const parser = new XMLParser({
      commentPropName: "__comment",
      strictReservedNames: false
    });
    const expected = {
      "root": {
        "__comment": 1
      }
    }
    let result = parser.parse(xmlData);
    //console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);
  });

  it("should throw error for option configured with dangerous name", function () {
    for (let i = 0; i < DANGEROUS_PROPERTY_NAMES.length; i++) {
      const propertyName = DANGEROUS_PROPERTY_NAMES[i];

      expect(() =>
        new XMLParser({ textNodeName: propertyName }).parse("<root>hello</root>")
      ).toThrowError(`[SECURITY] Invalid textNodeName: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
    }
    for (let i = 0; i < criticalProperties.length; i++) {
      const propertyName = criticalProperties[i];

      expect(() =>
        new XMLParser({ textNodeName: propertyName }).parse("<root>hello</root>")
      ).toThrowError(`[SECURITY] Invalid textNodeName: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
    }
  });


  it(`should sanitize dangerous tag name`, function () {
    const options = {
      onDangerousProperty: (name) => {
        return "__" + name;
      }
    }
    for (let i = 0; i < DANGEROUS_PROPERTY_NAMES.length; i++) {
      const propertyName = DANGEROUS_PROPERTY_NAMES[i];
      const result = new XMLParser(options)
        .parse(`<root><${propertyName}>hello</${propertyName}></root>`);

      // console.log(JSON.stringify(result, null, 4))
      expect(typeof result.root["__" + propertyName]).toBe("string");
      expect(result.root["__" + propertyName]).toBe("hello");
      result.root["__" + propertyName] = "hello2"; //check if assignment works
    }
  });

  it(`should throw error for dangerous tag name`, function () {
    const options = {
      onDangerousProperty: (name) => {
        throw new Error(`Invalid tag name: "${name}"`);
      }
    }
    for (let i = 0; i < DANGEROUS_PROPERTY_NAMES.length; i++) {
      const propertyName = DANGEROUS_PROPERTY_NAMES[i];
      expect(() =>
        new XMLParser(options)
          .parse(`<root><${propertyName}>hello</${propertyName}></root>`)
      ).toThrowError(`Invalid tag name: "${propertyName}"`);
    }
  });

  it(`should throw error for critical properties`, function () {
    const options = {
      onDangerousProperty: (name) => {
        return "__" + name;
      }
    }
    for (let i = 0; i < criticalProperties.length; i++) {
      const propertyName = criticalProperties[i];
      expect(() =>
        new XMLParser(options)
          .parse(`<root><${propertyName}>hello</${propertyName}></root>`)
      ).toThrowError(`[SECURITY] Invalid name: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
    }
  });

  it(`should throw error for critical attribute names`, function () {
    const options = {
      ignoreAttributes: false,
      attributeNamePrefix: "",
      onDangerousProperty: (name) => {
        return "__" + name;
      }
    }
    for (let i = 0; i < criticalProperties.length; i++) {
      const propertyName = criticalProperties[i];
      expect(() =>
        new XMLParser(options)
          .parse(`<root ${propertyName}="${propertyName}"></root>`)
      ).toThrowError(`[SECURITY] Invalid name: "${propertyName}" is a reserved JavaScript keyword that could cause prototype pollution`);
    }
  });

});