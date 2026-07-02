import { mkdtemp, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { buildServerEntry, mergeMcpConfig, runInit } from "./init";

describe("buildServerEntry", () => {
  it("builds an npx invocation without a token", () => {
    expect(buildServerEntry("http://localhost:3000")).toEqual({
      command: "npx",
      args: ["-y", "elementation", "server", "--http-url", "http://localhost:3000"],
    });
  });

  it("appends the token when present", () => {
    expect(buildServerEntry("http://x", "tok").args).toEqual([
      "-y",
      "elementation",
      "server",
      "--http-url",
      "http://x",
      "--token",
      "tok",
    ]);
  });
});

describe("mergeMcpConfig", () => {
  it("adds the elementation server while preserving existing ones", () => {
    const merged = mergeMcpConfig(
      { mcpServers: { other: { command: "x", args: [] } } },
      buildServerEntry("http://localhost:3000"),
    );
    expect(Object.keys(merged.mcpServers)).toEqual(["other", "elementation"]);
  });

  it("handles a missing or invalid existing config", () => {
    const merged = mergeMcpConfig(undefined, buildServerEntry("http://localhost:3000"));
    expect(merged.mcpServers.elementation?.command).toBe("npx");
  });
});

describe("runInit", () => {
  it("writes a Claude Code .mcp.json into the target cwd", async () => {
    const dir = await mkdtemp(join(tmpdir(), "elementation-init-"));
    await runInit({ client: "claude", cwd: dir, httpUrl: "http://localhost:3000" });
    const written = JSON.parse(await readFile(join(dir, ".mcp.json"), "utf8")) as {
      mcpServers: { elementation: { args: string[] } };
    };
    expect(written.mcpServers.elementation.args).toContain("--http-url");
  });
});
