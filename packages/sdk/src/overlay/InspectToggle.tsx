import { useOverlayStore } from "../store/use-overlay-store";

function InspectIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 6h9" />
      <path d="M4 12h7" />
      <path d="M4 18h5" />
      <path d="m14 14 5 5" />
      <path d="m16 11 4 8-8-4 3-1z" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12" />
      <path d="M18 6 6 18" />
    </svg>
  );
}

export function InspectToggle() {
  const inspect = useOverlayStore((s) => s.inspect);
  const toggleInspect = useOverlayStore((s) => s.toggleInspect);

  return (
    <div className="elementation-toolbar" data-active={inspect ? "true" : "false"}>
      <button
        type="button"
        className="elementation-toggle"
        aria-pressed={inspect}
        aria-label={inspect ? "Exit Elementation inspect mode" : "Start Elementation inspect mode"}
        title={inspect ? "Exit Inspect" : "Inspect"}
        onClick={toggleInspect}
      >
        {inspect ? <CloseIcon /> : <InspectIcon />}
      </button>
      {inspect ? (
        <div className="elementation-toolbar-copy">
          <strong>Inspecting</strong>
          <span>Hover, then click</span>
        </div>
      ) : null}
    </div>
  );
}
