import { HttpAdapter } from "./http-adapter";
import { LocalStorageAdapter } from "./local-storage-adapter";
import type { CaptureStore, CaptureStoreConfig } from "./types";

export function createCaptureStore(config: CaptureStoreConfig = {}): CaptureStore {
  return config.apiUrl ? new HttpAdapter(config.apiUrl) : new LocalStorageAdapter();
}
