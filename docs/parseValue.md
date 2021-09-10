From 3.20.0

FXP uses [strnum](https://github.com/NaturalIntelligence/strnum) npm library to parse numbers. So you can pass the options supported by *strnum* to `numParseOptions` property of FXP options.
```js
const result = parser.parse(xmlData, {
    parseNodeValue: true, //default
    numParseOptions: {
        hex :  true, //if true hex numbers will converted to decimal
        leadingZeros: true, //if true '006' will be parsed to 6
        skipLike: /regex/ //if set then string matching to given regex will not parse
    }
});
```
Backward compatibility

if `parseTrueNumberOnly` is set to `true`
```js
const result = parser.parse(xmlData, {
    parseNodeValue: true, //default
    parseTrueNumberOnly: true
});
```
then it'll be considered as 
```js
const result = parser.parse(xmlData, {
    parseNodeValue: true, //default
    numParseOptions: {
        hex :  true,
        leadingZeros: false,
    }
});
```

**Breaking change**

long numbers would be parsed to scientific notation