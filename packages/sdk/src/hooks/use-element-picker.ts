import { useEffect } from "react";
import { captureElement } from "../capture/capture-element";
import type { ResolvedConfig } from "../config";
import { useOverlayStore, type RectLike } from "../store/use-overlay-store";

function toRectLike(rect: DOMRect): RectLike {
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

function labelFor(element: HTMLElement): string {
  const tag = element.tagName.toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const firstClass =
    typeof element.className === "string" && element.className.trim()
      ? `.${element.className.trim().split(/\s+/)[0]}`
      : "";
  return `${tag}${id}${firstClass}`;
}

function targetFromEvent(event: Event): HTMLElement | null {
  const target = event.target as Element | null;
  if (!target || typeof target.closest !== "function") return null;
  if (target.closest("[data-elementation-ui]")) return null;
  return target instanceof HTMLElement ? target : null;
}

export function useElementPicker(config: ResolvedConfig): void {
  const inspect = useOverlayStore((s) => s.inspect);
  const hasSelection = useOverlayStore((s) => s.selected !== null);
  const hasPrompt = useOverlayStore((s) => s.prompt !== null);
  const active = inspect && !hasSelection && !hasPrompt;

  useEffect(() => {
    if (!active) return;

    const previousCursor = document.body.style.cursor;
    document.body.style.cursor = "crosshair";

    const onMove = (event: MouseEvent) => {
      const element = targetFromEvent(event);
      const store = useOverlayStore.getState();
      if (!element) {
        store.setHovered(null);
        return;
      }
      store.setHovered({
        rect: toRectLike(element.getBoundingClientRect()),
        label: labelFor(element),
      });
    };

    const onClick = (event: MouseEvent) => {
      const element = targetFromEvent(event);
      if (!element) return;
      event.preventDefault();
      event.stopPropagation();
      const capture = captureElement(element, "", config.projectKey);
      useOverlayStore
        .getState()
        .selectElement(capture, toRectLike(element.getBoundingClientRect()));
    };

    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);

    return () => {
      document.body.style.cursor = previousCursor;
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [active, config]);
}
