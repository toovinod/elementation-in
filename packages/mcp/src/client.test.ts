import { describe, expect, it, vi } from "vitest";
import { ElementationApiError, HttpElementationClient } from "./client";
import { makeSession, makeSyncedAnnotation } from "./test-fixtures";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function mockFetch(response: () => Response) {
  return vi.fn((_input: RequestInfo | URL, _init?: RequestInit): Promise<Response> =>
    Promise.resolve(response()),
  );
}

describe("HttpElementationClient", () => {
  it("targets /api/v1 under the base url and parses the response", async () => {
    const fetchMock = mockFetch(() => jsonResponse([makeSession()]));
    const client = new HttpElementationClient({
      baseUrl: "http://localhost:3000/",
      fetch: fetchMock,
    });

    const sessions = await client.listSessions();

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(fetchMock.mock.calls[0]?.[0]).toBe("http://localhost:3000/api/v1/sessions");
    expect(sessions).toHaveLength(1);
    expect(sessions[0]?.id).toBe("sess_1");
  });

  it("adds a bearer token when configured", async () => {
    const fetchMock = mockFetch(() => jsonResponse({ ok: true, service: "x", timestamp: "t" }));
    const client = new HttpElementationClient({ token: "secret", fetch: fetchMock });

    await client.getHealth();

    const headers = fetchMock.mock.calls[0]?.[1]?.headers as Record<string, string>;
    expect(headers.authorization).toBe("Bearer secret");
  });

  it("returns null on 404 for a missing session", async () => {
    const fetchMock = mockFetch(() => jsonResponse({ error: "Session not found" }, 404));
    const client = new HttpElementationClient({ fetch: fetchMock });

    await expect(client.getSession("nope")).resolves.toBeNull();
  });

  it("throws ElementationApiError on non-404 failures", async () => {
    const fetchMock = mockFetch(() => jsonResponse({ error: "boom" }, 500));
    const client = new HttpElementationClient({ fetch: fetchMock });

    await expect(client.listSessions()).rejects.toBeInstanceOf(ElementationApiError);
  });

  it("resolve sends a PATCH with status and summary", async () => {
    const fetchMock = mockFetch(() => jsonResponse(makeSyncedAnnotation({ status: "resolved" })));
    const client = new HttpElementationClient({ fetch: fetchMock });

    const annotation = await client.resolve("ann_1", "shrunk it");

    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe("http://localhost:3000/api/v1/annotations/ann_1");
    expect(call?.[1]?.method).toBe("PATCH");
    expect(JSON.parse(call?.[1]?.body as string)).toEqual({
      status: "resolved",
      summary: "shrunk it",
    });
    expect(annotation?.status).toBe("resolved");
  });

  it("reply posts an agent thread message", async () => {
    const fetchMock = mockFetch(() =>
      jsonResponse(
        {
          id: "tm_1",
          annotationId: "ann_1",
          role: "agent",
          message: "Which shade of blue?",
          createdAt: "2026-07-03T00:00:00.000Z",
        },
        201,
      ),
    );
    const client = new HttpElementationClient({ fetch: fetchMock });

    const message = await client.reply("ann_1", "Which shade of blue?");

    const call = fetchMock.mock.calls[0];
    expect(call?.[0]).toBe("http://localhost:3000/api/v1/annotations/ann_1/thread");
    expect(call?.[1]?.method).toBe("POST");
    expect(JSON.parse(call?.[1]?.body as string)).toEqual({
      role: "agent",
      message: "Which shade of blue?",
    });
    expect(message?.role).toBe("agent");
  });
});
