import { NextResponse } from "next/server";
import { z } from "zod";
import { createId, eventTypeSchema, type WebhookEndpoint } from "@elementation/core";
import { createWebhookEndpoint, listWebhookEndpoints } from "@/server/webhooks-repo";

const createWebhookSchema = z.object({
  projectKey: z.string().optional(),
  url: z.string().url(),
  secret: z.string().min(16).optional(),
  events: eventTypeSchema.array().min(1),
  enabled: z.boolean().optional(),
});

function redact(endpoint: WebhookEndpoint): WebhookEndpoint {
  return { ...endpoint, secret: "redacted" };
}

export async function GET(request: Request) {
  const projectKey = new URL(request.url).searchParams.get("projectKey") ?? undefined;
  const endpoints = await listWebhookEndpoints(projectKey);
  return NextResponse.json(endpoints.map(redact));
}

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  const parsed = createWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid webhook endpoint" }, { status: 400 });
  }

  const endpoint = await createWebhookEndpoint({
    ...parsed.data,
    secret: parsed.data.secret ?? `whsec_${createId()}_${createId()}`,
  });
  return NextResponse.json(endpoint, { status: 201 });
}
