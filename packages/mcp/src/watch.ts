import type { SyncedElementationAnnotation } from "@elementation/core";
import type { ElementationClient } from "./client";

export interface WatchOptions {
  /** Limit to one session; otherwise watches pending across every session. */
  sessionId?: string;
  /** After the first pending annotation appears, wait this long to let a batch settle. */
  batchWindowSeconds?: number;
  /** Give up and return an empty batch after this long. */
  timeoutSeconds?: number;
  /** Poll cadence while waiting. */
  pollIntervalMs?: number;
  /** Injected sleep for tests. */
  sleep?: (ms: number) => Promise<void>;
  /** Injected clock for tests. */
  now?: () => number;
}

export interface WatchResult {
  annotations: SyncedElementationAnnotation[];
  timedOut: boolean;
}

const DEFAULT_BATCH_WINDOW_SECONDS = 3;
const DEFAULT_TIMEOUT_SECONDS = 300;
const DEFAULT_POLL_INTERVAL_MS = 1500;

function defaultSleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Blocks until pending annotations are available (or the timeout elapses), so an agent
 * can loop: watch → acknowledge → fix → resolve → watch again. Already-pending items are
 * returned immediately; resolving/acknowledging them removes them so the next call waits.
 */
export async function watchAnnotations(
  client: ElementationClient,
  options: WatchOptions = {},
): Promise<WatchResult> {
  const batchWindowMs = (options.batchWindowSeconds ?? DEFAULT_BATCH_WINDOW_SECONDS) * 1000;
  const timeoutMs = (options.timeoutSeconds ?? DEFAULT_TIMEOUT_SECONDS) * 1000;
  const pollMs = options.pollIntervalMs ?? DEFAULT_POLL_INTERVAL_MS;
  const sleep = options.sleep ?? defaultSleep;
  const now = options.now ?? Date.now;

  const fetchPending = (): Promise<SyncedElementationAnnotation[]> =>
    options.sessionId ? client.getPending(options.sessionId) : client.getAllPending();

  const start = now();
  do {
    const pending = await fetchPending();
    if (pending.length > 0) {
      if (batchWindowMs > 0) {
        await sleep(batchWindowMs);
        const settled = await fetchPending();
        return {
          annotations: settled.length >= pending.length ? settled : pending,
          timedOut: false,
        };
      }
      return { annotations: pending, timedOut: false };
    }
    if (now() - start >= timeoutMs) break;
    await sleep(pollMs);
  } while (now() - start < timeoutMs);

  return { annotations: [], timedOut: true };
}
