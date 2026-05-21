---
name: contributing
trigger: model_decision
description: Contribution workflow for the Poffy UI monorepo.
---

# Contributing to Poffy UI

Thanks for contributing.

## Getting Started

1. Fork the repository on GitHub.
2. Clone your fork:

```bash
git clone https://github.com/your-username/poffy-ui.git
cd poffy-ui
```

3. Install dependencies:

```bash
pnpm install
```

## Development Workflow

1. Create a branch:

```bash
git checkout -b feature/my-change
```

2. Make changes.
3. Run checks:

```bash
pnpm test
pnpm test:e2e
pnpm lint
```

4. Commit changes:

```bash
git commit -m "feat: add my change"
```

## Encoding

All source, documentation, and configuration files must be UTF-8. Do not save files as Shift_JIS, CP932, or UTF-8 with mojibake.

Before opening a pull request, run:

```bash
pnpm check:encoding
```

If the check reports mojibake markers, fix the corrupted source text rather than preserving the broken characters.

## Pull Request

1. Push your branch:

```bash
git push origin feature/my-change
```

2. Open a Pull Request and complete the template.

## Commit Message

Commitlint is enabled. Use Conventional Commits.

Examples:

- `feat: add button variant`
- `fix(input): prevent invalid blur state`
- `docs: update setup guide`

## Release Process

Changesets is used for versioning.

All published `@poffy-ui/*` packages in this repo share the same version.

```bash
pnpm changeset
pnpm changeset:version
```

Publishing is triggered by pushing a git tag matching `v*` (for example `v0.1.0`).

## License

By contributing, you agree your contributions are licensed under Apache-2.0.
