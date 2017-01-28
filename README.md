# fast-xml-parser
Parse XML to JS/JSON very fast without C/C++ based libraries and no callback

I decided to created this library when I couldn't find any library which can convert XML data to json without any callback and which is not based on any C/C++ library.

Liraries that I compared
* xml-mapping : fast, result is not satisfactory
* xml2js : fast, result is not satisfactory
* xml2js-expat : couldn't test performance as it gives error on high load. Instalation failed on traivs and on my local machine using 'yarn'.
* xml2json : based on node-expat which is based on C/C++. Instalation failed on travis.
* fast-xml-parser : very very fast.

Why not C/C++ based libraries?
Instalation of such libraries fails on some OS. You may require to install missing dependency manually.

Don't forget to check the performance report on [comparejs](https://naturalintelligence.github.io/comparejs/?q=xml2json).

### Limitations
* It ignores tag attributes.

