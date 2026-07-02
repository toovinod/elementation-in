import { describe, expect, it } from "vitest";
import { DEFAULT_HTTP_URL, resolveConfig } from "./config";

describe("resolveConfig", () => {
  it("defaults to localhost with no token", () => {
    expect(resolveConfig({}, {})).toEqual({ httpUrl: DEFAULT_HTTP_URL, token: undefined });
  });

  it("prefers explicit options over env and strips trailing slashes", () => {
    const config = resolveConfig(
      { httpUrl: "https://app.example.com/", token: "abc" },
      { ELEMENTATION_HTTP_URL: "http://ignored", ELEMENTATION_TOKEN: "ignored" },
    );
    expect(config).toEqual({ httpUrl: "https://app.example.com", token: "abc" });
  });

  it("falls back to env", () => {
    const config = resolveConfig(
      {},
      { ELEMENTATION_HTTP_URL: "http://localhost:4000", ELEMENTATION_TOKEN: "t" },
    );
    expect(config).toEqual({ httpUrl: "http://localhost:4000", token: "t" });
  });

  it("treats an empty token as absent", () => {
    expect(resolveConfig({ token: "" }, {}).token).toBeUndefined();
  });
});
