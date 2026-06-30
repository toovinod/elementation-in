import { describe, expect, it } from "vitest";
import { elementationCaptureSchema, type ElementationCapture } from "./schema";

const validCapture: ElementationCapture = {
  id: "cap_1",
  projectKey: "el_demo",
  createdAt: "2026-01-01T00:00:00.000Z",
  feedback: "Make this button smaller and use the brand color.",
  page: { url: "http://localhost:3000/pricing", pathname: "/pricing", title: "Pricing" },
  viewport: { width: 1440, height: 900 },
  element: {
    tagName: "button",
    textContent: "Get Started",
    selector: "main section.hero button.primary-cta",
    className: "primary-cta",
    dataset: {},
  },
  box: { x: 100, y: 200, width: 220, height: 56, top: 200, left: 100, right: 320, bottom: 256 },
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
  source: { componentName: "HeroCTA", filePath: "src/components/HeroCTA.tsx", lineNumber: 42 },
};

describe("elementationCaptureSchema", () => {
  it("accepts a complete capture", () => {
    expect(elementationCaptureSchema.safeParse(validCapture).success).toBe(true);
  });

  it("accepts a capture without optional source metadata", () => {
    const { source: _source, ...withoutSource } = validCapture;
    expect(elementationCaptureSchema.safeParse(withoutSource).success).toBe(true);
  });

  it("rejects a capture missing a required section", () => {
    const { element: _element, ...invalid } = validCapture;
    expect(elementationCaptureSchema.safeParse(invalid).success).toBe(false);
  });
});
