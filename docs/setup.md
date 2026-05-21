---
name: environment-setup
trigger: model_decision
description: Setup guide for the Poffy UI monorepo (pnpm workspace).
---

# Environment Setup Guide

This document explains how to run the current monorepo (`poffy-ui`).

## Prerequisites

- Node.js 20 or later
- pnpm 10 or later
- Git

## 1. Clone

```bash
git clone https://github.com/paletics/poffy-ui.git
cd poffy-ui
```

## 2. Install Dependencies

```bash
pnpm install
```

Run installs from the workspace root. Development-only tools are intentionally
owned by the root package, so package-local installs under `packages/*` are not
the supported development workflow.

## 3. Generate Panda CSS Artifacts

The root Panda config is wired to the React package output. Panda codegen writes
the canonical generated helpers under `packages/react/src/styled-system/`.
Package builds may also generate package-local helpers such as
`packages/system/src/styled-system/`.

```bash
pnpm prepare:codegen
pnpm prepare:css:codegen
```

## 4. Build

Build all publishable workspace packages:

```bash
pnpm build
```

After building, package export targets can be validated with:

```bash
pnpm check:exports
```

## Development Commands

- Storybook: `pnpm storybook`
- Unit/browser/storybook tests: `pnpm test`
- Unit tests only: `pnpm test:unit`
- Browser component tests: `pnpm test:browser` (reserved for `*.browser.test.tsx`; currently allowed to pass with no files)
- Storybook tests: `pnpm test:storybook`
- E2E tests: `pnpm test:e2e`
- Visual regression tests: `pnpm test:vrt`
- Lint: `pnpm lint`
- Format: `pnpm format`
- Encoding check: `pnpm check:encoding`
- Package boundary check: `pnpm check:package-boundaries`

## Notes

- This repository is a monorepo (`packages/*`, `tooling/*`).
- Publishable packages should keep `devDependencies` empty; root
  `devDependencies` own Panda, TypeScript, tsup, lint, and test tooling.
- Do not edit `packages/react/src/styled-system/` or
  `packages/system/src/styled-system/` files manually. They are generated.
