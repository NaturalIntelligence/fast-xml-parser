export type ValueParserName = 'trim' | 'join' | 'boolean' | 'number' | 'currency';

export interface ValueParser {
  parse(val: string): unknown;
}

export interface V6BuilderOptions {
  nameFor?: {
    text?: string;
    comment?: string | false;
    cdata?: string | false;
  };
  /** Whether to include processing instruction tags */
  piTag?: boolean;
  /** Whether to include XML declaration via addDeclaration */
  declaration?: boolean;
  tags?: {
    valueParsers?: (ValueParserName | ValueParser)[];
  };
  attributes?: {
    prefix?: string;
    suffix?: string;
    groupBy?: string;
    valueParsers?: (ValueParserName | ValueParser)[];
  };
  dataType?: Record<string, unknown>;
}

export interface V6OutputBuilderInstance {
  addTag(tag: { name: string }): void;
  closeTag(): void;
  addValue(text: string): void;
  addPi(name: string): void;
  addComment(text: string): void;
  getOutput(): any;
}

export class JsObjOutputBuilder {
  constructor(options?: V6BuilderOptions);
  getInstance(parserOptions: V6ParserOptions): V6OutputBuilderInstance;
  registerValueParser(name: string, parserInstance: ValueParser): void;
}

export class JsArrOutputBuilder {
  constructor(options?: V6BuilderOptions);
  getInstance(parserOptions: V6ParserOptions): V6OutputBuilderInstance;
  registerValueParser(name: string, parserInstance: ValueParser): void;
}

export class JsMinArrOutputBuilder {
  constructor(options?: V6BuilderOptions);
  getInstance(parserOptions: V6ParserOptions): V6OutputBuilderInstance;
  registerValueParser(name: string, parserInstance: ValueParser): void;
}

export interface V6ParserOptions {
  preserveOrder?: boolean;
  removeNSPrefix?: boolean;
  stopNodes?: string[];
  htmlEntities?: boolean;
  tags?: {
    unpaired?: string[];
    nameFor?: {
      cdata?: false | string;
      comment?: false | string;
      text?: string;
    };
    separateTextProperty?: boolean;
  };
  attributes?: {
    ignore?: boolean;
    booleanType?: boolean;
    entities?: boolean;
  };
  only?: string[];
  hierarchy?: boolean;
  skip?: string[];
  select?: string[];
  stop?: string[];
  OutputBuilder?: JsObjOutputBuilder | JsArrOutputBuilder | JsMinArrOutputBuilder;
}

export declare const v6DefaultOptions: V6ParserOptions;
export declare function buildV6Options(options?: V6ParserOptions): V6ParserOptions;

export class XMLParser {
  constructor(options?: V6ParserOptions);
  parse(xmlData: string | Uint8Array): any;
  parseBytesArr(xmlData: Uint8Array): any;
  addEntity(key: string, value: string): void;
}
