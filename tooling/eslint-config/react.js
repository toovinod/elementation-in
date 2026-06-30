import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import { base } from "./base.js";

/**
 * ESLint flat config for React libraries.
 * @type {import("eslint").Linter.Config[]}
 */
export const reactConfig = [
  ...base,
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    plugins: { react, "react-hooks": reactHooks },
    languageOptions: {
      globals: { ...globals.browser },
    },
    settings: { react: { version: "detect" } },
    rules: {
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default reactConfig;
