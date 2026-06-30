import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts", "src/storage/index.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  sourcemap: true,
  treeshake: true,
});
