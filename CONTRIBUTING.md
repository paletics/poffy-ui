# Contributing to Poffy UI

Thanks for contributing.

## Quick Start

```bash
pnpm install
pnpm build
pnpm test
pnpm storybook
```

More docs:

- `docs/README.md`

## Development Workflow

1. Create a branch:

```bash
git checkout -b feat/my-change
```

2. Make changes.
3. Run checks:

```bash
pnpm lint
pnpm test
pnpm check:encoding
pnpm check:tier
```

CI also runs a secret scan (gitleaks) on pull requests and pushes to `main`.

4. Commit using Conventional Commits (Commitlint is enabled):

- `feat: ...`
- `fix: ...`
- `docs: ...`

## Versioning / Releases

Changesets is used for versioning.

- All published `@poffy-ui/*` packages in this repo share the same version.
- Publishing is triggered by pushing a git tag matching `v*` (for example `v0.1.0`).

Typical flow:

```bash
pnpm changeset
pnpm changeset:version
git tag vX.Y.Z
git push origin vX.Y.Z
```

## Security

If you find a vulnerability, please follow `SECURITY.md` (do not open a public issue).
