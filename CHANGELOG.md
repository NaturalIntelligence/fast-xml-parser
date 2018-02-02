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