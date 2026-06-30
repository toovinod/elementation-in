export const SCHEMA_VERSION = 1;

export const STORAGE_KEYS = {
  projects: "elementation:projects",
  annotations: "elementation:annotations",
} as const;

/** Attributes the source-map package reads to resolve a component's origin. */
export const DATA_ATTRIBUTES = {
  component: "data-elementation-component",
  file: "data-elementation-file",
  line: "data-elementation-line",
  column: "data-elementation-column",
} as const;

/** Marks the overlay's own DOM so it can never inspect or select itself. */
export const UI_ATTRIBUTE = "data-elementation-ui";
