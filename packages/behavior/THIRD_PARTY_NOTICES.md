# Third Party Notices

This document summarizes third-party open source dependencies used by Poffy UI.

Poffy UI itself is licensed under Apache-2.0. The dependency license check is
documented in `docs/license-review.md` and can be rerun with:

```sh
pnpm check:licenses
```

## Current Review Result

No dependency with a license that prohibits commercial use was found in the
installed dependency tree reviewed on 2026-05-19.

The automated check currently rejects license declarations matching AGPL, GPL,
LGPL, SSPL, Commons Clause, NonCommercial / CC-BY-NC, PolyForm Noncommercial,
Business Source License / BSL / BUSL, and proprietary or no-commercial-use
wording.

## Published Package Dependencies

These are the main third-party dependencies declared by the published packages.
Exact resolved versions may change with the lockfile.

| Package                | Current resolved version | License | Usage                                                |
| ---------------------- | -----------------------: | ------- | ---------------------------------------------------- |
| `@floating-ui/react`   |                `0.27.19` | MIT     | Runtime positioning and overlay behavior             |
| `@pandacss/dev`        |                 `1.11.1` | MIT     | Panda CSS preset/types and generated styling support |
| `@radix-ui/react-slot` |                  `1.2.4` | MIT     | Polymorphic slot composition                         |
| `motion`               |                `12.38.0` | MIT     | Animation primitives                                 |
| `prismjs`              |                 `1.30.0` | MIT     | Code highlighting                                    |
| `react`                |                 `19.2.5` | MIT     | Peer dependency                                      |
| `react-dom`            |                 `19.2.5` | MIT     | Peer dependency                                      |
| `tslib`                |                  `2.8.1` | 0BSD    | TypeScript runtime helpers                           |

## Full Dependency Tree Summary

The installed dependency tree currently resolves to these license declarations:

| License declaration    | Package count |
| ---------------------- | ------------: |
| MIT                    |           790 |
| Apache-2.0             |            33 |
| ISC                    |            33 |
| BSD-2-Clause           |            18 |
| MPL-2.0                |            16 |
| BSD-3-Clause           |            13 |
| Apache-2.0 AND MIT     |             6 |
| BlueOak-1.0.0          |             5 |
| MIT-0                  |             4 |
| CC0-1.0                |             2 |
| 0BSD                   |             1 |
| CC-BY-4.0              |             1 |
| Python-2.0             |             1 |
| SEE LICENSE IN LICENSE |             1 |

## Review Notes

The `MPL-2.0`, `CC-BY-4.0`, `Python-2.0`, and `SEE LICENSE IN LICENSE`
entries are tracked as review-required but not commercial-use blockers in
`docs/license-review.md`.

The generated package outputs were checked for the review-required dependency
names and license strings. No matches were found in the generated `dist`
outputs, so those dependencies are not currently vendored into the published
artifacts.

If dependencies are bundled into published artifacts in the future, regenerate
this notice and review whether full license text or additional attribution must
be included with the distributed package.
