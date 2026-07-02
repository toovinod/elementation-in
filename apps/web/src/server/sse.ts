import type { ElementationEvent } from "@elementation/core";
import { listEvents } from "./events-repo";

const encoder = new TextEncoder();

function encodeEvent(event: ElementationEvent): Uint8Array {
  return encoder.encode(
    `id: ${event.sequence}\nevent: ${event.type}\ndata: ${JSON.stringify(event)}\n\n`,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => globalThis.setTimeout(resolve, ms));
}

function sequenceFromRequest(request: Request): number | undefined {
  const url = new URL(request.url);
  const after = url.searchParams.get("after") ?? request.headers.get("last-event-id");
  if (!after) return undefined;
  const sequence = Number(after);
  return Number.isFinite(sequence) && sequence >= 0 ? sequence : undefined;
}

export function createEventStream(
  request: Request,
  options: { sessionId?: string; projectKey?: string } = {},
): Response {
  let closed = false;
  let lastSequence = sequenceFromRequest(request) ?? 0;

  request.signal.addEventListener("abort", () => {
    closed = true;
  });

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode(": elementation event stream\n\n"));

      const pump = async () => {
        while (!closed) {
          const events = await listEvents({
            ...options,
            afterSequence: lastSequence,
            limit: 100,
          });
          for (const event of events) {
            lastSequence = event.sequence;
            controller.enqueue(encodeEvent(event));
          }
          await sleep(events.length > 0 ? 100 : 1000);
        }
        controller.close();
      };

      void pump().catch((error) => {
        controller.error(error);
      });
    },
    cancel() {
      closed = true;
    },
  });

  return new Response(stream, {
    headers: {
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "content-type": "text/event-stream; charset=utf-8",
      "x-accel-buffering": "no",
    },
  });
}
