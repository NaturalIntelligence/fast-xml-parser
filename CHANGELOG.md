3.3.8 / 2018-04-17
  * fix #73 : IE doesn't support Object.assign
3.3.7 / 2018-04-14
  * fix: use let insted of const in for loop of validator
  * Merge pull request
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/71 from bb/master
    first draft of typings for typescript
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/69
  * Merge pull request
    https://github.com/NaturalIntelligence/fast-xml-parser/issues/70 from bb/patch-1
    fix some typos in readme
3.3.6 / 2018-03-21
  * change arrow functions to full notation for IE compatibility
3.3.5 / 2018-03-15
  * fix https://github.com/NaturalIntelligence/fast-xml-parser/issues/67 : attrNodeName invalid behavior
  * fix: remove decodeHTML char condition
3.3.4 / 2018-03-14
  * remove dependency on "he" package
  * refactor code to separate methods in separate files.
  * draft code for transforming XML to json string. It is not officially documented due to performance issue.
3.3.0 / 2018-03-05
  * use common default options for XML parsing for consistency. And add `parseToNimn` method.
  * update nexttodo
  * update README about XML to Nimn transformation and remove special notes about 3.x release
  * update CONTRIBUTING.ms mentioning nexttodo
  * add negative case for XML PIs
  * validate xml processing instruction tags    https://github.com/NaturalIntelligence/fast-xml-parser/issues/62
  * nimndata: handle array with object
  * nimndata: node with nested node and text node
  * nimndata: handle attributes and text node
  * nimndata: add options, handle array
  * add xml to nimn data converter
  * x2j: direct access property with tagname
  * update changelog
  * fix validator when single quote presents in value enclosed with double quotes or vice versa
  * Revert "remove unneded nimnjs dependency, move opencollective to devDependencies and replace it
    with more light opencollective-postinstall"
    This reverts commit d47aa7181075d82db4fee97fd8ea32b056fe3f46.
  * Merge pull request: https://github.com/NaturalIntelligence/fast-xml-parser/issues/63 from HaroldPutman/suppress-undefined
    Keep undefined nodes out of the XML output :     This is useful when you are deleting nodes from the JSON and rewriting XML.
3.2.4 / 2018-03-01
  * fix #59 fix in validator when open quote presents in attribute value
  * Create nexttodo.md
  * exclude static from bitHound tests
  * add package lock
3.2.3 / 2018-02-28
  * Merge pull request from  Delagen/master: fix namespaces can contain the same characters as xml names
3.2.2 / 2018-02-22
  * fix: attribute xmlns should not be removed if ignoreNameSpace is false
  * create CONTRIBUTING.md
3.2.1 / 2018-02-17
  * fix: empty attribute should be parsed
3.2.0 / 2018-02-16
  * Merge pull request : Dev to Master
  * Update README and version
  * j2x:add performance test
  * j2x: Remove extra empty line before closing tag
  * j2x: suppress empty nodes to self closing node if configured
  * j2x: provide option to give indentation depth
  * j2x: make optional formatting
  * j2x: encodeHTMLchat
  * j2x: handle cdata tag
  * j2x: handle grouped attributes
  * convert json to xml
    - nested object
    - array
    - attributes
    - text value
  * small refactoring
  * Merge pull request: Update cli.js to let user validate XML file or data
  * Add option for rendering CDATA as separate property
3.0.1 / 2018-02-09
  * fix CRLF: replace it with single space in attributes value only.
3.0.0 / 2018-02-08
  * change online tool with new changes
  * update info about new options
  * separate tag value processing to separate function
  * make HTML decoding optional
  * give an option to allow boolean attributes
  * change cli options as per v3
  * Correct comparison table format on README
  * update v3 information
  * some performance improvement changes
  * Make regex object local to the method and move some common methods to util
  * Change parser to
    - handle multiple instances of CDATA
    - make triming of value optionals
    - HTML decode attribute and text value
    - refactor code to separate files
  * Ignore newline chars without RE (in validator)
  * validate for XML prolog
  * Validate DOCTYPE without RE
  * Update validator to return error response
  * Update README to add detail about V3
  * Separate xmlNode model class
  * include vscode debug config
  * fix for repeated object
  * fix attribute regex for boolean attributes
  * Fix validator for invalid attributes
2.9.4 / 2018-02-02
  * Merge pull request: Decode HTML characters
  * refactor source folder name
  * ignore bundle / browser js to be published to npm
2.9.3 / 2018-01-26
  * Merge pull request: Correctly remove CRLF line breaks
  * Enable to parse attribute in online editor
  * Fix testing demo app test
  * Describe parsing options
  * Add options for online demo
2.9.2 / 2018-01-18
  * Remove check if tag starting with "XML"
  * Fix: when there are spaces before / after CDATA

2.9.1 / 2018-01-16
  * Fix: newline should be replaced with single space
  * Fix: for single and multiline comments
  * validate xml with CDATA
  * Fix: the issue when there is no space between 2 attributes
  * Fix: https://github.com/NaturalIntelligence/fast-xml-parser/issues/33: when there is newline char in attr val, it doesn't parse
  * Merge pull request: fix ignoreNamespace
    * fix: don't wrap attributes if only namespace attrs
    * fix: use portfinder for run tests, update deps
    * fix: don't treat namespaces as attributes when ignoreNamespace enabled

2.9.0 / 2018-01-10
  * Rewrite the validator to handle large files.
    Ignore DOCTYPE validation. 
  * Fix: When attribute value has equal sign

2.8.3 / 2017-12-15
  * Fix: when a tag has value along with subtags

2.8.2 / 2017-12-04
  * Fix value parsing for IE

2.8.1 / 2017-12-01
  * fix: validator should return false instead of err when invalid XML

2.8.0 / 2017-11-29
  * Add CLI option to ignore value conversion
  * Fix variable name when filename is given on CLI
  * Update CLI help text
  * Merge pull request: xml2js: Accept standard input
  * Test Node 8
  * Update dependencies
  * Bundle readToEnd
  * Add ability to read from standard input

2.7.4 / 2017-09-22
  * Merge pull request: Allow wrap attributes with subobject to compatible with other parsers output

2.7.3 / 2017-08-02
  * fix: handle CDATA with regx

2.7.2 / 2017-07-30
  * Change travis config for yarn caching
  * fix validator: when tag property is same as array property
  * Merge pull request: Failing test case in validator for valid SVG

2.7.1 / 2017-07-26
  * Fix: Handle val 0

2.7.0 / 2017-07-25
  * Fix test for arrayMode
  * Merge pull request: Add arrayMode option to parse any nodes as arrays

2.6.0 / 2017-07-14
  * code improvement
  * Add unit tests for value conversion for attr
  * Merge pull request: option of an attribute value conversion to a number (textAttrConversion) the same way as the textNodeConversion option does. Default value is false.

2.5.1 / 2017-07-01
  * Fix XML element name pattern
  * Fix XML element name pattern while parsing
  * Fix validation for xml tag element

2.5.0 / 2017-06-25
  * Improve Validator performance
  * update attr matching regex
  * Add perf tests
  * Improve atrr regex to handle all cases

2.4.4 / 2017-06-08
  * Bug fix: when an attribute has single or double quote in value

2.4.3 / 2017-06-05
  * Bug fix: when multiple CDATA tags are given
  * Merge pull request: add option "textNodeConversion"
  * add option "textNodeConversion"

2.4.1 / 2017-04-14
  * fix tests
  * Bug fix: preserve initial space of node value
  * Handle CDATA

2.3.1 / 2017-03-15
  * Bug fix: when single self closing tag
  * Merge pull request: fix .codeclimate.yml
  * Update .codeclimate.yml - Fixed config so it does not error anymore.
  * Update .codeclimate.yml

2.3.0 / 2017-02-26
  * Code improvement
  * add bithound config
  * Update usage
  * Update travis to generate bundle js before running tests
  * 1.Browserify, 2. add more tests for validator
  * Add validator
  * Fix CLI default parameter bug

2.2.1 / 2017-02-05
  * Bug fix: CLI default option
