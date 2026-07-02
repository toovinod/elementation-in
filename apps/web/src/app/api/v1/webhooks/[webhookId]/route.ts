import { NextResponse } from "next/server";
import { z } from "zod";
import { eventTypeSchema, type WebhookEndpoint } from "@elementation/core";
import { updateWebhookEndpoint } from "@/server/webhooks-repo";

const updateWebhookSchema = z.object({
  projectKey: z.string().optional(),
  url: z.string().url().optional(),
  secret: z.string().min(16).optional(),
  events: eventTypeSchema.array().min(1).optional(),
  enabled: z.boolean().optional(),
});

function redact(endpoint: WebhookEndpoint): WebhookEndpoint {
  return { ...endpoint, secret: "redacted" };
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ webhookId: string }> },
) {
  const { webhookId } = await params;
  const body: unknown = await request.json().catch(() => null);
  const parsed = updateWebhookSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid webhook update" }, { status: 400 });
  }

  const endpoint = await updateWebhookEndpoint(webhookId, parsed.data);
  if (!endpoint) return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  return NextResponse.json(redact(endpoint));
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ webhookId: string }> },
) {
  const { webhookId } = await params;
  const endpoint = await updateWebhookEndpoint(webhookId, { enabled: false });
  if (!endpoint) return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  return new NextResponse(null, { status: 204 });
}
