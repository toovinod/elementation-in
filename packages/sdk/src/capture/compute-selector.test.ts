import { describe, expect, it } from "vitest";
import { getCssSelector } from "./compute-selector";

describe("getCssSelector", () => {
  it("prefers an id when present", () => {
    document.body.innerHTML = `<button id="cta">Go</button>`;
    expect(getCssSelector(document.getElementById("cta") as Element)).toBe("#cta");
  });

  it("builds a class-based path for elements without an id", () => {
    document.body.innerHTML = `
      <main><section class="hero"><button class="primary-cta">Go</button></section></main>`;
    const button = document.querySelector("button.primary-cta") as Element;
    const selector = getCssSelector(button);
    expect(selector).toContain("button.primary-cta");
    expect(selector).toContain("section.hero");
  });

  it("disambiguates same-type siblings with nth-of-type", () => {
    document.body.innerHTML = `<ul><li>one</li><li>two</li><li id="x">three</li></ul>`;
    document.body.innerHTML = `<div><span>a</span><span>b</span></div>`;
    const second = document.querySelectorAll("span")[1] as Element;
    expect(getCssSelector(second)).toContain(":nth-of-type(2)");
  });
});
