import { describe, expect, it } from "vitest";
import type { ElementationCapture } from "@elementation/core";
import { generateElementationPrompt } from "./generate-prompt";

function baseCapture(): ElementationCapture {
  return {
    id: "cap_1",
    createdAt: "2026-01-01T00:00:00.000Z",
    feedback: "This button is too large. Make it smaller and use the primary brand color.",
    page: { url: "http://localhost:3000/pricing", pathname: "/pricing", title: "Pricing" },
    viewport: { width: 1440, height: 900 },
    element: {
      tagName: "button",
      textContent: "Get Started",
      selector: "main section.hero button.primary-cta",
      className: "primary-cta",
      dataset: {},
    },
    box: { x: 0, y: 0, width: 220, height: 56, top: 0, left: 0, right: 220, bottom: 56 },
    styles: {
      display: "inline-flex",
      position: "static",
      width: "220px",
      height: "56px",
      margin: "0px",
      padding: "16px 28px",
      fontSize: "18px",
      fontWeight: "600",
      color: "rgb(255, 255, 255)",
      backgroundColor: "rgb(59, 130, 246)",
      border: "0px none",
      borderRadius: "8px",
      boxShadow: "none",
    },
  };
}

describe("generateElementationPrompt", () => {
  it("includes feedback, selector, page, viewport, and styles", () => {
    const prompt = generateElementationPrompt(baseCapture());
    expect(prompt).toContain("## User Feedback");
    expect(prompt).toContain("Make it smaller");
    expect(prompt).toContain("- Selector: main section.hero button.primary-cta");
    expect(prompt).toContain("- Page: http://localhost:3000/pricing");
    expect(prompt).toContain("- Viewport: 1440x900");
    expect(prompt).toContain("- Background: rgb(59, 130, 246)");
    expect(prompt).toContain("## Acceptance Criteria");
  });

  it("includes a Source Location section when metadata is present", () => {
    const prompt = generateElementationPrompt({
      ...baseCapture(),
      source: {
        componentName: "HeroCTA",
        filePath: "src/components/HeroCTA.tsx",
        lineNumber: 42,
      },
    });
    expect(prompt).toContain("## Source Location");
    expect(prompt).toContain("- Component: HeroCTA");
    expect(prompt).toContain("- File: src/components/HeroCTA.tsx");
    expect(prompt).toContain("- Line: 42");
  });

  it("omits Source Location and adapts constraints when metadata is absent", () => {
    const prompt = generateElementationPrompt(baseCapture());
    expect(prompt).not.toContain("## Source Location");
    expect(prompt).toContain("Source file metadata is unavailable");
  });

  it("supports target-specific framing", () => {
    const prompt = generateElementationPrompt(baseCapture(), { target: "claude-code" });
    expect(prompt).toContain("Claude Code");
  });
});
