import { z } from "zod";
import {
  sessionSchema,
  syncedAnnotationSchema,
  threadMessageSchema,
  type ElementationSession,
  type SyncedElementationAnnotation,
  type ThreadMessage,
} from "@elementation/core";

export type FetchLike = typeof fetch;

export const DEFAULT_BASE_URL = "http://localhost:3000";

export interface ElementationClientOptions {
  /** Origin of the Elementation dashboard, e.g. `http://localhost:3000`. */
  baseUrl?: string;
  /** Optional bearer token, forwarded as `Authorization: Bearer <token>`. */
  token?: string;
  /** Override the fetch implementation (tests, custom agents). */
  fetch?: FetchLike;
}

export interface ElementationStatus {
  ok: boolean;
  service: string;
  storage: string;
  counts: {
    sessions: number;
    annotations: number;
    pending: number;
    webhooks: number;
  };
  timestamp: string;
}

export interface ElementationHealth {
  ok: boolean;
  service: string;
  timestamp: string;
}

/**
 * Read/write access to a running Elementation backend. The MCP tools are written
 * against this interface, so an embedded (direct-database) client can be provided
 * later without touching tool code.
 */
export interface ElementationClient {
  listSessions(): Promise<ElementationSession[]>;
  getSession(sessionId: string): Promise<ElementationSession | null>;
  getSessionAnnotations(sessionId: string): Promise<SyncedElementationAnnotation[]>;
  getPending(sessionId: string): Promise<SyncedElementationAnnotation[]>;
  getAllPending(): Promise<SyncedElementationAnnotation[]>;
  getAnnotation(annotationId: string): Promise<SyncedElementationAnnotation | null>;
  acknowledge(annotationId: string): Promise<SyncedElementationAnnotation | null>;
  resolve(annotationId: string, summary?: string): Promise<SyncedElementationAnnotation | null>;
  dismiss(annotationId: string, reason: string): Promise<SyncedElementationAnnotation | null>;
  reply(annotationId: string, message: string): Promise<ThreadMessage | null>;
  getStatus(): Promise<ElementationStatus>;
  getHealth(): Promise<ElementationHealth>;
}

const sessionsSchema = z.array(sessionSchema);
const annotationsSchema = z.array(syncedAnnotationSchema);

const statusSchema = z.object({
  ok: z.boolean(),
  service: z.string(),
  storage: z.string(),
  counts: z.object({
    sessions: z.number(),
    annotations: z.number(),
    pending: z.number(),
    webhooks: z.number(),
  }),
  timestamp: z.string(),
});

const healthSchema = z.object({
  ok: z.boolean(),
  service: z.string(),
  timestamp: z.string(),
});

export class ElementationApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
    readonly body: string,
  ) {
    super(message);
    this.name = "ElementationApiError";
  }
}

/** HTTP implementation of {@link ElementationClient} that talks to `/api/v1`. */
export class HttpElementationClient implements ElementationClient {
  private readonly baseUrl: string;
  private readonly token?: string;
  private readonly fetchImpl: FetchLike;

  constructor(options: ElementationClientOptions = {}) {
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.token = options.token;
    this.fetchImpl = options.fetch ?? fetch;
  }

  private endpoint(path: string): string {
    return `${this.baseUrl}/api/v1${path}`;
  }

  private async request<S extends z.ZodTypeAny>(
    path: string,
    schema: S,
    init?: RequestInit,
  ): Promise<z.infer<S>> {
    const response = await this.fetchImpl(this.endpoint(path), {
      ...init,
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(this.token ? { authorization: `Bearer ${this.token}` } : {}),
        ...(init?.headers as Record<string, string> | undefined),
      },
    });
    if (!response.ok) {
      const body = await response.text().catch(() => "");
      throw new ElementationApiError(
        `Elementation API ${response.status} for ${path}`,
        response.status,
        body,
      );
    }
    const data: unknown = await response.json();
    return schema.parse(data);
  }

  private async requestOrNull<S extends z.ZodTypeAny>(
    path: string,
    schema: S,
    init?: RequestInit,
  ): Promise<z.infer<S> | null> {
    try {
      return await this.request(path, schema, init);
    } catch (error) {
      if (error instanceof ElementationApiError && error.status === 404) return null;
      throw error;
    }
  }

  private patchAnnotation(
    annotationId: string,
    body: Record<string, unknown>,
  ): Promise<SyncedElementationAnnotation | null> {
    return this.requestOrNull(
      `/annotations/${encodeURIComponent(annotationId)}`,
      syncedAnnotationSchema,
      { method: "PATCH", body: JSON.stringify(body) },
    );
  }

  listSessions(): Promise<ElementationSession[]> {
    return this.request("/sessions", sessionsSchema);
  }

  getSession(sessionId: string): Promise<ElementationSession | null> {
    return this.requestOrNull(`/sessions/${encodeURIComponent(sessionId)}`, sessionSchema);
  }

  getSessionAnnotations(sessionId: string): Promise<SyncedElementationAnnotation[]> {
    return this.request(
      `/sessions/${encodeURIComponent(sessionId)}/annotations`,
      annotationsSchema,
    );
  }

  getPending(sessionId: string): Promise<SyncedElementationAnnotation[]> {
    return this.request(`/sessions/${encodeURIComponent(sessionId)}/pending`, annotationsSchema);
  }

  getAllPending(): Promise<SyncedElementationAnnotation[]> {
    return this.request("/pending", annotationsSchema);
  }

  getAnnotation(annotationId: string): Promise<SyncedElementationAnnotation | null> {
    return this.requestOrNull(
      `/annotations/${encodeURIComponent(annotationId)}`,
      syncedAnnotationSchema,
    );
  }

  acknowledge(annotationId: string): Promise<SyncedElementationAnnotation | null> {
    return this.patchAnnotation(annotationId, { status: "acknowledged" });
  }

  resolve(annotationId: string, summary?: string): Promise<SyncedElementationAnnotation | null> {
    return this.patchAnnotation(annotationId, { status: "resolved", summary });
  }

  dismiss(annotationId: string, reason: string): Promise<SyncedElementationAnnotation | null> {
    return this.patchAnnotation(annotationId, { status: "dismissed", reason });
  }

  reply(annotationId: string, message: string): Promise<ThreadMessage | null> {
    return this.requestOrNull(
      `/annotations/${encodeURIComponent(annotationId)}/thread`,
      threadMessageSchema,
      { method: "POST", body: JSON.stringify({ role: "agent", message }) },
    );
  }

  getStatus(): Promise<ElementationStatus> {
    return this.request("/status", statusSchema);
  }

  getHealth(): Promise<ElementationHealth> {
    return this.request("/health", healthSchema);
  }
}
