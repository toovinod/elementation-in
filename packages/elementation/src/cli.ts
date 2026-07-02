#!/usr/bin/env node
import { createRequire } from "node:module";
import { runDoctor } from "./commands/doctor";
import { runInit } from "./commands/init";
import { runServer } from "./commands/server";

interface ParsedArgs {
  command?: string;
  flags: Record<string, string | boolean>;
}

function parseArgs(argv: string[]): ParsedArgs {
  const flags: Record<string, string | boolean> = {};
  let command: string | undefined;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === undefined) continue;

    if (arg.startsWith("--")) {
      const eq = arg.indexOf("=");
      if (eq !== -1) {
        flags[arg.slice(2, eq)] = arg.slice(eq + 1);
      } else {
        const key = arg.slice(2);
        const next = argv[i + 1];
        if (next !== undefined && !next.startsWith("-")) {
          flags[key] = next;
          i++;
        } else {
          flags[key] = true;
        }
      }
    } else if (arg === "-h") {
      flags.help = true;
    } else if (arg === "-v") {
      flags.version = true;
    } else if (!command) {
      command = arg;
    }
  }

  return { command, flags };
}

function readVersion(): string {
  try {
    const require = createRequire(import.meta.url);
    const pkg = require("../package.json") as { version?: string };
    return pkg.version ?? "0.0.0";
  } catch {
    return "0.0.0";
  }
}

function asString(value: string | boolean | undefined): string | undefined {
  return typeof value === "string" ? value : undefined;
}

const HELP = `elementation — MCP server that hands UI annotations to your AI coding agent

Usage:
  elementation <command> [options]

Commands:
  server     Run the MCP server over stdio (for your agent to launch)
  init       Write the MCP config for an agent client
  doctor     Check Node, config, and backend connectivity

Options:
  --http-url <url>   Elementation backend origin (default http://localhost:3000)
  --token <token>    Bearer token for a secured backend
  --client <name>    init only: claude | cursor | windsurf | codex (default claude)
  -h, --help         Show this help
  -v, --version      Show the version

Environment:
  ELEMENTATION_HTTP_URL, ELEMENTATION_TOKEN
`;

async function main(): Promise<void> {
  const { command, flags } = parseArgs(process.argv.slice(2));

  if (!command) {
    process.stdout.write(flags.version ? `${readVersion()}\n` : HELP);
    return;
  }
  if (flags.version) {
    process.stdout.write(`${readVersion()}\n`);
    return;
  }
  if (flags.help) {
    process.stdout.write(HELP);
    return;
  }

  const options = { httpUrl: asString(flags["http-url"]), token: asString(flags.token) };

  switch (command) {
    case "server":
      await runServer(options);
      return;
    case "init":
      await runInit({ ...options, client: asString(flags.client) });
      return;
    case "doctor":
      await runDoctor(options);
      return;
    case "help":
      process.stdout.write(HELP);
      return;
    default:
      process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
      process.exitCode = 1;
  }
}

main().catch((error: unknown) => {
  process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
  process.exitCode = 1;
});
