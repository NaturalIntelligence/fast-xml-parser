import {
    XMLParser,
    XMLBuilder,
    XMLValidator,
    type EntityDecoderOptions,
    type X2jOptions,
    type XmlBuilderOptions,
    type validationOptions,
} from '../../src/fxp.js';

const parseOpts: X2jOptions = {};

// The parser hands `setXmlVersion` the number it read off `<?xml version="…"?>`.
const entityDecoder: EntityDecoderOptions = {
    setExternalEntities: () => {},
    addInputEntities: () => {},
    reset: () => {},
    decode: (text: string) => text,
    setXmlVersion: (version: number) => {
        console.log(version.toFixed(1));
    },
};

console.log(!!new XMLParser({ entityDecoder }));

// A decoder typed for a string version would compare it against "1.1", which never matches the number it receives.
type StringVersionAccepted = ((version: string) => void) extends EntityDecoderOptions['setXmlVersion'] ? true : false;
const stringVersionAccepted: StringVersionAccepted = false;

console.log(stringVersionAccepted);

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


