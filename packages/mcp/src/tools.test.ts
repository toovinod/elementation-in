import { describe, expect, it, vi } from "vitest";
import { ElementationApiError, type ElementationClient } from "./client";
import {
  acknowledgeTool,
  dismissTool,
  getAllPendingTool,
  getSessionTool,
  listSessionsTool,
  replyTool,
  resolveTool,
} from "./tools";
import { makeSession, makeSyncedAnnotation } from "./test-fixtures";

function fakeClient(overrides: Partial<ElementationClient> = {}): ElementationClient {
  return {
    listSessions: vi.fn(async () => []),
    getSession: vi.fn(async () => null),
    getSessionAnnotations: vi.fn(async () => []),
    getPending: vi.fn(async () => []),
    getAllPending: vi.fn(async () => []),
    getAnnotation: vi.fn(async () => null),
    acknowledge: vi.fn(async () => null),
    resolve: vi.fn(async () => null),
    dismiss: vi.fn(async () => null),
    reply: vi.fn(async () => null),
    getStatus: vi.fn(),
    getHealth: vi.fn(),
    ...overrides,
  } as ElementationClient;
}

describe("tools", () => {
  it("list_sessions returns a count and the sessions", async () => {
    const result = await listSessionsTool(
      fakeClient({ listSessions: vi.fn(async () => [makeSession()]) }),
    );
    expect(result.isError).toBeUndefined();
    expect(result.structuredContent?.count).toBe(1);
    expect(result.content[0]?.text).toContain("sess_1");
  });

  it("get_session errors cleanly when the session is missing", async () => {
    const result = await getSessionTool(fakeClient(), "missing");
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("not found");
  });

  it("get_session includes its annotations", async () => {
    const client = fakeClient({
      getSession: vi.fn(async () => makeSession()),
      getSessionAnnotations: vi.fn(async () => [makeSyncedAnnotation()]),
    });
    const result = await getSessionTool(client, "sess_1");
    expect(result.structuredContent?.count).toBe(1);
    expect(result.content[0]?.text).toContain("Annotations (1)");
  });

  it("acknowledge reports not found without throwing", async () => {
    const result = await acknowledgeTool(fakeClient(), "ann_x");
    expect(result.isError).toBe(true);
  });

  it("resolve passes the summary through", async () => {
    const resolve = vi.fn(async () => makeSyncedAnnotation({ status: "resolved" }));
    const result = await resolveTool(fakeClient({ resolve }), "ann_1", "shrunk it");
    expect(resolve).toHaveBeenCalledWith("ann_1", "shrunk it");
    expect(result.content[0]?.text).toContain("Resolved ann_1");
  });

  it("dismiss echoes the reason", async () => {
    const dismiss = vi.fn(async () => makeSyncedAnnotation({ status: "dismissed" }));
    const result = await dismissTool(fakeClient({ dismiss }), "ann_1", "out of scope");
    expect(result.content[0]?.text).toContain("out of scope");
  });

  it("reply surfaces the created message", async () => {
    const reply = vi.fn(async () => ({
      id: "tm_1",
      annotationId: "ann_1",
      role: "agent" as const,
      message: "clarify?",
      createdAt: "2026-07-03T00:00:00.000Z",
    }));
    const result = await replyTool(fakeClient({ reply }), "ann_1", "clarify?");
    expect(result.content[0]?.text).toContain("Replied to ann_1");
  });

  it("wraps API errors as tool errors instead of throwing", async () => {
    const client = fakeClient({
      getAllPending: vi.fn(async () => {
        throw new ElementationApiError("nope", 500, "server exploded");
      }),
    });
    const result = await getAllPendingTool(client);
    expect(result.isError).toBe(true);
    expect(result.content[0]?.text).toContain("500");
  });
});
