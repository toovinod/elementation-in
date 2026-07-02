import type { ElementationEvent, WebhookEndpoint } from "@elementation/core";
import { createWebhookHeaders } from "./signing";

export interface ElementationWebhookPayload {
  id: string;
  event: ElementationEvent["type"];
  timestamp: string;
  sequence: number;
  sessionId?: string;
  projectKey?: string;
  data: ElementationEvent["payload"];
}

export interface WebhookDeliveryResult {
  ok: boolean;
  status?: number;
  responseBody?: string;
  error?: string;
}

export type FetchLike = typeof fetch;

export function createWebhookPayload(event: ElementationEvent): ElementationWebhookPayload {
  return {
    id: event.id,
    event: event.type,
    timestamp: event.createdAt,
    sequence: event.sequence,
    sessionId: event.sessionId,
    projectKey: event.projectKey,
    data: event.payload,
  };
}

export async function deliverWebhook(
  endpoint: Pick<WebhookEndpoint, "url" | "secret">,
  event: ElementationEvent,
  fetchImpl: FetchLike = fetch,
): Promise<WebhookDeliveryResult> {
  const body = JSON.stringify(createWebhookPayload(event));
  const timestamp = Date.now();
  try {
    const response = await fetchImpl(endpoint.url, {
      method: "POST",
      headers: createWebhookHeaders({
        payload: body,
        secret: endpoint.secret,
        timestamp,
        eventId: event.id,
        eventType: event.type,
      }),
      body,
    });
    const responseBody = await response.text().catch(() => undefined);
    return {
      ok: response.ok,
      status: response.status,
      responseBody: responseBody?.slice(0, 4096),
      error: response.ok ? undefined : `Webhook returned HTTP ${response.status}`,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Unknown webhook delivery error",
    };
  }
}
