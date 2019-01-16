parser = require('../src/parser');
assert = require('assert');

const xml = `
<root>
    <item id="a">
        <sub>1</sub>
        <sub>2</sub>
    </item>
    <item id="b">
        <sub>3</sub>
    </item>
</root>`

const options = {
    ignoreAttributes : false,
    ignoreNameSpace : false,
    allowBooleanAttributes : true,
    parseNodeValue : true,
    parseAttributeValue : true,
    arrayMode: true
};
const jsonFromXml = parser.parse(xml,options)
const expectedObj = {root:
    [ { item:
         [ { '@_id': 'a', sub: [ 1, 2 ] }, 
         { '@_id': 'b', sub: [ 3 ] } ] } 
    ] 
}
assert.deepStrictEqual(jsonFromXml, expectedObj)
console.log("\x1b[32m", "done")
