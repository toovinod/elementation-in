import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  transpilePackages: [
    "@elementation/core",
    "@elementation/prompt-engine",
    "@elementation/source-map",
    "@elementation/sdk",
  ],
  serverExternalPackages: ["better-sqlite3"],
  reactStrictMode: true,
};

const withMDX = createMDX();

export default withMDX(nextConfig);
