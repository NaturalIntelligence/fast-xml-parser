'use strict';

const {format} = require('../src/fxp');

describe('XML formatter', () => {
  it('should format simple document', () => {
    const result = format('<data><item>1</item></data>');
    expect(result).toBe(`
<data>
  <item>
    1
  </item>
</data>`);
  });

  it('should preserve XML PI tag', () => {
    const result = format('<?xml version="1.0"?><data>hello</data>');
    expect(result).toBe(`
<?xml   version="1.0"?>
<data>
  hello
</data>`);
  });

  it('should preserve self-closed tags', () => {
    const result = format('<data><self-closed/></data>');
    expect(result).toBe(`
<data>
  <self-closed/>
</data>`);
  });

  it('should preserve comments', () => {
    const result = format('<data><!-- comment --><value>1</value></data>');
    expect(result).toBe(`
<data>
  <!-- comment -->
  <value>
    1
  </value>
</data>`);
  });

  it('should preserve attributes', () => {
    const result = format('<data kind="text">hello</data>');
    expect(result).toBe(`
<data kind="text">
  hello
</data>`);
  });

  xit('should preserve closing tag after empty content', () => {
    const result = format('<empty></empty>');
    expect(result).toBe(`
<empty>
</empty>`);
  });
});
