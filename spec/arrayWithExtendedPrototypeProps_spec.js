'use strict';

const parser = require('../src/parser');

describe('XMLParser array with extended prototype props', function() {
  it('should parse all the tags as an array no matter how many occurences excluding premitive values when arrayMode is set to true', function() {
    const xmlData = `<a>
                       <b>0</b>
                       <b>1</b>
                     </a>`;

    const expected = {
      a: {b: [0, 1]},
    };

    Array.prototype.someExtentionOfArrayPrototype = 'someExtentionOfArrayPrototype';

    const result = parser.parse(xmlData, {
      arrayMode: false,
      ignoreAttributes: false,
    });
    //console.log(JSON.stringify(result, null, 4));
    expect(result).toEqual(expected);
  });
});
