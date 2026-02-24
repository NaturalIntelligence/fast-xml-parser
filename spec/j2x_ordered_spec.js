import {XMLParser, XMLBuilder} from "../src/fxp.js";

describe("XMLBuilder", function () {

    it("should build formatted XML from ordered JS Obj", function () {
        const XMLdata = `<root>
  <car>
      <color>purple</color>
      <type>minivan</type>
      <registration>2020-02-03</registration>
      <capacity>7</capacity>
  </car>
  <car>
      <color>orange</color>
      <type>SUV</type>
      <registration>2021-05-17</registration>
      <capacity>4</capacity>
  </car>
  <car>
      <color>green</color>
      <type>coupe</type>
      <registration>2019-11-13</registration>
      <capacity>2</capacity>
  </car>
</root>`;
        const expected = `<root><car><color>purple</color><type>minivan</type><registration>2020-02-03</registration><capacity>7</capacity></car><car><color>orange</color><type>SUV</type><registration>2021-05-17</registration><capacity>4</capacity></car><car><color>green</color><type>coupe</type><registration>2019-11-13</registration><capacity>2</capacity></car></root>`;

        const options = {
            preserveOrder: true,
            indentBy: " "
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
    // console.log(JSON.stringify(result, null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(result);
    // console.log(result);

        expect(result).toEqual(expected);
    });

    it("should build XML for CDATA, text property, repeated tags", function () {
        const XMLdata = `<store>
        <location>
            <![CDATA[locates in]]>
            <region>US</region>
            <![CDATA[and]]>
            <region>JAPAN</region>
            --finish--
        </location>
        <item price="108">
            <![CDATA[Banana]]>
        </item>
    </store>`;
        const expected = `<store><location><![CDATA[locates in]]><region>US</region><![CDATA[and]]><region>JAPAN</region>--finish--</location><item price="108"><![CDATA[Banana]]></item></store>`;

        const options = {
            preserveOrder: true,
            ignoreAttributes: false,
            cdataPropName: "__cdata",
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        expect(result).toEqual(expected);
    });

    it("should build the formatted XML with attributes", function () {
        const XMLdata = `<?xml version="1.0"?>
<?xml-stylesheet href="catalog.xsl"  type="text/xsl" ?>
<!DOCTYPE store SYSTEM "store" [<!ELEMENT store (item)*> <!ELEMENT item (#PCDATA)> <!ATTLIST item price CDATA #REQUIRED>]>
<store>
    <location id="100">
        <![CDATA[locates in]]>
        <region>US</region>
        <![CDATA[and]]>
        <region>JAPAN</region>
        --finish--
    </location>
    <item price="108">
        <![CDATA[Banana]]>
    </item>
</store>`;
        const expected = `<?xml version="1.0"?>
<?xml-stylesheet href="catalog.xsl" type="text/xsl"?>
<store>
  <location id="100">
    <![CDATA[locates in]]>
    <region>US</region>
    <![CDATA[and]]>
    <region>JAPAN</region>
    --finish--
  </location>
  <item price="108">
    <![CDATA[Banana]]>
  </item>
</store>`;

        const options = {
            preserveOrder: true,
            ignoreAttributes: false,
            cdataPropName: "__cdata",
            format: true
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        expect(result).toEqual(expected);
    });

    it("should build the XML using given tag-value processor for ordered XML", function () {
        const XMLdata = `
    <root>
        <element1>val&amp;1</element1>
        <element2>val&lt;2</element2>
    </root>`;

        const expected = `<root><element1>val&1</element1><element2>val<2</element2></root>`;

        const options = {
            preserveOrder: true,
            processEntities: false,
            tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
                return tagValue;
            },
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        expect(result).toEqual(expected);
    });

    it("should build the formatted output for the deep nested data", function () {
        const XMLdata = `<root>
  <a>
    <b>
      <c>
        <d>
          <e>
            <f>val</f>
          </e>
        </d>
      </c>
    </b>
  </a>
</root>`;
        const expected = `<root>
  <a>
    <b>
      <c>
        <d>
          <e>
            <f>val</f>
          </e>
        </d>
      </c>
    </b>
  </a>
</root>`;

        const options = {
            preserveOrder: true,
            format: true,
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        expect(result).toEqual(expected);
    });

    it("should build XML for the ordered array of ordered arrays", function () {
        const XMLdata = `<root>
    <a>
        <b>1</b>
        <b>2</b>
        <b>3</b>
    </a>
    <a>
        <b>4</b>
        <b>5</b>
        <b>6</b>
    </a>
</root>`;
        const expected = `<root><a><b>1</b><b>2</b><b>3</b></a><a><b>4</b><b>5</b><b>6</b></a></root>`;

        const options = {
            preserveOrder: true
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        expect(result).toEqual(expected);
    });

    it("should build correctly for oneListGroup option", function () {
        const XMLdata = `<?xml version="1.0"?>
<company>
    <person>
        <name>John</name>
        <phone>7878787</phone>
    </person>
    <person>
        <name>Jack</name>
        <phone>4545454</phone>
    </person>
    <person>
        <name>Jack</name>
        <phone>2323232</phone>
    </person>
</company>`;

        const options = {
            preserveOrder: true,
            isArray: (tagName, jpath, isLeafNode, isAttribute) => {
                if (tagName === "person") return true;
            }
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);

        const expected = `<?xml version="1.0"?><company><person><name>John</name><phone>7878787</phone></person><person><name>Jack</name><phone>4545454</phone></person><person><name>Jack</name><phone>2323232</phone></person></company>`;

        const builder = new XMLBuilder({ preserveOrder: true });
        result = builder.build(result);

        expect(result).toEqual(expected);
    });

    it("should build correctly for isLeafNode option", function () {
        const XMLdata = `<properties>
    <property name="color">
        <int>7</int>
    </property>
    <property name="background-color">
        <int>42</int>
    </property>
</properties>`;

        const expected = `<properties><property name="color"><int>7</int></property><property name="background-color"><int>42</int></property></properties>`;

        const options = {
            ignoreAttributes: false,
            isArray: (tagName, jpath, isLeafNode, isAttribute) => { 
                if (isLeafNode === true) return true;
            },
            preserveOrder: true
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result,null,4));

        const builder = new XMLBuilder({
            attributeNamePrefix: "@_",
            ignoreAttributes: false,
            format: true,
            preserveOrder: true
        });
        result = builder.build(result);
        // console.log(result);
        expect(result).toEqual(expected);
    });

    it("should not throw stack overflow when child value is a non-array (issue #781)", function () {
        const builder = new XMLBuilder({
            ignoreAttributes: false,
            attributeNamePrefix: '@_',
            preserveOrder: true,
            format: true,
            indentBy: '  ',
            processEntities: true,
        });
        const input = [
            {
                'foo': [
                    { 'bar': [{ '@_V': 'baz' }] },
                    { 'fum': [{ 'qux': '' }] },
                    { 'hello': [{ '#text': 'world' }] }
                ]
            }
        ];
        expect(function () {
            builder.build(input);
        }).not.toThrow();

        const result = builder.build(input);
        expect(result).toContain('<hello>world</hello>');
        expect(result).toContain('<foo>');
    });
});
