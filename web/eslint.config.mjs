import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import governorEslintConfig from "@kleros/governor-v2-eslint-config";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [...governorEslintConfig, ...compat.extends("plugin:@next/next/recommended")];

export default eslintConfig;
