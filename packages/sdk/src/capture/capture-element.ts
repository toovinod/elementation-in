import { createId, type ElementationCapture } from "@elementation/core";
import { getElementSourceMetadata } from "@elementation/source-map";
import { getCssSelector } from "./compute-selector";
import { getComputedStyleSnapshot, getElementText } from "./computed-styles";

function getDataset(element: HTMLElement): Record<string, string> {
  const result: Record<string, string> = {};
  for (const key in element.dataset) {
    if (key.startsWith("elementation")) continue;
    const value = element.dataset[key];
    if (value !== undefined) result[key] = value;
  }
  return result;
}

export function captureElement(
  element: HTMLElement,
  feedback = "",
  projectKey?: string,
): ElementationCapture {
  const rect = element.getBoundingClientRect();
  const className =
    typeof element.className === "string" && element.className.trim().length > 0
      ? element.className
      : undefined;

  return {
    id: createId(),
    projectKey,
    createdAt: new Date().toISOString(),
    feedback,
    page: {
      url: window.location.href,
      pathname: window.location.pathname,
      title: document.title,
    },
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    element: {
      tagName: element.tagName.toLowerCase(),
      textContent: getElementText(element),
      selector: getCssSelector(element),
      id: element.id || undefined,
      className,
      role: element.getAttribute("role") ?? undefined,
      ariaLabel: element.getAttribute("aria-label") ?? undefined,
      dataset: getDataset(element),
    },
    box: {
      x: rect.x,
      y: rect.y,
      width: rect.width,
      height: rect.height,
      top: rect.top,
      left: rect.left,
      right: rect.right,
      bottom: rect.bottom,
    },
    styles: getComputedStyleSnapshot(element),
    source: getElementSourceMetadata(element),
  };
}
