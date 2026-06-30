import { describe, expect, it } from "vitest";
import { elementationCaptureSchema } from "@elementation/core";
import { captureElement } from "./capture-element";

describe("captureElement", () => {
  it("captures metadata, dataset, and source attributes", () => {
    document.body.innerHTML = `
      <section
        data-elementation-component="HeroCTA"
        data-elementation-file="src/components/HeroCTA.tsx"
        data-elementation-line="42"
      >
        <button id="cta" class="primary-cta" aria-label="Get started" data-foo="bar">Get Started</button>
      </section>`;

    const button = document.getElementById("cta") as HTMLElement;
    const capture = captureElement(button, "make it smaller", "el_demo");

    expect(capture.element.tagName).toBe("button");
    expect(capture.element.textContent).toBe("Get Started");
    expect(capture.element.selector).toBe("#cta");
    expect(capture.element.ariaLabel).toBe("Get started");
    expect(capture.element.dataset.foo).toBe("bar");
    expect(capture.element.dataset.elementationComponent).toBeUndefined();
    expect(capture.feedback).toBe("make it smaller");
    expect(capture.projectKey).toBe("el_demo");
    expect(capture.source?.componentName).toBe("HeroCTA");
    expect(capture.source?.lineNumber).toBe(42);
  });

  it("produces a schema-valid capture", () => {
    document.body.innerHTML = `<button>Hi</button>`;
    const button = document.querySelector("button") as HTMLElement;
    const capture = captureElement(button);
    expect(() => elementationCaptureSchema.parse(capture)).not.toThrow();
  });
});
