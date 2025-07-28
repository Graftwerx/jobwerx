import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Base Next.js + TypeScript config
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Custom rules to quiet noise
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"],
    ignores: ["src/generated/**"],

    rules: {
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-expressions": "warn",
      "@typescript-eslint/no-this-alias": "off",
      "@typescript-eslint/no-require-imports": "off", // In case generated files use require()
    },
  },
];

export default eslintConfig;

