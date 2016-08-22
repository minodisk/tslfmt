import {update} from "../lib/transformer";
import * as assert from "power-assert";

describe("quotemark", () => {
  describe("double quote", () => {

    it("should replace to double quote", () => {
      [
        {
          code: `let foo = 'foo';`,
          expected: `let foo = "foo";`,
        },
        {
          code: `// 'foo'
let bar = 'bar';`,
          expected: `// 'foo'
let bar = "bar";`,
        },
        {
          code: `{
  'foo': "bar"
};`,
          expected: `{
  "foo": "bar"
};`,
        },
        {
          code: `[
    {
        // 'foo': {},
        'bar': {}
    },
];`,
          expected: `[
    {
        // 'foo': {},
        "bar": {}
    },
];`,
        },
      ].forEach(({code, expected}) => {
        const actual = update("dummy.ts", code, {
          rules: {
            "quotemark": [
              true,
              "double",
            ],
          },
        }).getFullText();
        assert.equal(actual, expected);
      });
    });

  });
});
