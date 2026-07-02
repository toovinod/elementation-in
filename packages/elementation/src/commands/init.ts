import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { resolveConfig, type CommandOptions } from "../config";

export interface InitOptions extends CommandOptions {
  client?: string;
  cwd?: string;
  home?: string;
}

export interface McpServerEntry {
  command: string;
  args: string[];
}

export interface McpConfigFile {
  mcpServers: Record<string, McpServerEntry>;
}

export const SUPPORTED_CLIENTS = ["claude", "cursor", "windsurf", "codex"] as const;

/** The `npx elementation server ...` invocation an MCP client should run. */
export function buildServerEntry(httpUrl: string, token?: string): McpServerEntry {
  const args = ["-y", "elementation", "server", "--http-url", httpUrl];
  if (token) args.push("--token", token);
  return { command: "npx", args };
}

/** Merges the Elementation entry into an existing (or empty) `mcpServers` config. */
export function mergeMcpConfig(
  existing: unknown,
  entry: McpServerEntry,
  key = "elementation",
): McpConfigFile {
  const base =
    existing && typeof existing === "object"
      ? (existing as Partial<McpConfigFile> & Record<string, unknown>)
      : {};
  const servers = base.mcpServers && typeof base.mcpServers === "object" ? base.mcpServers : {};
  return { ...base, mcpServers: { ...servers, [key]: entry } };
}

interface JsonTarget {
  path: string;
  label: string;
}

function jsonTarget(client: string, cwd: string, home: string): JsonTarget | null {
  switch (client) {
    case "claude":
      return { path: join(cwd, ".mcp.json"), label: "Claude Code" };
    case "cursor":
      return { path: join(cwd, ".cursor", "mcp.json"), label: "Cursor" };
    case "windsurf":
      return { path: join(home, ".codeium", "windsurf", "mcp_config.json"), label: "Windsurf" };
    default:
      return null;
  }
}

function codexSnippet(entry: McpServerEntry): string {
  const args = entry.args.map((arg) => `"${arg}"`).join(", ");
  return [
    "Codex uses TOML. Add this to ~/.codex/config.toml:",
    "",
    "[mcp_servers.elementation]",
    `command = "${entry.command}"`,
    `args = [${args}]`,
    "",
  ].join("\n");
}

async function readJsonIfExists(path: string): Promise<unknown> {
  try {
    return JSON.parse(await readFile(path, "utf8")) as unknown;
  } catch {
    return undefined;
  }
}

/** Writes or merges the MCP server config for the requested agent client. */
export async function runInit(options: InitOptions = {}): Promise<void> {
  const config = resolveConfig(options);
  const cwd = options.cwd ?? process.cwd();
  const home = options.home ?? homedir();
  const client = (options.client ?? "claude").toLowerCase();
  const entry = buildServerEntry(config.httpUrl, config.token);
  const out = (line: string): void => void process.stdout.write(`${line}\n`);

  if (client === "codex") {
    out(codexSnippet(entry));
    return;
  }

  const target = jsonTarget(client, cwd, home);
  if (!target) {
    process.stderr.write(
      `Unknown client "${client}". Supported: ${SUPPORTED_CLIENTS.join(", ")}.\n`,
    );
    process.exitCode = 1;
    return;
  }

  const merged = mergeMcpConfig(await readJsonIfExists(target.path), entry);
  await mkdir(dirname(target.path), { recursive: true });
  await writeFile(target.path, `${JSON.stringify(merged, null, 2)}\n`, "utf8");
  out(`Wrote ${target.label} MCP config: ${target.path}`);
  out(`Backend: ${config.httpUrl}`);
}
