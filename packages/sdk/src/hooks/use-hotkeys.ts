import { useEffect } from "react";
import { useOverlayStore } from "../store/use-overlay-store";

export function useHotkeys(): void {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const store = useOverlayStore.getState();
      if (store.prompt !== null) store.closePrompt();
      else if (store.selected) store.cancelSelection();
      else if (store.inspect) store.exitInspect();
    };

    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, []);
}
