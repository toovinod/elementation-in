export const OVERLAY_CSS = `
.elementation-root {
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  line-height: 1.45;
  color: #181410;
  -webkit-font-smoothing: antialiased;
}
.elementation-root *, .elementation-root *::before, .elementation-root *::after { box-sizing: border-box; }

.elementation-toolbar {
  position: fixed; right: 20px; bottom: 20px; z-index: 2;
  pointer-events: auto;
  display: flex; align-items: center; gap: 10px;
  padding: 8px;
  min-height: 56px;
  background: rgba(255, 253, 247, 0.92); color: #181410;
  border: 1px solid #e7dac3;
  border-radius: 999px;
  box-shadow: 0 16px 40px rgba(40, 30, 18, 0.16);
  backdrop-filter: blur(12px);
}
.elementation-toolbar-copy { display: flex; flex-direction: column; padding: 0 12px 0 2px; line-height: 1.15; }
.elementation-toolbar-copy strong { font-size: 13px; font-weight: 600; color: #181410; }
.elementation-toolbar-copy span { margin-top: 3px; font-size: 12px; color: #6e6453; }
.elementation-toggle {
  appearance: none; border: 0; cursor: pointer;
  display: grid; place-items: center;
  width: 40px; height: 40px; border-radius: 999px;
  background: #6a4bff; color: #ffffff;
  box-shadow: 0 8px 20px rgba(106, 75, 255, 0.32);
  transition: transform 0.12s ease, background 0.15s ease;
}
.elementation-toggle:hover { transform: translateY(-1px); background: #5a3de0; }
.elementation-toggle:active { transform: translateY(0); }
.elementation-toggle svg { width: 19px; height: 19px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }

.elementation-btn {
  appearance: none; border: 0; cursor: pointer; font: inherit; font-weight: 600;
  padding: 9px 16px; border-radius: 999px; background: #6a4bff; color: #fff;
  transition: background 0.15s ease, transform 0.05s ease, opacity 0.15s ease;
}
.elementation-btn:hover { background: #5a3de0; }
.elementation-btn:active { transform: translateY(1px); }
.elementation-btn:disabled { opacity: 0.45; cursor: not-allowed; }
.elementation-btn[data-variant="secondary"] { background: #f2ead9; color: #4a4234; }
.elementation-btn[data-variant="secondary"]:hover { background: #ece1cd; color: #181410; }

.elementation-hover, .elementation-selected { position: fixed; pointer-events: none; z-index: 1; border-radius: 6px; }
.elementation-hover { border: 1.5px dashed rgba(106, 75, 255, 0.55); background: rgba(106, 75, 255, 0.08); }
.elementation-selected { border: 2px solid #6a4bff; }
.elementation-handle {
  position: absolute; width: 8px; height: 8px;
  background: #fff; border: 2px solid #6a4bff; border-radius: 2px;
}
.elementation-handle[data-corner="tl"] { left: -5px; top: -5px; }
.elementation-handle[data-corner="tr"] { right: -5px; top: -5px; }
.elementation-handle[data-corner="bl"] { left: -5px; bottom: -5px; }
.elementation-handle[data-corner="br"] { right: -5px; bottom: -5px; }
.elementation-tag {
  position: absolute; left: -2px; top: -28px;
  background: #6a4bff; color: #fff; font-size: 11px; font-weight: 500;
  padding: 4px 9px; border-radius: 6px; white-space: nowrap;
  box-shadow: 0 8px 20px rgba(106, 75, 255, 0.28);
  font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
}

.elementation-popover {
  position: fixed; z-index: 3; pointer-events: auto;
  width: 360px; max-width: calc(100vw - 24px);
  background: #fffdf7; color: #181410;
  border: 1px solid #e7dac3; border-radius: 16px;
  box-shadow: 0 24px 70px rgba(40, 30, 18, 0.22); overflow: hidden;
}
.elementation-popover-head { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px 14px; border-bottom: 1px solid #efe5d2; }
.elementation-chip { display: inline-flex; align-items: center; gap: 8px; min-width: 0; }
.elementation-chip-tag {
  flex: none; font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 11px; font-weight: 500; color: #4a30bc;
  background: #ece7ff; padding: 3px 8px; border-radius: 6px;
}
.elementation-chip-sel {
  min-width: 0; font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12px; color: #6e6453; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.elementation-eyebrow { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #6a4bff; font-weight: 600; font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace; }
.elementation-popover-body { padding: 13px 14px 14px; }
.elementation-label { display: block; font-size: 13px; font-weight: 600; color: #181410; }
.elementation-textarea {
  width: 100%; min-height: 104px; resize: vertical; margin-top: 8px;
  font: inherit; font-size: 14px; line-height: 1.5; padding: 11px 12px;
  border: 1px solid #ddcfb4; border-radius: 12px; outline: none; color: #181410; background: #fbf8f1;
}
.elementation-textarea::placeholder { color: #9a8f7e; }
.elementation-textarea:focus { border-color: #6a4bff; box-shadow: 0 0 0 4px rgba(106, 75, 255, 0.14); background: #fff; }
.elementation-source { margin-top: 10px; display: flex; align-items: center; gap: 8px; border-radius: 10px; background: #f4eede; padding: 9px 11px; }
.elementation-source svg { flex: none; width: 13px; height: 13px; fill: none; stroke: #b2a48c; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.elementation-source code { min-width: 0; font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace; font-size: 11px; color: #6e6453; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.elementation-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 12px; }

.elementation-backdrop {
  position: fixed; inset: 0; z-index: 4; pointer-events: auto;
  display: flex; align-items: center; justify-content: center;
  padding: 24px; background: rgba(24, 20, 16, 0.34);
}
.elementation-dialog {
  width: 760px; max-width: 100%; max-height: 86vh;
  display: flex; flex-direction: column;
  background: #fffdf7; border-radius: 18px; overflow: hidden;
  box-shadow: 0 30px 90px rgba(24, 20, 16, 0.34);
}
.elementation-dialog-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; padding: 16px 18px; border-bottom: 1px solid #efe5d2; }
.elementation-dialog-title { margin-top: 4px; font-weight: 600; font-size: 17px; color: #181410; }
.elementation-pre {
  margin: 0; padding: 18px; overflow: auto; flex: 1;
  background: #f4eede; color: #3a342c;
  font-family: "IBM Plex Mono", ui-monospace, "SF Mono", Menlo, monospace;
  font-size: 12.5px; line-height: 1.6; white-space: pre-wrap; word-break: break-word;
}
.elementation-dialog-foot { display: flex; justify-content: flex-end; gap: 8px; padding: 14px 18px; border-top: 1px solid #efe5d2; }
.elementation-iconbtn {
  appearance: none; border: 0; background: #f2ead9; cursor: pointer; color: #6e6453;
  display: grid; place-items: center; width: 30px; height: 30px; border-radius: 999px;
  font-size: 17px; line-height: 1; transition: background 0.15s ease, color 0.15s ease;
}
.elementation-iconbtn:hover { background: #ece1cd; color: #181410; }
`;
