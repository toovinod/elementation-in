interface FiberNode {
  type: unknown;
  return: FiberNode | null;
}

interface ForwardRefType {
  displayName?: string;
  render?: { name?: string; displayName?: string };
}

/**
 * Best-effort React component name from the element's fiber. React internals are
 * private and can change between minor versions, so this is wrapped in try/catch
 * and must never be load-bearing — the data-elementation-* attributes are the
 * authoritative source.
 */
export function resolveReactComponentName(element: Element): string | undefined {
  try {
    const fiberKey = Object.keys(element).find(
      (key) => key.startsWith("__reactFiber$") || key.startsWith("__reactInternalInstance$"),
    );
    if (!fiberKey) return undefined;

    let fiber = (element as unknown as Record<string, unknown>)[fiberKey] as FiberNode | undefined;
    let depth = 0;
    while (fiber && depth < 30) {
      const name = nameFromType(fiber.type);
      if (name) return name;
      fiber = fiber.return ?? undefined;
      depth += 1;
    }
    return undefined;
  } catch {
    return undefined;
  }
}

function nameFromType(type: unknown): string | undefined {
  if (typeof type === "function") {
    const fn = type as { displayName?: string; name?: string };
    const name = fn.displayName ?? fn.name;
    return name && name !== "Unknown" ? name : undefined;
  }
  if (type && typeof type === "object") {
    const ref = type as ForwardRefType;
    return ref.displayName ?? ref.render?.displayName ?? ref.render?.name;
  }
  return undefined;
}
