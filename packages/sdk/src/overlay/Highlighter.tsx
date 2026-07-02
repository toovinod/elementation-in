import type { CSSProperties } from "react";
import { useOverlayStore, type RectLike } from "../store/use-overlay-store";

function rectStyle(rect: RectLike): CSSProperties {
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

export function Highlighter() {
  const hovered = useOverlayStore((s) => s.hovered);
  const selected = useOverlayStore((s) => s.selected);

  return (
    <>
      {hovered ? (
        <div className="elementation-hover" style={rectStyle(hovered.rect)}>
          <span className="elementation-tag">{hovered.label}</span>
        </div>
      ) : null}
      {selected ? (
        <div className="elementation-selected" style={rectStyle(selected.rect)}>
          <span className="elementation-handle" data-corner="tl" />
          <span className="elementation-handle" data-corner="tr" />
          <span className="elementation-handle" data-corner="bl" />
          <span className="elementation-handle" data-corner="br" />
        </div>
      ) : null}
    </>
  );
}
