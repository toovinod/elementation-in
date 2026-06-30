---
"@elementation/core": minor
"@elementation/source-map": minor
"@elementation/prompt-engine": minor
"@elementation/sdk": minor
---

Initial MVP release.

- `@elementation/sdk` — the `<ElementationOverlay />` overlay: Shadow-DOM isolation, inspect mode, hover/select highlighting, feedback popover, prompt panel, and the capture pipeline.
- `@elementation/prompt-engine` — structured, AI-ready prompt generation with task, constraints, and acceptance criteria.
- `@elementation/source-map` — `data-elementation-*` source resolution with a best-effort React fiber fallback.
- `@elementation/core` — the `ElementationCapture` schema, project/annotation types, and the storage abstraction (localStorage + HTTP adapters).
