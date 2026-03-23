/**
 * Regression for GH-808: ESM declaration must use NodeNext-valid relative specifiers
 * (e.g. `./pem.js` → resolves to `pem.d.ts`) so consumers with `moduleResolution: "NodeNext"`
 * and `skipLibCheck: false` do not hit TS2834.
 *
 * Resolves the same entry as the package `import` types (`./src/fxp.d.ts`).
 */
import type { XMLParser } from "../../src/fxp.js";

type _Smoke = XMLParser;
