import { z } from "zod";
import type { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { ElementationApiError, type ElementationClient } from "./client";
import {
  formatAnnotation,
  formatAnnotationList,
  formatSession,
  formatSessionList,
  formatThreadMessage,
  summarizeAnnotation,
} from "./format";
import { watchAnnotations, type WatchOptions } from "./watch";

export interface ToolTextResult {
  // Index signature mirrors the MCP SDK's CallToolResult (a passthrough zod object),
  // so these results are assignable to registerTool's callback return type.
  [key: string]: unknown;
  content: { type: "text"; text: string }[];
  structuredContent?: Record<string, unknown>;
  isError?: boolean;
}

function ok(text: string, structured?: Record<string, unknown>): ToolTextResult {
  return {
    content: [{ type: "text", text }],
    ...(structured ? { structuredContent: structured } : {}),
  };
}

function fail(text: string): ToolTextResult {
  return { content: [{ type: "text", text }], isError: true };
}

async function run(fn: () => Promise<ToolTextResult>): Promise<ToolTextResult> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof ElementationApiError) {
      return fail(`Elementation API error ${error.status}: ${error.body || error.message}`);
    }
    return fail(error instanceof Error ? error.message : "Unknown error");
  }
}

export function listSessionsTool(client: ElementationClient): Promise<ToolTextResult> {
  return run(async () => {
    const sessions = await client.listSessions();
    return ok(formatSessionList(sessions), { count: sessions.length, sessions });
  });
}

export function getSessionTool(
  client: ElementationClient,
  sessionId: string,
): Promise<ToolTextResult> {
  return run(async () => {
    const session = await client.getSession(sessionId);
    if (!session) return fail(`Session ${sessionId} not found.`);
    const annotations = await client.getSessionAnnotations(sessionId);
    const body = `${formatSession(session)}\n\nAnnotations (${annotations.length}):\n${formatAnnotationList(annotations)}`;
    return ok(body, {
      session,
      count: annotations.length,
      annotations: annotations.map(summarizeAnnotation),
    });
  });
}

export function getPendingTool(
  client: ElementationClient,
  sessionId: string,
): Promise<ToolTextResult> {
  return run(async () => {
    const annotations = await client.getPending(sessionId);
    const body = `Pending in ${sessionId} (${annotations.length}):\n${formatAnnotationList(annotations)}`;
    return ok(body, {
      count: annotations.length,
      annotations: annotations.map(summarizeAnnotation),
    });
  });
}

export function getAllPendingTool(client: ElementationClient): Promise<ToolTextResult> {
  return run(async () => {
    const annotations = await client.getAllPending();
    const body = `Pending across all sessions (${annotations.length}):\n${formatAnnotationList(annotations)}`;
    return ok(body, {
      count: annotations.length,
      annotations: annotations.map(summarizeAnnotation),
    });
  });
}

export function acknowledgeTool(
  client: ElementationClient,
  annotationId: string,
): Promise<ToolTextResult> {
  return run(async () => {
    const annotation = await client.acknowledge(annotationId);
    if (!annotation) return fail(`Annotation ${annotationId} not found.`);
    return ok(`Acknowledged ${annotationId}.\n\n${formatAnnotation(annotation)}`, {
      annotation: summarizeAnnotation(annotation),
    });
  });
}

export function resolveTool(
  client: ElementationClient,
  annotationId: string,
  summary?: string,
): Promise<ToolTextResult> {
  return run(async () => {
    const annotation = await client.resolve(annotationId, summary);
    if (!annotation) return fail(`Annotation ${annotationId} not found.`);
    return ok(`Resolved ${annotationId}.`, { annotation: summarizeAnnotation(annotation) });
  });
}

export function dismissTool(
  client: ElementationClient,
  annotationId: string,
  reason: string,
): Promise<ToolTextResult> {
  return run(async () => {
    const annotation = await client.dismiss(annotationId, reason);
    if (!annotation) return fail(`Annotation ${annotationId} not found.`);
    return ok(`Dismissed ${annotationId}: ${reason}`, {
      annotation: summarizeAnnotation(annotation),
    });
  });
}

export function replyTool(
  client: ElementationClient,
  annotationId: string,
  message: string,
): Promise<ToolTextResult> {
  return run(async () => {
    const created = await client.reply(annotationId, message);
    if (!created) return fail(`Annotation ${annotationId} not found.`);
    return ok(formatThreadMessage(created), { message: created });
  });
}

export function watchAnnotationsTool(
  client: ElementationClient,
  options: WatchOptions,
): Promise<ToolTextResult> {
  return run(async () => {
    const { annotations, timedOut } = await watchAnnotations(client, options);
    if (timedOut) return ok("No new annotations before the watch timeout.", { count: 0, timedOut });
    const body = `${annotations.length} annotation(s) ready:\n${formatAnnotationList(annotations)}`;
    return ok(body, {
      count: annotations.length,
      timedOut,
      annotations: annotations.map(summarizeAnnotation),
    });
  });
}

/** Registers all nine `elementation_*` tools on an MCP server. */
export function registerElementationTools(server: McpServer, client: ElementationClient): void {
  server.registerTool(
    "elementation_list_sessions",
    {
      title: "List sessions",
      description: "List every Elementation session (a page/browser tab that has feedback).",
    },
    () => listSessionsTool(client),
  );

  server.registerTool(
    "elementation_get_session",
    {
      title: "Get session",
      description: "Fetch one session and all of its annotations.",
      inputSchema: { sessionId: z.string().describe("Session id from elementation_list_sessions") },
    },
    ({ sessionId }) => getSessionTool(client, sessionId),
  );

  server.registerTool(
    "elementation_get_pending",
    {
      title: "Get pending annotations for a session",
      description: "Fetch unresolved (pending or acknowledged) annotations for one session.",
      inputSchema: { sessionId: z.string().describe("Session id") },
    },
    ({ sessionId }) => getPendingTool(client, sessionId),
  );

  server.registerTool(
    "elementation_get_all_pending",
    {
      title: "Get all pending annotations",
      description: "Fetch every unresolved annotation across all sessions.",
    },
    () => getAllPendingTool(client),
  );

  server.registerTool(
    "elementation_acknowledge",
    {
      title: "Acknowledge annotation",
      description: "Mark an annotation as seen/in-progress before you start working on it.",
      inputSchema: { annotationId: z.string().describe("Annotation id") },
    },
    ({ annotationId }) => acknowledgeTool(client, annotationId),
  );

  server.registerTool(
    "elementation_resolve",
    {
      title: "Resolve annotation",
      description: "Mark an annotation as done once you have applied the change.",
      inputSchema: {
        annotationId: z.string().describe("Annotation id"),
        summary: z.string().optional().describe("Optional note on what you changed"),
      },
    },
    ({ annotationId, summary }) => resolveTool(client, annotationId, summary),
  );

  server.registerTool(
    "elementation_dismiss",
    {
      title: "Dismiss annotation",
      description: "Reject an annotation you will not act on, with a reason.",
      inputSchema: {
        annotationId: z.string().describe("Annotation id"),
        reason: z.string().min(1).describe("Why the feedback is being dismissed"),
      },
    },
    ({ annotationId, reason }) => dismissTool(client, annotationId, reason),
  );

  server.registerTool(
    "elementation_reply",
    {
      title: "Reply to annotation",
      description: "Post a threaded message on an annotation, e.g. to ask for clarification.",
      inputSchema: {
        annotationId: z.string().describe("Annotation id"),
        message: z.string().min(1).describe("Message body"),
      },
    },
    ({ annotationId, message }) => replyTool(client, annotationId, message),
  );

  server.registerTool(
    "elementation_watch_annotations",
    {
      title: "Watch for annotations",
      description:
        "Block until pending annotations are available, then return them. Loop this for hands-free processing.",
      inputSchema: {
        sessionId: z.string().optional().describe("Only watch this session"),
        batchWindowSeconds: z
          .number()
          .int()
          .positive()
          .max(60)
          .optional()
          .describe("Wait this long after the first item to collect a batch (default 3)"),
        timeoutSeconds: z
          .number()
          .int()
          .positive()
          .max(1800)
          .optional()
          .describe("Give up after this long (default 300)"),
      },
    },
    ({ sessionId, batchWindowSeconds, timeoutSeconds }) =>
      watchAnnotationsTool(client, { sessionId, batchWindowSeconds, timeoutSeconds }),
  );
}
