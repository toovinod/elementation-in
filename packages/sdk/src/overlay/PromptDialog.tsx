import { useState } from "react";
import { useOverlayStore } from "../store/use-overlay-store";

export function PromptDialog() {
  const prompt = useOverlayStore((s) => s.prompt);
  const closePrompt = useOverlayStore((s) => s.closePrompt);
  const [copied, setCopied] = useState(false);

  if (prompt === null) return null;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="elementation-backdrop" onClick={closePrompt}>
      <div className="elementation-dialog" onClick={(event) => event.stopPropagation()}>
        <div className="elementation-dialog-head">
          <div>
            <div className="elementation-eyebrow">Ready to paste</div>
            <div className="elementation-dialog-title">Formatted Markdown prompt</div>
          </div>
          <button
            type="button"
            className="elementation-iconbtn"
            aria-label="Close"
            onClick={closePrompt}
          >
            ×
          </button>
        </div>
        <pre className="elementation-pre">{prompt}</pre>
        <div className="elementation-dialog-foot">
          <button
            type="button"
            className="elementation-btn"
            data-variant="secondary"
            onClick={closePrompt}
          >
            Close
          </button>
          <button type="button" className="elementation-btn" onClick={() => void copy()}>
            {copied ? "Copied" : "Copy prompt"}
          </button>
        </div>
      </div>
    </div>
  );
}
