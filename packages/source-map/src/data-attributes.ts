import { DATA_ATTRIBUTES } from "@elementation/core";

export { DATA_ATTRIBUTES } from "@elementation/core";

export function hasSourceAttributes(element: Element): boolean {
  return (
    element.hasAttribute(DATA_ATTRIBUTES.component) || element.hasAttribute(DATA_ATTRIBUTES.file)
  );
}

export function parseAttrNumber(value: string | null): number | undefined {
  if (value == null) return undefined;
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? undefined : parsed;
}
