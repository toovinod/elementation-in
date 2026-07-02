import { describe, expect, it } from "vitest";
import { formatAnnotation, formatAnnotationList, summarizeAnnotation } from "./format";
import { makeSyncedAnnotation } from "./test-fixtures";

describe("format", () => {
  it("summarizes an annotation from its capture", () => {
    const summary = summarizeAnnotation(makeSyncedAnnotation());
    expect(summary).toMatchObject({
      id: "ann_1",
      status: "pending",
      feedback: "This button is too large.",
      element: "button",
      selector: "main section.hero button.primary-cta",
      file: "src/components/HeroCTA.tsx",
      line: 42,
    });
  });

  it("formats an annotation with source location and the generated prompt", () => {
    const text = formatAnnotation(makeSyncedAnnotation());
    expect(text).toContain("Annotation ann_1 [pending]");
    expect(text).toContain("Selector: main section.hero button.primary-cta");
    expect(text).toContain("Source: HeroCTA — src/components/HeroCTA.tsx:42");
    expect(text).toContain("Make the button smaller");
  });

  it("renders an empty list message", () => {
    expect(formatAnnotationList([])).toBe("No annotations.");
  });
});
