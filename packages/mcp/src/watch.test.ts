import { describe, expect, it, vi } from "vitest";
import type { ElementationClient } from "./client";
import { watchAnnotations } from "./watch";
import { makeSyncedAnnotation } from "./test-fixtures";

function clientWith(
  pendingByCall: Array<ReturnType<typeof makeSyncedAnnotation>[]>,
): ElementationClient {
  const getAllPending = vi.fn();
  for (const batch of pendingByCall) getAllPending.mockResolvedValueOnce(batch);
  getAllPending.mockResolvedValue(pendingByCall[pendingByCall.length - 1] ?? []);
  return { getAllPending } as unknown as ElementationClient;
}

describe("watchAnnotations", () => {
  it("returns immediately when pending items already exist (no batch window)", async () => {
    const client = clientWith([[makeSyncedAnnotation()]]);
    const result = await watchAnnotations(client, { batchWindowSeconds: 0, sleep: async () => {} });
    expect(result.timedOut).toBe(false);
    expect(result.annotations).toHaveLength(1);
  });

  it("polls until pending appears", async () => {
    const client = clientWith([[], [], [makeSyncedAnnotation()]]);
    const sleep = vi.fn(async () => {});
    const result = await watchAnnotations(client, {
      batchWindowSeconds: 0,
      pollIntervalMs: 10,
      sleep,
    });
    expect(result.annotations).toHaveLength(1);
    expect(sleep).toHaveBeenCalledTimes(2);
  });

  it("times out with an empty batch when nothing arrives", async () => {
    const client = clientWith([[]]);
    let clock = 0;
    const result = await watchAnnotations(client, {
      batchWindowSeconds: 0,
      timeoutSeconds: 1,
      pollIntervalMs: 400,
      sleep: async () => {},
      now: () => (clock += 500),
    });
    expect(result.timedOut).toBe(true);
    expect(result.annotations).toHaveLength(0);
  });
});
