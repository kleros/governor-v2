import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("plugin:@next/next/recommended"),
  ...compat.config({
    extends: ["next/core-web-vitals", "next/typescript"],
  }),
  {
    rules: {
      // Add the import/order rule
      "import/order": [
        "warn",
        {
          groups: ["builtin", "external", "internal", "parent", "sibling", "index"],

          pathGroups: [
            {
              pattern: "react",
              group: "external",
              position: "before",
            },
            {
              pattern: "next**",
              group: "external",
              position: "before",
            },
            {
              pattern: "{@reown/**,wagmi}",
              group: "external",
              position: "after",
            },
            {
              pattern: "{@/hooks/**,@/consts/**,@/context/**}",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/queries/**,}",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/src/**,}",
              group: "internal",
              position: "after",
            },
            {
              pattern: "{@/components/**,}",
              group: "internal",
              position: "after",
            },
            {
              pattern: "./*",
              group: "sibling",
              position: "after",
            },
          ],

          pathGroupsExcludedImportTypes: ["builtin"],
          "newlines-between": "always",

          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
];

export default eslintConfig;
