import type { CaptureStyles } from "@elementation/core";

export function getComputedStyleSnapshot(element: HTMLElement): CaptureStyles {
  const s = window.getComputedStyle(element);
  return {
    display: s.display,
    position: s.position,
    width: s.width,
    height: s.height,
    margin: `${s.marginTop} ${s.marginRight} ${s.marginBottom} ${s.marginLeft}`,
    padding: `${s.paddingTop} ${s.paddingRight} ${s.paddingBottom} ${s.paddingLeft}`,
    fontSize: s.fontSize,
    fontWeight: s.fontWeight,
    color: s.color,
    backgroundColor: s.backgroundColor,
    border: `${s.borderTopWidth} ${s.borderTopStyle} ${s.borderTopColor}`,
    borderRadius: s.borderRadius,
    boxShadow: s.boxShadow,
  };
}

export function getElementText(element: Element): string {
  return (element.textContent ?? "").replace(/\s+/g, " ").trim().slice(0, 300);
}
