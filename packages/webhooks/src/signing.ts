import { createHmac, timingSafeEqual } from "node:crypto";

const SIGNATURE_PREFIX = "v1";

export interface SignatureInput {
  payload: string;
  secret: string;
  timestamp: number;
}

export function createWebhookSignature(input: SignatureInput): string {
  const signedPayload = `${input.timestamp}.${input.payload}`;
  const digest = createHmac("sha256", input.secret).update(signedPayload).digest("hex");
  return `${SIGNATURE_PREFIX}=${digest}`;
}

export function verifyWebhookSignature(input: SignatureInput & { signature: string }): boolean {
  const expected = createWebhookSignature(input);
  const provided = input.signature.trim();
  const expectedBuffer = Buffer.from(expected);
  const providedBuffer = Buffer.from(provided);
  if (expectedBuffer.length !== providedBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, providedBuffer);
}

export function createWebhookHeaders(
  input: SignatureInput & { eventId: string; eventType: string },
) {
  return {
    "content-type": "application/json",
    "user-agent": "Elementation-Webhooks/1.0",
    "x-elementation-event-id": input.eventId,
    "x-elementation-event-type": input.eventType,
    "x-elementation-signature": createWebhookSignature(input),
    "x-elementation-timestamp": String(input.timestamp),
  };
}
