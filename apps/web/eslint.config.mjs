import { nextConfig } from "@elementation/eslint-config/next";

export default [{ ignores: [".next/**", "src/generated/**", "next-env.d.ts"] }, ...nextConfig];
