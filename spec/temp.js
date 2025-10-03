"use strict";

import { format } from "path";
import {XMLParser, XMLValidator, XMLBuilder} from "../src/fxp.js";

describe("unpaired and empty tags", function() {
    xit("bug test", function() {
        
        const xmlData = `<?xml version="1.0"?>
<!DOCTYPE softwarelists [
<!ELEMENT softwarelists (softwarelist*)>
	<!ELEMENT softwarelist (notes?, software+)>
		<!ATTLIST softwarelist name CDATA #REQUIRED>
		<!ATTLIST softwarelist description CDATA #IMPLIED>
		<!ELEMENT notes (#PCDATA)>
		<!ELEMENT software (description, year, publisher, notes?, info*, sharedfeat*, part*)>
			<!ATTLIST software name CDATA #REQUIRED>
			<!ATTLIST software cloneof CDATA #IMPLIED>
			<!ATTLIST software supported (yes|partial|no) "yes">
			<!ELEMENT description (#PCDATA)>
			<!ELEMENT year (#PCDATA)>
			<!ELEMENT publisher (#PCDATA)>
			<!ELEMENT notes (#PCDATA)>
			<!ELEMENT info EMPTY>
				<!ATTLIST info name CDATA #REQUIRED>
				<!ATTLIST info value CDATA #IMPLIED>
			<!ELEMENT sharedfeat EMPTY>
				<!ATTLIST sharedfeat name CDATA #REQUIRED>
				<!ATTLIST sharedfeat value CDATA #IMPLIED>
			<!ELEMENT part (feature*, dataarea*, diskarea*, dipswitch*)>
				<!ATTLIST part name CDATA #REQUIRED>
				<!ATTLIST part interface CDATA #REQUIRED>
				<!ELEMENT feature EMPTY>
					<!ATTLIST feature name CDATA #REQUIRED>
					<!ATTLIST feature value CDATA #IMPLIED>
				<!ELEMENT dataarea (rom*)>
					<!ATTLIST dataarea name CDATA #REQUIRED>
					<!ATTLIST dataarea size CDATA #REQUIRED>
					<!ATTLIST dataarea databits (8|16|32|64) "8">
					<!ATTLIST dataarea endian (big|little) "little">
					<!ELEMENT rom EMPTY>
						<!ATTLIST rom name CDATA #IMPLIED>
						<!ATTLIST rom size CDATA #IMPLIED>
						<!ATTLIST rom length CDATA #IMPLIED>
						<!ATTLIST rom crc CDATA #IMPLIED>
						<!ATTLIST rom sha1 CDATA #IMPLIED>
						<!ATTLIST rom offset CDATA #IMPLIED>
						<!ATTLIST rom value CDATA #IMPLIED>
						<!ATTLIST rom status (baddump|nodump|good) "good">
						<!ATTLIST rom loadflag (load16_byte|load16_word|load16_word_swap|load32_byte|load32_word|load32_word_swap|load32_dword|load64_word|load64_word_swap|reload|fill|continue|reload_plain) #IMPLIED>
				<!ELEMENT diskarea (disk*)>
					<!ATTLIST diskarea name CDATA #REQUIRED>
					<!ELEMENT disk EMPTY>
						<!ATTLIST disk name CDATA #REQUIRED>
						<!ATTLIST disk sha1 CDATA #IMPLIED>
						<!ATTLIST disk status (baddump|nodump|good) "good">
						<!ATTLIST disk writeable (yes|no) "no">
				<!ELEMENT dipswitch (dipvalue*)>
					<!ATTLIST dipswitch name CDATA #REQUIRED>
					<!ATTLIST dipswitch tag CDATA #REQUIRED>
					<!ATTLIST dipswitch mask CDATA #REQUIRED>
					<!ELEMENT dipvalue EMPTY>
						<!ATTLIST dipvalue name CDATA #REQUIRED>
						<!ATTLIST dipvalue value CDATA #REQUIRED>
						<!ATTLIST dipvalue default (yes|no) "no">
]>

<softwarelists>
	<softwarelist name="snes" description="Nintendo SNES cartridges">
		<software name="aokidenp" cloneof="aokiden">
			<description>Aoki Densetsu Shoot! (Japan, prototype)</description>
			<year>1994</year>
			<publisher>KSS</publisher>
			<info name="alt_title" value="蒼き伝説シュート!"/>
			<part name="cart" interface="snes_cart">
				<feature name="battery" value="BATT CR2032" />
				<feature name="cart_model" value="no shell" />
				<feature name="lockout" value="" />
				<feature name="pcb" value="SHVC-4PV5B-01" />
				<feature name="slot" value="lorom" />
				<feature name="u1" value="U1 EPROM" />
				<feature name="u2" value="U2 EPROM" />
				<feature name="u3" value="U3 EPROM" />
				<feature name="u4" value="U4 EPROM" />
				<feature name="u5" value="U5 SRAM" />
				<feature name="u6" value="U6 PLD" />
				<feature name="u7" value="U7 74LS157" />
				<feature name="u8" value="U8 CIC" />
				<dataarea name="rom" size="1572864">
					<rom name="shoot 1 kss.u1" size="524288" crc="71306e06" sha1="253ec028d68a85209dc3e5846a2a2f5b582fed7b"/>
					<rom name="shoot 2 kss.u2" size="524288" crc="d07e1be3" sha1="7a58acb027ca15c1054e58f43156c2d99f62d16c"/>
					<rom name="shoot 3 kss.u3" size="524288" crc="380ed94f" sha1="8607ce31748ae73b9aa7aacda80c843622c61a79"/>
				</dataarea>
				<dataarea name="nvram" size="131072">
				</dataarea>
			</part>
		</software>
	</softwarelist>
</softwarelists>

`;
        const options = {
            ignoreAttributes: false,
            attributeNamePrefix: '',
        };
        const parser = new XMLParser(options);
        // console.log(JSON.stringify(parser.parse(xml)));
        
        let result = parser.parse(xmlData);

        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
    fit("bug test", function() {
        
        const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE dmodule [
   <!ENTITY EXTERNAL-IMAGE SYSTEM "EXTERNAL-IMAGE.cgm" NDATA cgm>
   <!NOTATION cgm SYSTEM "cgm">
   <!NOTATION tif SYSTEM "tif">
]>
<element xmlns:xlink="http://www.w3.org/1999/xlink"
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
Hello!
</element>`;
        const options = {
            ignoreAttributes: false,
						attributeNamePrefix: "@",
						processEntities: false,
						stopNodes: ["dmCode"],
        };
        
        // const result = XMLValidator.validate(xmlData)
				const parser = new XMLParser(options);
        const result = parser.parse(xmlData);
        
        // console.log(result);
        console.log(JSON.stringify(result,null,4));
        // expect(result).toEqual(expected);

    });
 
    
});