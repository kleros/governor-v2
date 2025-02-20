import { fixupConfigRules, fixupPluginRules } from "@eslint/compat";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import _import from "eslint-plugin-import";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [
  ...fixupConfigRules(
    compat.extends(
      "eslint:recommended",
      "plugin:@typescript-eslint/recommended",
      "plugin:prettier/recommended",
      "plugin:import/recommended",
      "plugin:node/recommended"
    )
  ),
  {
    plugins: {
      "@typescript-eslint": fixupPluginRules(typescriptEslint),
      prettier: fixupPluginRules(prettier),
      import: fixupPluginRules(_import),
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: "commonjs",
    },

    rules: {
      "no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "(^_+[0-9]*$)|([iI]gnored$)|(^ignored)",
          argsIgnorePattern: "(^_+[0-9]*$)|([iI]gnored$)|(^ignored)",
        },
      ],

      "prettier/prettier": "error",

      "import/no-unresolved": [
        "error",
        {
          commonjs: true,
        },
      ],

      "node/no-unsupported-features/es-syntax": [
        "error",
        {
          ignores: ["modules"],
        },
      ],

      "node/no-missing-import": [
        "error",
        {
          tryExtensions: [".js", ".ts", ".json", ".node"],
        },
      ],
    },
  },
];
