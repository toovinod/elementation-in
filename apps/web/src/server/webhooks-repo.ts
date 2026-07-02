import {
  createId,
  eventTypeSchema,
  webhookEndpointSchema,
  type ElementationEvent,
  type WebhookEndpoint,
  type WebhookEndpointInput,
} from "@elementation/core";
import { deliverWebhook, type WebhookDeliveryResult } from "@elementation/webhooks";
import { prisma } from "@/lib/db";
import { getEvent } from "./events-repo";
import type { Prisma } from "@/generated/prisma/client";

const MAX_WEBHOOK_ATTEMPTS = 8;

function nextAttemptDelay(attempts: number): number {
  return Math.min(60_000 * attempts, 15 * 60_000);
}

async function recordDeliveryResult(
  deliveryId: string,
  attempts: number,
  result: WebhookDeliveryResult,
): Promise<void> {
  const giveUp = !result.ok && attempts >= MAX_WEBHOOK_ATTEMPTS;
  await prisma.webhookDelivery.update({
    where: { id: deliveryId },
    data: {
      attempts,
      status: result.ok ? "delivered" : "failed",
      responseStatus: result.status,
      responseBody: result.responseBody,
      error: result.error,
      nextAttemptAt: result.ok || giveUp ? null : new Date(Date.now() + nextAttemptDelay(attempts)),
    },
  });
}

interface WebhookEndpointRow {
  id: string;
  projectKey: string | null;
  url: string;
  secret: string;
  events: Prisma.JsonValue;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

function toWebhookEndpoint(row: WebhookEndpointRow): WebhookEndpoint {
  return webhookEndpointSchema.parse({
    id: row.id,
    projectKey: row.projectKey ?? undefined,
    url: row.url,
    secret: row.secret,
    events: eventTypeSchema.array().parse(row.events),
    enabled: row.enabled,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function listWebhookEndpoints(projectKey?: string): Promise<WebhookEndpoint[]> {
  const rows = await prisma.webhookEndpoint.findMany({
    where: {
      enabled: true,
      ...(projectKey ? { OR: [{ projectKey }, { projectKey: null }] } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toWebhookEndpoint);
}

export async function createWebhookEndpoint(input: WebhookEndpointInput): Promise<WebhookEndpoint> {
  const row = await prisma.webhookEndpoint.create({
    data: {
      id: input.id ?? createId(),
      projectKey: input.projectKey,
      url: input.url,
      secret: input.secret,
      events: input.events,
      enabled: input.enabled ?? true,
    },
  });
  return toWebhookEndpoint(row);
}

export async function updateWebhookEndpoint(
  id: string,
  input: Partial<Omit<WebhookEndpointInput, "id">>,
): Promise<WebhookEndpoint | null> {
  const row = await prisma.webhookEndpoint
    .update({
      where: { id },
      data: {
        ...(input.projectKey !== undefined ? { projectKey: input.projectKey } : {}),
        ...(input.url !== undefined ? { url: input.url } : {}),
        ...(input.secret !== undefined ? { secret: input.secret } : {}),
        ...(input.events !== undefined ? { events: input.events } : {}),
        ...(input.enabled !== undefined ? { enabled: input.enabled } : {}),
      },
    })
    .catch(() => null);
  return row ? toWebhookEndpoint(row) : null;
}

export async function dispatchWebhooks(event: ElementationEvent): Promise<void> {
  const endpoints = await listWebhookEndpoints(event.projectKey);
  const matching = endpoints.filter((endpoint) => endpoint.events.includes(event.type));

  await Promise.all(
    matching.map(async (endpoint) => {
      const existing = await prisma.webhookDelivery.findUnique({
        where: { webhookId_eventId: { webhookId: endpoint.id, eventId: event.id } },
      });
      const attempts = (existing?.attempts ?? 0) + 1;
      const delivery =
        existing ??
        (await prisma.webhookDelivery.create({
          data: {
            webhookId: endpoint.id,
            eventId: event.id,
            attempts: 0,
            status: "pending",
          },
        }));

      const result = await deliverWebhook(endpoint, event);
      await recordDeliveryResult(delivery.id, attempts, result);
    }),
  );
}

export interface RetryDrainResult {
  retried: number;
  delivered: number;
  failed: number;
}

/**
 * Redelivers failed webhook deliveries that are due for another attempt. Intended to be
 * called on a schedule (cron) or manually via `POST /api/v1/webhooks/deliveries/retry`.
 */
export async function retryPendingDeliveries(limit = 50): Promise<RetryDrainResult> {
  const due = await prisma.webhookDelivery.findMany({
    where: {
      status: "failed",
      attempts: { lt: MAX_WEBHOOK_ATTEMPTS },
      nextAttemptAt: { lte: new Date() },
    },
    orderBy: { nextAttemptAt: "asc" },
    take: limit,
  });

  let delivered = 0;
  let failed = 0;

  for (const delivery of due) {
    const [endpoint, event] = await Promise.all([
      prisma.webhookEndpoint.findUnique({ where: { id: delivery.webhookId } }),
      getEvent(delivery.eventId),
    ]);

    if (!endpoint || !endpoint.enabled || !event) {
      await prisma.webhookDelivery.update({
        where: { id: delivery.id },
        data: { status: "failed", nextAttemptAt: null, error: "Endpoint or event unavailable" },
      });
      failed += 1;
      continue;
    }

    const result = await deliverWebhook(endpoint, event);
    await recordDeliveryResult(delivery.id, delivery.attempts + 1, result);
    if (result.ok) delivered += 1;
    else failed += 1;
  }

  return { retried: due.length, delivered, failed };
}
