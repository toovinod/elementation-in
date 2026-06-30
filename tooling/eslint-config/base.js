import js from "@eslint/js";
import tseslint from "typescript-eslint";
import turbo from "eslint-plugin-turbo";
import prettier from "eslint-config-prettier";

/**
 * Shared ESLint flat config used across the monorepo.
 * @type {import("eslint").Linter.Config[]}
 */
export const base = [
  {
    ignores: ["**/dist/**", "**/.next/**", "**/node_modules/**", "**/coverage/**", "**/.turbo/**"],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: { turbo },
    rules: {
      "turbo/no-undeclared-env-vars": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/consistent-type-imports": [
        "warn",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
    },
  },
  prettier,
];

export default base;
