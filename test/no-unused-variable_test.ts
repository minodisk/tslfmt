import {update} from "../lib/transformer";
import * as assert from "power-assert";
//
// describe("no-unused-variable", () => {
//   describe("with true", () => {
//
//     it("should remove unused variable", () => {
//       [
//         {
//           code: `let foo = 'foo';`,
//           expected: ``,
//         },
//         {
//           code: `let foo, bar: string;
// qux(foo);`,
//           expected: `let foo: string;
// qux(foo);`,
//         },
//         {
//           code: `let foo, bar: string;
// qux(bar);`,
//           expected: `let bar: string;
// qux(bar);`,
//         },
//         {
//           code: `let foo, bar, baz: string;
// qux(foo);`,
//           expected: `let foo: string;
// qux(foo);`,
//         },
//         {
//           code: `let foo, bar, baz: string;
// qux(bar);`,
//           expected: `let bar: string;
// qux(bar);`,
//         },
//         {
//           code: `let foo, bar, baz: string;
// qux(baz);`,
//           expected: `let baz: string;
// qux(baz);`,
//         },
//         {
//           code: `let foo, bar, baz: string;
// qux(foo, bar);`,
//           expected: `let foo, bar: string;
// qux(foo, bar);`,
//         },
//         {
//           code: `let foo, bar, baz: string;
// qux(foo, baz);`,
//           expected: `let foo, baz: string;
// qux(foo, baz);`,
//         },
//         {
//           code: `let foo, bar, baz: string;
// qux(foo, bar);`,
//           expected: `let foo, bar: string;
// qux(foo, bar);`,
//         },
//         {
//           code: `let foo: number, bar: string;
// qux(foo);`,
//           expected: `let foo: number;
// qux(foo);`,
//         },
//         {
//           code: `let foo: number, bar: string;
// qux(bar);`,
//           expected: `let bar: string;
// qux(bar);`,
//         },
//       ].forEach(({code, expected}) => {
//         const actual = update("dummy.ts", code, {
//           rules: {
//             "no-unused-variable": [
//               true,
//             ],
//           },
//         }).getFullText();
//         assert.equal(actual, expected);
//       });
//     });
//
//   });
// });
