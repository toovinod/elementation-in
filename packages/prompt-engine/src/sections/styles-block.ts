import type { ElementationCapture } from "@elementation/core";

export function stylesSection(capture: ElementationCapture): string {
  const s = capture.styles;
  return [
    "## Current Visual Styles",
    "",
    `- Display: ${s.display}`,
    `- Width: ${s.width}`,
    `- Height: ${s.height}`,
    `- Margin: ${s.margin}`,
    `- Padding: ${s.padding}`,
    `- Font size: ${s.fontSize}`,
    `- Font weight: ${s.fontWeight}`,
    `- Background: ${s.backgroundColor}`,
    `- Text color: ${s.color}`,
    `- Border: ${s.border}`,
    `- Border radius: ${s.borderRadius}`,
    `- Box shadow: ${s.boxShadow}`,
  ].join("\n");
}
