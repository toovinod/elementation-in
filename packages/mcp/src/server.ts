import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import {
  HttpElementationClient,
  type ElementationClient,
  type ElementationClientOptions,
} from "./client";
import { registerElementationTools } from "./tools";

export interface ElementationMcpServerOptions extends ElementationClientOptions {
  /** Provide a custom client (e.g. an embedded direct-database one). Defaults to HTTP. */
  client?: ElementationClient;
  name?: string;
  version?: string;
}

const INSTRUCTIONS = [
  "Elementation lets developers select UI elements and leave feedback.",
  "Use elementation_get_all_pending (or elementation_watch_annotations to block) to find work,",
  "elementation_acknowledge before you start, then apply the change the feedback describes and",
  "elementation_resolve when done (or elementation_dismiss with a reason, or elementation_reply",
  "to ask for clarification). Each annotation carries an exact selector, styles, and source file.",
].join(" ");

/**
 * Builds an Elementation MCP server with all nine tools registered. The caller connects it
 * to a transport (the `elementation` CLI uses stdio).
 */
export function createElementationMcpServer(options: ElementationMcpServerOptions = {}): McpServer {
  const client = options.client ?? new HttpElementationClient(options);
  const server = new McpServer(
    {
      name: options.name ?? "elementation",
      version: options.version ?? "0.0.0",
    },
    { instructions: INSTRUCTIONS },
  );
  registerElementationTools(server, client);
  return server;
}
