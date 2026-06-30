export const OVERLAY_CSS = `
.elementation-root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.4;
  color: #1f2937;
  -webkit-font-smoothing: antialiased;
}
.elementation-root *, .elementation-root *::before, .elementation-root *::after { box-sizing: border-box; }

.elementation-toolbar {
  position: fixed; right: 20px; bottom: 20px; z-index: 2;
  pointer-events: auto;
  display: flex; align-items: center; gap: 10px;
  padding: 8px;
  min-height: 56px;
  background: rgba(255, 255, 255, 0.94); color: #1f2937;
  border: 1px solid #dfe6ee;
  border-radius: 999px;
  box-shadow: 0 16px 40px rgba(48, 67, 93, 0.18);
  backdrop-filter: blur(12px);
}
.elementation-toolbar-copy { display: flex; flex-direction: column; padding: 0 12px 0 2px; line-height: 1.15; }
.elementation-toolbar-copy strong { font-size: 13px; font-weight: 750; color: #1f2937; }
.elementation-toolbar-copy span { margin-top: 3px; font-size: 12px; color: #64748b; }
.elementation-toggle {
  appearance: none; border: 0; cursor: pointer;
  display: grid; place-items: center;
  width: 40px; height: 40px; border-radius: 999px;
  background: #2f6fed; color: #ffffff;
  box-shadow: 0 10px 24px rgba(47, 111, 237, 0.24);
  transition: transform 0.12s ease, background 0.15s ease;
}
.elementation-toggle:hover { transform: translateY(-1px); background: #255fd7; }
.elementation-toggle:active { transform: translateY(0); }
.elementation-toggle svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.elementation-btn {
  appearance: none; border: 0; cursor: pointer; font: inherit; font-weight: 750;
  padding: 9px 15px; border-radius: 999px; background: #2f6fed; color: #fff;
  transition: background 0.15s ease, transform 0.05s ease, opacity 0.15s ease;
}
.elementation-btn:hover { background: #255fd7; }
.elementation-btn:active { transform: translateY(1px); }
.elementation-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.elementation-btn[data-variant="secondary"] { background: #eef5ff; color: #27415f; }
.elementation-btn[data-variant="secondary"]:hover { background: #dfeaff; color: #1f2937; }

.elementation-hover, .elementation-selected { position: fixed; pointer-events: none; z-index: 1; border-radius: 7px; }
.elementation-hover { border: 2px dashed #2bbf78; background: rgba(43, 191, 120, 0.1); }
.elementation-selected { border: 2px solid #2f6fed; box-shadow: 0 0 0 3px rgba(47, 111, 237, 0.16); }
.elementation-tag {
  position: absolute; left: -2px; top: -28px;
  background: #2bbf78; color: #fff; font-size: 11px; font-weight: 750;
  padding: 5px 8px; border-radius: 999px; white-space: nowrap;
  box-shadow: 0 10px 24px rgba(43, 191, 120, 0.24);
  font-family: "SF Mono", ui-monospace, Menlo, monospace;
}

.elementation-popover {
  position: fixed; z-index: 3; pointer-events: auto;
  width: 360px; max-width: calc(100vw - 24px);
  background: #ffffff; color: #1f2937;
  border: 1px solid #dfe6ee; border-radius: 18px;
  box-shadow: 0 24px 70px rgba(48, 67, 93, 0.2); overflow: hidden;
}
.elementation-popover-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; padding: 15px 15px 12px; border-bottom: 1px solid #e6edf5; }
.elementation-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.14em; color: #94a3b8; font-weight: 800; }
.elementation-selector { margin-top: 5px; font-family: "SF Mono", ui-monospace, Menlo, monospace; font-size: 12px; color: #64748b; word-break: break-all; }
.elementation-popover-body { padding: 14px 15px 15px; }
.elementation-label { display: block; font-size: 13px; font-weight: 750; color: #1f2937; }
.elementation-textarea {
  width: 100%; min-height: 104px; resize: vertical; margin-top: 8px;
  font: inherit; font-size: 14px; line-height: 1.5; padding: 11px 12px;
  border: 1px solid #cbd5e1; border-radius: 14px; outline: none; color: #1f2937; background: #f8fbff;
}
.elementation-textarea::placeholder { color: #94a3b8; }
.elementation-textarea:focus { border-color: #2f6fed; box-shadow: 0 0 0 4px rgba(47, 111, 237, 0.12); background: #fff; }
.elementation-source { margin-top: 10px; display: grid; gap: 4px; border-radius: 12px; background: #f8fbff; padding: 9px 10px; }
.elementation-source span { font-size: 11px; color: #94a3b8; font-weight: 750; text-transform: uppercase; letter-spacing: 0.12em; }
.elementation-source code { font-family: "SF Mono", ui-monospace, Menlo, monospace; font-size: 11px; color: #64748b; word-break: break-all; }
.elementation-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }

.elementation-backdrop {
  position: fixed; inset: 0; z-index: 4; pointer-events: auto;
  display: flex; align-items: center; justify-content: center;
  padding: 24px; background: rgba(31, 41, 55, 0.28);
}
.elementation-dialog {
  width: 760px; max-width: 100%; max-height: 86vh;
  display: flex; flex-direction: column;
  background: #fff; border-radius: 20px; overflow: hidden;
  box-shadow: 0 30px 90px rgba(48, 67, 93, 0.28);
}
.elementation-dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 16px 18px; border-bottom: 1px solid #e6edf5; }
.elementation-dialog-title { margin-top: 4px; font-weight: 800; font-size: 17px; color: #1f2937; }
.elementation-pre {
  margin: 0; padding: 18px; overflow: auto; flex: 1;
  background: #f8fbff; color: #334155;
  font-family: "SF Mono", ui-monospace, Menlo, monospace;
  font-size: 12.5px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;
}
.elementation-dialog-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px; border-top: 1px solid #e6edf5; }
.elementation-iconbtn {
  appearance: none; border: 0; background: #eef5ff; cursor: pointer; color: #64748b;
  display: grid; place-items: center; width: 30px; height: 30px; border-radius: 999px;
  font-size: 17px; line-height: 1; transition: background 0.15s ease, color 0.15s ease;
}
.elementation-iconbtn:hover { background: #dfeaff; color: #1f2937; }
`;
