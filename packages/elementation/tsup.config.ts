import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  format: ["esm"],
  dts: { entry: "src/index.ts" },
  clean: true,
  sourcemap: true,
  treeshake: true,
  // Bundle the workspace packages so the published CLI is self-contained.
  noExternal: [/^@elementation\//],
});
