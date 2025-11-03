import {
    XMLBuilder,
    XMLParser,
    XMLValidator,
    type X2jOptions,
    type XmlBuilderOptions,
    type validationOptions,
} from '../../src/fxp.js';

import {
    JsObjOutputBuilder,
    XMLParser as V6XMLParser,
    type V6BuilderOptions,
    type V6ParserOptions,
} from '../../src/v6/index.js';

const parseOpts: X2jOptions = {};

const XML = `
    <?xml version="1.0"?>
    <SomeElement name="parent">
        <SomeNestedElement name="child"></SomeNestedElement>
    </SomeElement>
`;

const parser = new XMLParser(parseOpts);
const parsed = parser.parse(XML);

console.log(!!parsed);

const buildOpts: XmlBuilderOptions = {};

const builder = new XMLBuilder(buildOpts);

const built = builder.build({
    any_name: {
        person: {
            phone: [
                15555551313,
                15555551212
            ]
        }
    }
});

console.log(!!built);

const validateOpts: validationOptions = {};

const isValid = XMLValidator.validate(built, validateOpts);

console.log(!!isValid);

// v6 typings smoke
const v6Opts: V6ParserOptions = {
    preserveOrder: false,
    attributes: { ignore: false, booleanType: true, entities: true },
};
const v6Parser = new V6XMLParser(v6Opts);
const v6Parsed = v6Parser.parse('<r>1</r>');
console.log(!!v6Parsed);

const v6BuilderOpts: V6BuilderOptions = {
    nameFor: { text: '#text' },
};
const outBuilder = new JsObjOutputBuilder(v6BuilderOpts);
// ensure builder has getInstance signature
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _builderInstance = outBuilder.getInstance(v6Opts);


