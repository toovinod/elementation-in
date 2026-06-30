export type PromptTarget = "generic" | "cursor" | "claude-code" | "codex";

const INTROS: Record<PromptTarget, string> = {
  generic:
    "You are working in a large frontend codebase. Fix only the selected UI element described below.",
  cursor:
    "You are an AI pair programmer in Cursor working in a large frontend codebase. Fix only the selected UI element described below.",
  "claude-code":
    "You are Claude Code working in a large frontend codebase. Fix only the selected UI element described below.",
  codex:
    "You are a coding agent working in a large frontend codebase. Fix only the selected UI element described below.",
};

export function introFor(target: PromptTarget = "generic"): string {
  return INTROS[target];
}
