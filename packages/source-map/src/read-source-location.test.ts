import { describe, expect, it } from "vitest";
import { getElementSourceMetadata } from "./read-source-location";

describe("getElementSourceMetadata", () => {
  it("reads data-elementation-* attributes from the nearest ancestor", () => {
    document.body.innerHTML = `
      <section
        data-elementation-component="HeroCTA"
        data-elementation-file="src/components/HeroCTA.tsx"
        data-elementation-line="42"
        data-elementation-column="12"
      >
        <button id="cta">Get started</button>
      </section>`;

    const button = document.getElementById("cta");
    const meta = getElementSourceMetadata(button as Element);

    expect(meta?.componentName).toBe("HeroCTA");
    expect(meta?.filePath).toBe("src/components/HeroCTA.tsx");
    expect(meta?.lineNumber).toBe(42);
    expect(meta?.columnNumber).toBe(12);
  });

  it("returns undefined when no source metadata is present", () => {
    document.body.innerHTML = `<button id="plain">Hi</button>`;
    const button = document.getElementById("plain");
    expect(getElementSourceMetadata(button as Element)).toBeUndefined();
  });
});
