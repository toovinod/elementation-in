import type { ResolvedConfig } from "../config";
import { useElementPicker } from "../hooks/use-element-picker";
import { useHotkeys } from "../hooks/use-hotkeys";
import { useOverlayStore } from "../store/use-overlay-store";
import { FeedbackPopover } from "./FeedbackPopover";
import { Highlighter } from "./Highlighter";
import { InspectToggle } from "./InspectToggle";
import { PromptDialog } from "./PromptDialog";

export function OverlayApp({ config }: { config: ResolvedConfig }) {
  const inspect = useOverlayStore((s) => s.inspect);
  const hasSelection = useOverlayStore((s) => s.selected !== null);
  const hasPrompt = useOverlayStore((s) => s.prompt !== null);

  useElementPicker(config);
  useHotkeys();

  return (
    <>
      <InspectToggle />
      {inspect ? <Highlighter /> : null}
      {hasSelection ? <FeedbackPopover config={config} /> : null}
      {hasPrompt ? <PromptDialog /> : null}
    </>
  );
}
