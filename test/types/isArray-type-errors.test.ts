/**
 * Type error tests for isArray option type inference (Issue #803)
 *
 * These tests verify that TypeScript correctly catches type errors
 * when the jPath option doesn't match the callback parameter usage.
 */

import { XMLParser, X2jOptions, X2jOptionsWithJPathString, X2jOptionsWithMatcher } from '../../src/fxp';

// ERROR TEST 1: Using string methods when jPath: false
// This should cause a TypeScript error because matcher is unknown, not string
const errorOptions1: X2jOptions = {
  jPath: false,
  isArray: (tagName, matcher, isLeafNode, isAttribute) => {
    // @ts-expect-error - matcher is unknown, not string - includes() not available
    return ['root.items'].includes(matcher);
  },
};

// ERROR TEST 2: Explicitly typed as X2jOptionsWithMatcher but using string methods
const errorOptions2: X2jOptionsWithMatcher = {
  jPath: false,
  isArray: (tagName, matcher, isLeafNode, isAttribute) => {
    // @ts-expect-error - matcher is unknown, not string
    return matcher.startsWith('root.');
  },
};

// ERROR TEST 3: Trying to set jPath: true on X2jOptionsWithMatcher type
const errorOptions3: X2jOptionsWithMatcher = {
  // @ts-expect-error - jPath must be false for X2jOptionsWithMatcher
  jPath: true,
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    return false;
  },
};

// ERROR TEST 4: Trying to set jPath: false on X2jOptionsWithJPathString type
const errorOptions4: X2jOptionsWithJPathString = {
  // @ts-expect-error - jPath must be true or undefined for X2jOptionsWithJPathString
  jPath: false,
  isArray: (tagName, jPath, isLeafNode, isAttribute) => {
    return false;
  },
};

console.log('All error type tests defined correctly!');
