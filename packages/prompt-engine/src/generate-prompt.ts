import type { ElementationCapture } from "@elementation/core";
import { elementSummarySection } from "./sections/element-summary";
import { acceptanceSection, constraintsSection, taskSection } from "./sections/instruction-block";
import { sourceSection } from "./sections/source-block";
import { stylesSection } from "./sections/styles-block";
import { introFor, type PromptTarget } from "./templates";

export interface GeneratePromptOptions {
  target?: PromptTarget;
  intro?: string;
}

export function generateElementationPrompt(
  capture: ElementationCapture,
  options: GeneratePromptOptions = {},
): string {
  const source = sourceSection(capture);
  const feedback = capture.feedback.trim() || "(no feedback provided)";

  const blocks: Array<string | null> = [
    options.intro ?? introFor(options.target),
    `## User Feedback\n\n${feedback}`,
    elementSummarySection(capture),
    source,
    stylesSection(capture),
    taskSection(capture),
    constraintsSection(source !== null),
    acceptanceSection(),
  ];

  return `${blocks.filter((block): block is string => block !== null).join("\n\n")}\n`;
}
