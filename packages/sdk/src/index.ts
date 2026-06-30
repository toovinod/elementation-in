"use client";

export { ElementationOverlay } from "./overlay/ElementationOverlay";
export type { ElementationOverlayProps } from "./config";

export {
  captureElement,
  getCssSelector,
  getComputedStyleSnapshot,
  getElementText,
} from "./capture";
export { getElementSourceMetadata } from "@elementation/source-map";
export { generateElementationPrompt, type PromptTarget } from "@elementation/prompt-engine";

export type {
  CaptureStyles,
  ElementationAnnotation,
  ElementationCapture,
  ElementationProject,
  SourceMetadata,
} from "@elementation/core";
