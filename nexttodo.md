P0
* OptionsBuilder: replace by Object.assign
* update README for main features

P1
* special characters such as '&amp;'
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/297
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/343
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/342
* skip parsing of particular tag
* doctype support
* Es6 modules
* Parse JSON string to XML. Currently it transforms JSON object to XML. Partially done. Need to work on performance.
* boolean tag to support HTML parsing
    * https://github.com/NaturalIntelligence/fast-xml-parser/issues/206

P2
* Multiple roots
* skip parsing of after some tag
* validate XML stream data
* Accept streams, arrayBuffer
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/347
* XML to JSON ML : https://en.wikipedia.org/wiki/JsonML