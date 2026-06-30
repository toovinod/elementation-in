import type { ElementationCapture } from "@elementation/core";

export function taskSection(capture: ElementationCapture): string {
  return `## Task\n\nUpdate the selected ${capture.element.tagName} according to the user feedback.`;
}

export function constraintsSection(hasSource: boolean): string {
  const lines = [
    "## Constraints",
    "",
    "- Modify only the relevant component or style files.",
    "- Do not refactor unrelated code.",
    "- Preserve existing click behavior, links, and accessibility.",
    "- Keep the design responsive.",
    "- Check desktop and mobile layouts.",
    "- If a design token or theme variable exists, use it instead of hardcoded colors.",
  ];

  if (hasSource) {
    lines.push(
      "- Start from the source file referenced above; confirm it is the right element before editing.",
    );
  } else {
    lines.push(
      "- Source file metadata is unavailable: locate the element by its selector, visible text, class names, and surrounding component structure.",
    );
  }

  return lines.join("\n");
}

export function acceptanceSection(): string {
  return [
    "## Acceptance Criteria",
    "",
    "- The selected element visually matches the requested change.",
    "- No unrelated UI elements are changed.",
    "- Existing tests and build should continue passing.",
  ].join("\n");
}
