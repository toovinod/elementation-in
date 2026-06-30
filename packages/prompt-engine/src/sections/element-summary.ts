import type { ElementationCapture } from "@elementation/core";
import { truncate } from "../format";

export function elementSummarySection(capture: ElementationCapture): string {
  const { element, page, viewport } = capture;
  const lines = [
    "## Selected Element",
    "",
    `- Tag: ${element.tagName}`,
    `- Text: ${truncate(element.textContent) || "(no visible text)"}`,
    `- Selector: ${element.selector}`,
  ];

  if (element.id) lines.push(`- ID: #${element.id}`);
  if (element.className) lines.push(`- Classes: ${element.className}`);
  if (element.role) lines.push(`- Role: ${element.role}`);
  if (element.ariaLabel) lines.push(`- ARIA label: ${element.ariaLabel}`);

  lines.push(`- Page: ${page.url}`);
  lines.push(`- Viewport: ${viewport.width}x${viewport.height}`);

  return lines.join("\n");
}
