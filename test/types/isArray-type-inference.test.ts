/**
 * Type tests for isArray option type inference (Issue #803)
 *
 * These tests verify that TypeScript correctly narrows the type of the
 * jPath/matcher parameter in callbacks based on the jPath option value.
 */

import { XMLParser, X2jOptions, X2jOptionsBase, X2jOptionsWithJPathString, X2jOptionsWithMatcher } from '../../src/fxp';

// Helper type to verify type narrowing at compile time
type AssertType<T, Expected> = T extends Expected ? (Expected extends T ? true : false) : false;

// Test 1: Default options (jPath: true or undefined) - callbacks receive string
const defaultOptions: X2jOptions = {
  // jPath defaults to true, so callbacks should receive string
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    // TypeScript should infer jPath as string
    const path: string = jPath;
    return ['root.items', 'root.users'].includes(jPath);
  },
  tagValueProcessor: (tagName, tagValue, jPath, hasAttributes, isLeafNode) => {
    // jPath should be string
    const path: string = jPath;
    return tagValue.toUpperCase();
  },
  attributeValueProcessor: (attrName, attrValue, jPath) => {
    // jPath should be string
    const path: string = jPath;
    return attrValue;
  },
  updateTag: (tagName, jPath, attrs) => {
    // jPath should be string
    const path: string = jPath;
    return tagName;
  },
};

// Test 2: Explicit jPath: true - callbacks receive string
const optionsWithJPathTrue: X2jOptions = {
  jPath: true,
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    // TypeScript should infer jPath as string
    const path: string = jPath;
    return jPath.includes('items');
  },
  ignoreAttributes: (attrName, jPath) => {
    // jPath should be string
    const path: string = jPath;
    return attrName.startsWith('_');
  },
};

// Test 3: jPath: false - callbacks receive Matcher (unknown)
const optionsWithJPathFalse: X2jOptions = {
  jPath: false,
  isArray: (tagName, matcher, isLeafNode, isAttribute) => {
    // matcher should be Matcher (unknown)
    // We can't use string methods directly - this is the expected behavior
    // Users must type-cast or use Matcher methods
    return false;
  },
  tagValueProcessor: (tagName, tagValue, matcher, hasAttributes, isLeafNode) => {
    // matcher should be Matcher (unknown)
    return tagValue;
  },
};

// Test 4: Explicit type annotation with X2jOptionsWithJPathString
const stringPathOptions: X2jOptionsWithJPathString = {
  jPath: true, // or omit for default
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    // jPath is definitely string here
    return ['root.a', 'root.b'].includes(jPath);
  },
};

// Test 5: Explicit type annotation with X2jOptionsWithMatcher
const matcherOptions: X2jOptionsWithMatcher = {
  jPath: false,
  isArray: (tagName, matcher, isLeafNode, isAttribute) => {
    // matcher is Matcher (unknown) here
    return false;
  },
};

// Test 6: Real-world use case from issue #803
const alwaysArray = ['root.items.item', 'root.users.user', 'root.config.settings'];

const realWorldOptions: X2jOptions = {
  ignoreAttributes: false,
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    // This should work without type assertion now!
    return alwaysArray.includes(jPath);
  },
};

// Test 7: Using the parser with these options
const parser1 = new XMLParser(defaultOptions);
const parser2 = new XMLParser(optionsWithJPathTrue);
const parser3 = new XMLParser(optionsWithJPathFalse);
const parser4 = new XMLParser(stringPathOptions);
const parser5 = new XMLParser(matcherOptions);
const parser6 = new XMLParser(realWorldOptions);

// Test 8: Inline options should also work
const parser7 = new XMLParser({
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    return ['root.items'].includes(jPath);
  },
});

const parser8 = new XMLParser({
  jPath: true,
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    return jPath.startsWith('root.');
  },
});

// Test 9: Combined with other options
const combinedOptions: X2jOptions = {
  preserveOrder: false,
  ignoreAttributes: false,
  attributeNamePrefix: '@_',
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    return jPath.endsWith('.item');
  },
  tagValueProcessor: (tagName, tagValue, jPath) => {
    if (jPath.includes('numbers')) {
      return parseInt(tagValue, 10);
    }
    return tagValue;
  },
};

console.log('All type tests passed!');
