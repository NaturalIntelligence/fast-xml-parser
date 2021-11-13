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
});
