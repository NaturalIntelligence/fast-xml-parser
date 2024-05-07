import {
    XMLParser,
    XMLBuilder,
    XMLValidator,
    type X2jOptions,
    type XmlBuilderOptions,
    type validationOptions,
} from '../../src/fxp';

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


