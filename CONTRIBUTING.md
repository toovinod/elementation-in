# Contributing to Elementation

Thanks for your interest in improving Elementation! This guide covers local
setup, conventions, and the pull-request flow.

## Prerequisites

- **Node.js** >= 20 (see `.nvmrc` — Node 22 recommended)
- **pnpm** 10 (`corepack enable` to match the pinned version)

## Local setup

```bash
git clone https://github.com/elementation/elementation.git
cd elementation
pnpm install
pnpm db:generate      # generate the Prisma client (apps/web)
pnpm dev              # starts the web app on http://localhost:3000
```

## Monorepo layout

| Path | Purpose |
| --- | --- |
| `apps/web` | Next.js dashboard, marketing site, playground, docs, API |
| `packages/core` | Shared types, zod capture schema, storage abstraction |
| `packages/source-map` | Read `data-elementation-*` source metadata |
| `packages/prompt-engine` | Turn a capture into an AI-ready prompt |
| `packages/sdk` | The `<ElementationOverlay />` overlay |
| `tooling/*` | Shared TypeScript / ESLint / Tailwind config |

## Quality gates

Run these before opening a PR (CI runs the same):

```bash
pnpm lint
pnpm check-types
pnpm test
pnpm build
```

## Commit conventions

We use [Conventional Commits](https://www.conventionalcommits.org/). Commit
messages are validated by commitlint. Examples:

```
feat(sdk): add keyboard shortcut to toggle inspect mode
fix(prompt-engine): escape backticks in element text
docs: document the REST API endpoints
```

## Changesets

User-facing changes to a published package require a changeset:

```bash
pnpm changeset
```

Pick the affected packages and a semver bump, and describe the change. The
release workflow consumes these to version and publish.

## Pull requests

1. Branch from `main` (`feat/...`, `fix/...`, `docs/...`).
2. Keep PRs focused; one concern per PR.
3. Add or update tests for new behavior.
4. Ensure all quality gates pass.
5. Add a changeset if a package's public behavior changed.

By contributing you agree that your contributions are licensed under the MIT
License.
