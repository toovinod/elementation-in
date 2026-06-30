import { useEffect, useRef, type CSSProperties } from "react";
import { createId } from "@elementation/core";
import { generateElementationPrompt } from "@elementation/prompt-engine";
import type { ResolvedConfig } from "../config";
import { useOverlayStore, type RectLike } from "../store/use-overlay-store";

function popoverPosition(rect: RectLike): CSSProperties {
  const width = 360;
  const estimatedHeight = 285;
  const gap = 12;
  const left = Math.max(12, Math.min(rect.left, window.innerWidth - width - 12));
  const below = rect.top + rect.height + gap;
  const fitsBelow = below + estimatedHeight < window.innerHeight;
  const top = fitsBelow ? below : Math.max(12, rect.top - estimatedHeight - gap);
  return { top, left, width };
}

export function FeedbackPopover({ config }: { config: ResolvedConfig }) {
  const selected = useOverlayStore((s) => s.selected);
  const feedback = useOverlayStore((s) => s.feedback);
  const setFeedback = useOverlayStore((s) => s.setFeedback);
  const cancelSelection = useOverlayStore((s) => s.cancelSelection);
  const showPrompt = useOverlayStore((s) => s.showPrompt);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  if (!selected) return null;

  const source = selected.capture.source;
  const sourceLabel = source?.filePath
    ? `${source.filePath}${source.lineNumber ? `:${source.lineNumber}` : ""}`
    : "Source metadata unavailable";

  const generate = async () => {
    const capture = { ...selected.capture, feedback: feedback.trim() };
    const generatedPrompt = generateElementationPrompt(capture, { target: config.target });
    try {
      await config.store.addAnnotation({
        id: createId(),
        projectKey: config.projectKey,
        capture,
        generatedPrompt,
        createdAt: new Date().toISOString(),
      });
    } catch (error) {
      console.warn("[elementation] failed to persist annotation", error);
    }
    showPrompt(generatedPrompt);
  };

  return (
    <div className="elementation-popover" style={popoverPosition(selected.rect)}>
      <div className="elementation-popover-head">
        <div>
          <div className="elementation-eyebrow">Add feedback</div>
          <div className="elementation-selector">{selected.capture.element.selector}</div>
        </div>
        <button
          type="button"
          className="elementation-iconbtn"
          aria-label="Cancel annotation"
          onClick={cancelSelection}
        >
          ×
        </button>
      </div>
      <div className="elementation-popover-body">
        <label className="elementation-label" htmlFor="elementation-feedback">
          What should change?
        </label>
        <textarea
          id="elementation-feedback"
          ref={textareaRef}
          className="elementation-textarea"
          placeholder="Make this button smaller and use the primary brand color."
          value={feedback}
          onChange={(event) => setFeedback(event.target.value)}
        />
        <div className="elementation-source">
          <span>Source</span>
          <code>{sourceLabel}</code>
        </div>
        <div className="elementation-actions">
          <button
            type="button"
            className="elementation-btn"
            data-variant="secondary"
            onClick={cancelSelection}
          >
            Cancel
          </button>
          <button
            type="button"
            className="elementation-btn"
            disabled={!feedback.trim()}
            onClick={() => void generate()}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
