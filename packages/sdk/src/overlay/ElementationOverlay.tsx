import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { UI_ATTRIBUTE } from "@elementation/core";
import { resolveConfig, type ElementationOverlayProps } from "../config";
import { OVERLAY_CSS } from "../styles";
import { OverlayApp } from "./OverlayApp";

export function ElementationOverlay({ projectKey, apiUrl, target }: ElementationOverlayProps) {
  useEffect(() => {
    if (typeof document === "undefined") return;

    const host = document.createElement("div");
    host.setAttribute(UI_ATTRIBUTE, "true");
    Object.assign(host.style, {
      position: "fixed",
      inset: "0",
      zIndex: "2147483647",
      pointerEvents: "none",
    });
    document.body.appendChild(host);

    const shadow = host.attachShadow({ mode: "open" });
    const style = document.createElement("style");
    style.textContent = OVERLAY_CSS;
    shadow.appendChild(style);

    const container = document.createElement("div");
    container.className = "elementation-root";
    container.setAttribute(UI_ATTRIBUTE, "true");
    shadow.appendChild(container);

    const root = createRoot(container);
    root.render(<OverlayApp config={resolveConfig({ projectKey, apiUrl, target })} />);

    return () => {
      root.unmount();
      host.remove();
    };
  }, [projectKey, apiUrl, target]);

  return null;
}
