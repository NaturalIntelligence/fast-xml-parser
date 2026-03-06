As many security vulnerability has been raised for prototype pollution, this is an important note that the following code is not the security vulnerability

```js
const { XMLParser } = require("fast-xml-parser");

const xml = `<root>
  <constructor>pwned</constructor>
</root>`;

const parser = new XMLParser();
const result = parser.parse(xml);

const rootObj = result.root;
console.log(rootObj.constructor);          // "pwned" (should be [Function: Object])
console.log(rootObj.constructor === Object); // false

// downstream impact:
try {
  console.log(rootObj.constructor.name);   // throws TypeError
} catch (e) {
  console.log(e.message);                 // Cannot read properties of undefined
}
```

- Unreasonable use of the library
- Don't let user to inject any malicious code or information
- Don't leak any sensitive information like server detail, user data, app data etc.

