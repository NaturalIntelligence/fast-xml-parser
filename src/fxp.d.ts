type X2jOptions = {
  preserveOrder: boolean;
  attributeNamePrefix: string;
  attributesGroupName: false | string;
  textNodeName: string;
  ignoreAttributes: boolean;
  removeNSPrefix: boolean;
  allowBooleanAttributes: boolean;
  parseTagValue: boolean;
  parseAttributeValue: boolean;
  trimValues: boolean;
  cdataTagName: false | string;
  tagValueProcessor: (tagValue: string, tagName: string) => string;
  attrValueProcessor: (attrValue: string, attrName: string) => string;
  numberParseOptions: strnumOptions;
  stopNodes: string[];
  alwaysCreateTextNode: boolean;
  isArray: (tagName: string, jpath: string, isLeafNode: boolean, isAttribute: boolean) => boolean;
};
type strnumOptions = {
  hex: boolean;
  leadingZeros: boolean,
  skipLike?: RegExp
}
type X2jOptionsOptional = Partial<X2jOptions>;
type validationOptions = {
  allowBooleanAttributes: boolean;
};
type validationOptionsOptional = Partial<validationOptions>;

type XmlBuilderOptions = {
  attributeNamePrefix: string;
  attributesGroupName: false | string;
  textNodeName: string;
  ignoreAttributes: boolean;
  cdataTagName: false | string;
  cdataPositionChar: string;
  format: boolean;
  indentBy: string;
  suppressEmptyNode: boolean;
  tagValueProcessor: (tagValue: string) => string;
  attrValueProcessor: (attrValue: string) => string;
};
type XmlBuilderOptionsOptional = Partial<XmlBuilderOptions>;

type ESchema = string | object | Array<string|object>;

type ValidationError = {
  err: { code: string; msg: string, line: number, col: number };
};

export class XMLParser {
  constructor(options?: X2jOptionsOptional);
  parse(xmlData: string | Buffer ,validationOptions?: validationOptionsOptional | boolean);
}

export function XMLValidator(
  xmlData: string,
  options?: validationOptionsOptional
): true | ValidationError;

export class XMLBuilder {
  constructor(options: XmlBuilderOptionsOptional);
  parse(options: any): any;
}
