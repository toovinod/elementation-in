const LANDMARK_TAGS = new Set([
  "main",
  "section",
  "nav",
  "header",
  "footer",
  "form",
  "aside",
  "article",
]);

function cssEscape(value: string): string {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(value);
  }
  return value.replace(/[^a-zA-Z0-9_-]/g, "\\$&");
}

function stableClasses(element: Element): string[] {
  return Array.from(element.classList)
    .filter((name) => /^[a-zA-Z][\w-]*$/.test(name) && name.length <= 30)
    .slice(0, 2);
}

function nthOfType(element: Element): number {
  let index = 1;
  let sibling = element.previousElementSibling;
  while (sibling) {
    if (sibling.tagName === element.tagName) index += 1;
    sibling = sibling.previousElementSibling;
  }
  return index;
}

function hasTypedSiblings(element: Element): boolean {
  const parent = element.parentElement;
  if (!parent) return false;
  let count = 0;
  for (const child of Array.from(parent.children)) {
    if (child.tagName === element.tagName) count += 1;
    if (count > 1) return true;
  }
  return false;
}

/**
 * Readable, reasonably specific CSS selector. Prefers an id, otherwise builds a
 * short path of meaningful ancestors (landmarks or class-bearing elements) and
 * falls back to :nth-of-type to disambiguate siblings.
 */
export function getCssSelector(element: Element): string {
  if (!(element instanceof Element)) return "";
  if (element.id) return `#${cssEscape(element.id)}`;

  const parts: string[] = [];
  let current: Element | null = element;

  while (current && current.nodeType === 1) {
    if (current === document.documentElement || current === document.body) break;

    if (current.id) {
      parts.unshift(`#${cssEscape(current.id)}`);
      break;
    }

    const tag = current.tagName.toLowerCase();
    const classes = stableClasses(current);
    const isTarget = current === element;

    if (isTarget || classes.length > 0 || LANDMARK_TAGS.has(tag)) {
      let part = tag;
      if (classes.length > 0) {
        part += `.${classes.map(cssEscape).join(".")}`;
      } else if (isTarget && hasTypedSiblings(current)) {
        part += `:nth-of-type(${nthOfType(current)})`;
      }
      parts.unshift(part);
      if (parts.length >= 4) break;
    }

    current = current.parentElement;
  }

  return parts.join(" ");
}
