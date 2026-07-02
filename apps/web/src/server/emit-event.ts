import type { CreateEventInput, ElementationEvent } from "@elementation/core";
import { createEvent } from "./events-repo";
import { dispatchWebhooks } from "./webhooks-repo";

export async function emitEvent(input: CreateEventInput): Promise<ElementationEvent> {
  const event = await createEvent(input);
  await dispatchWebhooks(event);
  return event;
}
