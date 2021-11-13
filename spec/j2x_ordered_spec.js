const {XMLParser, XMLBuilder} = require("../src/fxp");
const he = require("he");

describe("XMLBuilder", function() {

    it("should build formatted XML from ordered JS Obj", function() {
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

    expect(result.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });

    it("should build XML for CDATA, text property, repeated tags", function() {
        const XMLdata = `<store>
        <location>
            <![CDATA[locates in]]>
            <region>US</region>
            <![CDATA[and]]>
            <region>JAPAN</region>
            --finish--
        </location>
        <type>
            <size>
                <![CDATA[Small]]>alpha
            </size>
            <function>24x7</function>
        </type>
    </store>`;
    
    const options = {
      preserveOrder: true,
      cdataTagName: "#CDATA"
    }
    const parser = new XMLParser(options);
    let result = parser.parse(XMLdata);
    // console.log(JSON.stringify(result, null,4));

    const builder = new XMLBuilder(parser.options);
    result = builder.build(result);
    // console.log(result);

    expect(result.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });
    
    it("should build XML by merging CDATA to text property when CDATA tag name is not set", function() {
        let XMLdata = `<store>
        <location>
            <![CDATA[locates in]]>
            <region>US</region>
            <![CDATA[and]]>
            <region>JAPAN</region>
            --finish--
        </location>
        <type>
            <size>
                <![CDATA[Small]]>alpha
            </size>
            <function>24x7</function>
        </type>
    </store>`;
    
        const options = {
        preserveOrder: true,
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));

        const builder = new XMLBuilder(parser.options);
        result = builder.build(result);
        // console.log(result);

        XMLdata = XMLdata.replace(/<!\[CDATA\[/g, "");
        XMLdata = XMLdata.replace(/\]\]>/g, "");
        expect(result.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });

    it("should build XML having only text", function() {
        let XMLdata = `<store>
            <![CDATA[albha]]>beta
    </store>`;
    
        const options = {
            preserveOrder: true,
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));

        const builder = new XMLBuilder(parser.options);
        result = builder.build(result);
        // console.log(result);

        XMLdata = XMLdata.replace(/<!\[CDATA\[/g, "");
        XMLdata = XMLdata.replace(/\]\]>/g, "");
        expect(result.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });

    it("should build formatted XML", function() {
        let XMLdata = `<store>
        <location>
            <![CDATA[locates in]]>
            <region>US</region>
            <![CDATA[and]]>
            <region>JAPAN</region>
            --finish--
        </location>
        <type>
            <size>
                <![CDATA[Small]]>alpha
            </size>
            <function>24x7</function>
        </type>
    </store>`;
    
        const options = {
            preserveOrder: true,
            format: true,
            // cdataTagName: "#CDATA"
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        // console.log(result);

        XMLdata = XMLdata.replace(/<!\[CDATA\[/g, "");
        XMLdata = XMLdata.replace(/\]\]>/g, "");
        expect(result.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });
    
    it("should build formatted XML with CDATA", function() {
        let XMLdata = `<store>
        <location>
            <![CDATA[locates in]]>
            <region>US</region>
            <![CDATA[and]]>
            <region>JAPAN</region>
            --finish--
        </location>
        <type>
            <size>
                <![CDATA[Small]]>alpha
            </size>
            <function>24x7</function>
        </type>
    </store>`;
    
        const options = {
            preserveOrder: true,
            format: true,
            cdataTagName: "#CDATA"
        }
        const parser = new XMLParser(options);
        let result = parser.parse(XMLdata);
        // console.log(JSON.stringify(result, null,4));

        const builder = new XMLBuilder(options);
        result = builder.build(result);
        // console.log(result);

        expect(result.replace(/\s+/g, "")).toEqual(XMLdata.replace(/\s+/g, ""));
    });
});
