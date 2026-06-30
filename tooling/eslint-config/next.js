import next from "@next/eslint-plugin-next";
import { reactConfig } from "./react.js";

/**
 * ESLint flat config for the Next.js app.
 * @type {import("eslint").Linter.Config[]}
 */
export const nextConfig = [
  ...reactConfig,
  {
    plugins: { "@next/next": next },
    rules: {
      ...next.configs.recommended.rules,
      ...next.configs["core-web-vitals"].rules,
    },
  },
];

export default nextConfig;
