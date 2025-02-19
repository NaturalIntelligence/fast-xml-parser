import pkg from '../../package.json' assert { type: 'json' };
const version = pkg.version;


export default `Fast XML Parser ${version}
----------------
$ fxparser [-ns|-a|-c|-v|-V] <filename> [-o outputfile.json]
$ cat xmlfile.xml | fxparser [-ns|-a|-c|-v|-V] [-o outputfile.json]

Options
----------------
-ns: remove namespace from tag and atrribute name.
-a: don't parse attributes.
-c: parse values to premitive type.
-v: validate before parsing.
-V: validate only.`