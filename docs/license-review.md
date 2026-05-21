# License Review

This document records the current license review policy for Poffy UI packages.

## Current Result

No dependency with a license that prohibits commercial use was found.

The current automated check is:

```sh
pnpm check:licenses
```

It checks workspace `package.json` files and installed dependency metadata under
`node_modules/.pnpm`. The check fails only for prohibited or strongly restricted
license declarations.

Third-party dependency notices are recorded in `THIRD_PARTY_NOTICES.md`.

## Prohibited Licenses

The CI check fails on license declarations matching these categories:

- `AGPL`
- `GPL`
- `LGPL`
- `SSPL`
- `Commons Clause`
- `NonCommercial` / `CC-BY-NC`
- `PolyForm Noncommercial`
- `Business Source License` / `BSL` / `BUSL`
- `Proprietary`, `commercial use`, or `no commercial` wording

## Review Required But Not Blocked

These licenses are not treated as commercial-use blockers, but they should be
reviewed when they are included in distributed artifacts or modified and
redistributed:

- `MPL-2.0`
- `CC-BY-4.0`
- `Python-2.0`
- `SEE LICENSE IN LICENSE`

Current examples observed in the dependency tree:

| Package                            | License                  | Notes                                       |
| ---------------------------------- | ------------------------ | ------------------------------------------- |
| `@axe-core/playwright`, `axe-core` | `MPL-2.0`                | Test and accessibility tooling.             |
| `lightningcss`, `lightningcss-*`   | `MPL-2.0`                | Build tooling and platform packages.        |
| `caniuse-lite`                     | `CC-BY-4.0`              | Browser support data used by build tooling. |
| `argparse`                         | `Python-2.0`             | Transitive CLI dependency.                  |
| `spawndamnit`                      | `SEE LICENSE IN LICENSE` | LICENSE text is Apache-2.0-style.           |

## Published Artifacts

Generated package artifacts were checked for the reviewed dependency names and
license strings:

```sh
rg -n -i "axe-core|@axe-core/playwright|lightningcss|caniuse-lite|argparse|spawndamnit|MPL-2.0|CC-BY-4.0|Python-2.0|SEE LICENSE" dist packages/react/dist packages/behavior/dist packages/system/dist packages/types/dist
```

No matches were found in the generated `dist` outputs.

## OSS Audit Warnings

The broader OSS audit is:

```sh
pnpm oss:audit
```

It treats secret-like content and sensitive paths as failures, and reports
review-only warnings for local development URLs and binary assets.

Current reviewed warnings:

| Warning        | Current scope                                                                                              | Review result                                                                                                                                                                                                 |
| -------------- | ---------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Localhost URLs | `docs/testing-setup.md`, `tooling/configs/playwright.config.ts`                                            | Expected local test and Storybook server references. These are not credentials or internal production endpoints.                                                                                              |
| Binary assets  | 371 Playwright visual regression PNG snapshots under `packages/react/src/components/**/tests/*-snapshots/` | Generated from Poffy UI Storybook stories in this repository. They are test baselines, not third-party media assets, and are not included in package tarballs because published packages include only `dist`. |

If a future binary asset is not generated from repository-owned stories or
tests, record its source, license, and attribution before publishing it.

## Package Metadata Checks

The package export check is:

```sh
pnpm check:exports
```

It verifies that package `exports`, `main`, `module`, `types`, and `bin` targets
point to existing files. This catches stale subpath exports before publishing.
