import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createElementationMcpServer } from "@elementation/mcp";
import { resolveConfig, type CommandOptions } from "../config";

/**
 * Runs the Elementation MCP server over stdio. stdout is the MCP protocol channel, so all
 * human-facing logging goes to stderr.
 */
export async function runServer(options: CommandOptions = {}): Promise<void> {
  const config = resolveConfig(options);
  const server = createElementationMcpServer({
    baseUrl: config.httpUrl,
    token: config.token,
  });
  const transport = new StdioServerTransport();
  await server.connect(transport);
  process.stderr.write(`elementation MCP server ready (backend: ${config.httpUrl})\n`);
}
