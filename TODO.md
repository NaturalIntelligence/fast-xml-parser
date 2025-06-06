- Combine validator in parser
  - support: ignore attributes, stop nodes etc.
- [ ] skip
```
{
  skip: {
    tags: string[]|regx|jpath[]|fn
    tagsWithAttributes: string[]|regx|fn,
    tagsWithoutAttributes: string[]|regx|fn,
    attributes: string[]|regx|fn,
    attributesWithTag: string[]|regx|jpath[]|fn,
    attributesWithoutTag: string[]|regx|jpath[]|fn
    first: n, //tags
    last: n. //tags
  }
}
```
- [ ] Upllift text data #414
```
{
  unwrapText: {
    withAttribute: string[]|regx|fn,
    withJPath: string[]|regex|fn,
    withTag: string[]|regex|fn
  }
}
```

P0

P1
* Support external entities in XML Builder
* Write UT for nested stop node
* OptionsBuilder: replace by Object.assign

P2
* Multiple roots
* support stop nodes expression like head.*.meta
* skip parsing of after some tag
* validate XML stream data
* Parse JSON string to XML. Currently it transforms JSON object to XML. Partially done. Need to work on performance.
* Accept streams, arrayBuffer
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/347
* XML to JSON ML : https://en.wikipedia.org/wiki/JsonML






----

Entities
* https://www.w3schools.com/xml/xml_dtd.asp
* https://web-in-security.blogspot.com/2016/03/xxe-cheat-sheet.html
* https://stackoverflow.com/questions/28942711/in-xml-dtds-is-it-possible-to-provide-multiple-definitions-for-same-element-depe
* https://www.w3.org/TR/REC-xml/#sec-condition-sect