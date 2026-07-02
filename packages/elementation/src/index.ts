export {
  createElementationMcpServer,
  HttpElementationClient,
  ElementationApiError,
  DEFAULT_BASE_URL,
  type ElementationClient,
  type ElementationClientOptions,
  type ElementationMcpServerOptions,
} from "@elementation/mcp";
export {
  DEFAULT_HTTP_URL,
  resolveConfig,
  type CommandOptions,
  type ResolvedConfig,
} from "./config";
export { runServer } from "./commands/server";
export { runDoctor } from "./commands/doctor";
export {
  runInit,
  buildServerEntry,
  mergeMcpConfig,
  SUPPORTED_CLIENTS,
  type InitOptions,
  type McpConfigFile,
  type McpServerEntry,
} from "./commands/init";
