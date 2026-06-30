import type { ElementationCapture } from "@elementation/core";

export function sourceSection(capture: ElementationCapture): string | null {
  const source = capture.source;
  if (
    !source ||
    (!source.componentName &&
      !source.filePath &&
      source.lineNumber === undefined &&
      source.columnNumber === undefined)
  ) {
    return null;
  }

  const lines = ["## Source Location", ""];
  if (source.componentName) lines.push(`- Component: ${source.componentName}`);
  if (source.filePath) lines.push(`- File: ${source.filePath}`);
  if (source.lineNumber !== undefined) lines.push(`- Line: ${source.lineNumber}`);
  if (source.columnNumber !== undefined) lines.push(`- Column: ${source.columnNumber}`);

  return lines.join("\n");
}
