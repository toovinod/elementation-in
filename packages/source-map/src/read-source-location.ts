import type { SourceMetadata } from "@elementation/core";
import { DATA_ATTRIBUTES, hasSourceAttributes, parseAttrNumber } from "./data-attributes";
import { resolveReactComponentName } from "./resolve-react-name";

function findAnnotatedAncestor(element: Element): Element | null {
  let current: Element | null = element;
  while (current) {
    if (hasSourceAttributes(current)) return current;
    current = current.parentElement;
  }
  return null;
}

export function getElementSourceMetadata(element: Element): SourceMetadata | undefined {
  const annotated = findAnnotatedAncestor(element);

  const componentName =
    annotated?.getAttribute(DATA_ATTRIBUTES.component) ??
    resolveReactComponentName(element) ??
    undefined;
  const filePath = annotated?.getAttribute(DATA_ATTRIBUTES.file) ?? undefined;
  const lineNumber = parseAttrNumber(annotated?.getAttribute(DATA_ATTRIBUTES.line) ?? null);
  const columnNumber = parseAttrNumber(annotated?.getAttribute(DATA_ATTRIBUTES.column) ?? null);

  if (!componentName && !filePath && lineNumber === undefined && columnNumber === undefined) {
    return undefined;
  }

  return { componentName, filePath, lineNumber, columnNumber };
}
