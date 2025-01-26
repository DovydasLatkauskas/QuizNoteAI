import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Disable rules for specific issues mentioned
      "@typescript-eslint/ban-ts-comment": "off", // Allow the use of "@ts-nocheck"
      "@typescript-eslint/no-explicit-any": "warn", // Warn instead of error for 'any' types
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ], // Ignore unused vars starting with '_'
      "prefer-const": "warn", // Warn instead of error for const reassignment
      "react/no-unescaped-entities": "off", // Disable escaping single quotes
    },
    overrides: [
      {
        files: ["**/*.tsx"], // Target specific files (e.g., TypeScript React)
        rules: {
          "@typescript-eslint/no-unused-vars": "warn",
        },
      },
    ],
  },
];

export default eslintConfig;
