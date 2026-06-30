<div align="center">

# Elementation

### Select any UI element. Turn feedback into a precise AI coding prompt.

[Website](https://elementation.in) · [Docs](https://elementation.in/docs) · [Playground](https://elementation.in/playground)

[![CI](https://github.com/elementation/elementation/actions/workflows/ci.yml/badge.svg)](https://github.com/elementation/elementation/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](./LICENSE)
[![Built with Turborepo](https://img.shields.io/badge/built%20with-Turborepo-cc00ff.svg)](https://turborepo.com)

</div>

---

**Elementation** is a developer tool for designer-developers and AI-assisted coding
teams. Open your app in development, click any UI element — a button, card, input,
navbar, or block of text — write plain feedback like _"make this button smaller and
use the brand color,"_ and Elementation generates a complete, AI-ready coding prompt
with the exact UI context: DOM metadata, computed styles, CSS selector, source file
location, and implementation instructions.

The goal: **stop sending vague prompts** to AI coding agents, and **stop them editing
the wrong part of a large codebase.**

## How it works

1. Add the overlay SDK to your app (`<ElementationOverlay />`, dev-only).
2. Click **Inspect** in the floating toolbar.
3. Hover to highlight any element; click to select it.
4. Write feedback in the popover that opens next to it.
5. Elementation captures the element (tag, text, selector, classes, computed styles,
   bounding box, page URL, viewport, React component name, and source file/line when
   available) and generates a structured prompt.
6. **Copy Prompt** → paste into Cursor, Claude Code, Codex, or any agent.

## Monorepo

A [Turborepo](https://turborepo.com) + [pnpm](https://pnpm.io) monorepo, strict
TypeScript throughout.

```
apps/
  web/                  Next.js 16 app — landing, dashboard, playground, docs, REST API
packages/
  core/                 Shared types, zod capture schema, storage abstraction
  source-map/           Read data-elementation-* source metadata (+ React name fallback)
  prompt-engine/        Turn a capture into an AI-ready prompt
  sdk/                  The <ElementationOverlay /> overlay (Shadow DOM, near-zero deps)
tooling/
  typescript-config/    Shared strict tsconfig bases
  eslint-config/        Shared ESLint flat config
  tailwind-config/      Shared Tailwind v4 design tokens
```

### Stack

Next.js 16 · React 19 · TypeScript 5 (strict) · Tailwind CSS v4 · Zustand · Prisma +
SQLite (Postgres-ready) · Zod · Vitest · Playwright · Changesets.

## Quickstart

```bash
# Requires Node >= 20 (see .nvmrc) and pnpm 10 (corepack enable)
pnpm install
pnpm db:generate     # generate the Prisma client
pnpm dev             # http://localhost:3000
```

Then open [`/playground`](http://localhost:3000/playground), click **Inspect**, and
select an element to generate your first prompt — no external app required.

### Scripts

| Command | Description |
| --- | --- |
| `pnpm dev` | Run the web app in development |
| `pnpm build` | Build every package and the app |
| `pnpm lint` | Lint the workspace |
| `pnpm check-types` | Type-check the workspace |
| `pnpm test` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run end-to-end tests (Playwright) |
| `pnpm db:generate` | Generate the Prisma client |
| `pnpm db:push` | Push the schema to the local SQLite database |
| `pnpm changeset` | Record a changeset for a release |

## Installing the SDK

```tsx
import { ElementationOverlay } from "@elementation/sdk";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        {process.env.NODE_ENV === "development" && (
          <ElementationOverlay projectKey="YOUR_PROJECT_KEY" apiUrl="https://elementation.in/api" />
        )}
      </body>
    </html>
  );
}
```

The overlay renders into an isolated Shadow DOM root, so it never inherits or leaks
styles, and it never selects itself. Without an `apiUrl` it persists annotations to
`localStorage`; with one, it syncs them to your dashboard.

## Data & persistence

The MVP uses **Prisma + SQLite** — a single local file, no external services. A storage
abstraction (`@elementation/core/storage`) exposes a `localStorage` adapter by default
and an HTTP adapter when an `apiUrl` is provided. Moving to PostgreSQL for production is
a `provider` swap plus a `DATABASE_URL`.

## MVP limitations

- Source file/line metadata comes from `data-elementation-*` attributes (no automatic
  injection yet — a Babel/SWC plugin is on the roadmap).
- React component-name resolution is best-effort (DOM data attributes are authoritative).
- SQLite is intended for local/self-hosted use; production should use Postgres.
- No authentication or multi-tenant workspaces yet.

## Roadmap

- Babel/SWC/Vite plugin for automatic source-file metadata
- MCP server (let agents read annotations directly — no copy-paste)
- Real database + auth + team workspaces
- Screenshot capture and Figma integration
- GitHub issue creation
- First-class Cursor / Codex / Claude Code integrations
- Browser extension

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md). By contributing you agree to the
[Code of Conduct](./CODE_OF_CONDUCT.md).

## License

[MIT](./LICENSE) © Elementation
