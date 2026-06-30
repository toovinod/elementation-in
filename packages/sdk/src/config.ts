import { createCaptureStore, type CaptureStore } from "@elementation/core";
import type { PromptTarget } from "@elementation/prompt-engine";

export interface ElementationOverlayProps {
  projectKey?: string;
  apiUrl?: string;
  target?: PromptTarget;
}

export interface ResolvedConfig {
  projectKey: string | undefined;
  target: PromptTarget;
  store: CaptureStore;
}

export function resolveConfig(props: ElementationOverlayProps): ResolvedConfig {
  return {
    projectKey: props.projectKey,
    target: props.target ?? "generic",
    store: createCaptureStore({ apiUrl: props.apiUrl }),
  };
}
