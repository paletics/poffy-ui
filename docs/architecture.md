---
name: poffy-ui-architecture
trigger: model_decision
description: Architecture overview of the current Poffy UI monorepo.
---

# Project Architecture

## Goal

Poffy UI provides a reusable React UI foundation with:

- typed component APIs
- token-driven styling via Panda CSS
- animation-friendly primitives

## Monorepo Layout

```text
poffy-ui/
  packages/
    behavior/              # @poffy-ui/behavior
      src/
        activation/
        hooks/
          dom/
          measurement/
          media/
          pointer/
          ref/
          scroll/
        listbox/
        accordion/
        calendar/
        clipboard/
        context-menu/
        datetime/
        dropdown/
        file-upload/
        number-input/
        otp-input/
        pagination/
        radio-group/
        scroll-area/
        split-button/
        time/
        toggle-button/
        wheel-picker/
        logic/             # compatibility re-exports only
    react/                 # @poffy-ui/react
      src/
        components/
        hooks/
          overlay/
        providers/
        styled-system/      # Panda generated output
        theme/
        types/
    system/                # @poffy-ui/system
      src/
        theme/
        styled-system/      # Panda generated output
        preset.ts
    types/                 # @poffy-ui/types
      src/
  tooling/
    eslint-config/
    typescript-config/
    configs/               # tool configs (source of truth)
  tests/
  docs/
  .storybook/
  panda.config.ts          # wrapper (loads tooling/configs/panda.config.ts)
  tsup.config.ts           # wrapper (loads tooling/configs/tsup.config.ts)
  vitest.config.ts         # wrapper (loads tooling/configs/vitest.config.ts)
  playwright.config.ts     # wrapper (loads tooling/configs/playwright.config.ts)
  eslint.config.mjs        # wrapper (loads tooling/configs/eslint.config.mjs)
  pnpm-workspace.yaml
```

## Package Responsibilities

- `@poffy-ui/behavior`: shared non-visual hooks and interaction/state helpers
- `@poffy-ui/react`: public React components, React-specific hooks, and exports
- `@poffy-ui/system`: token system, theme exports, CSS output, Panda preset
- `@poffy-ui/types`: shared type utilities (`PrimitiveProps`, intent constants, etc.)

## Shared Behavior Usage

Place code according to these rules:

- Put low-level reusable hooks in `@poffy-ui/behavior/hooks`.
- As shared hooks grow, organize internals under `packages/behavior/src/hooks/<category>/` and keep the public `hooks/index.ts` barrel thin.
- Put feature-specific non-visual behavior under `@poffy-ui/behavior/<feature>` such as
  `@poffy-ui/behavior/accordion`, `@poffy-ui/behavior/calendar`, or `@poffy-ui/behavior/pagination`.
- When a behavior module exposes reusable public types, colocate them in a `*.types.ts` file and re-export them with `export type`.
- Keep `@poffy-ui/behavior/logic` as a compatibility entrypoint only; do not add new source files there.
- Keep component-specific or React adapter hooks in `@poffy-ui/react` near the component or under `packages/react/src/hooks`.
- Do not place Panda recipes, styled components, or product-tier behavior in `@poffy-ui/behavior`.

Examples:

- `useMergeRefs` -> `@poffy-ui/behavior/hooks`
- `useImage` -> `@poffy-ui/behavior/hooks`
- `useAccordionState` -> `@poffy-ui/behavior/accordion`
- `buildPaginationItems` -> `@poffy-ui/behavior/pagination`
- `buildCalendarGrid` / `formatDateISO` -> `@poffy-ui/behavior/calendar`
- `getInitialCalendarMonth` / `getNextCalendarFocusDate` -> `@poffy-ui/behavior/calendar`
- `formatTimeParts` / `parseTimeValue` -> `@poffy-ui/behavior/time`
- `buildTimeClockHourOptions` / `buildTimeUnitRange` -> `@poffy-ui/behavior/time`
- `copyToClipboard` -> `@poffy-ui/behavior/clipboard`
- `guardActivationHandlers` -> `@poffy-ui/behavior/activation`
- `mergeDateAndTime` -> `@poffy-ui/behavior/datetime`
- `useDropdown` -> `@poffy-ui/behavior/dropdown`
- `filterListboxOptions` / enabled-index helpers -> `@poffy-ui/behavior/listbox`
- `useContextMenu` / `useContextMenuTrigger` -> `@poffy-ui/behavior/context-menu`
- `formatFileSize` / `filterAcceptedFiles` -> `@poffy-ui/behavior/file-upload`
- `clampNumberInputValue` -> `@poffy-ui/behavior/number-input`
- `applyOtpInputChange` / `applyOtpPaste` -> `@poffy-ui/behavior/otp-input`
- `useRadioGroupState` -> `@poffy-ui/behavior/radio-group`
- `calcScrollAreaThumb` -> `@poffy-ui/behavior/scroll-area`
- `useScrollArea` -> `@poffy-ui/behavior/scroll-area`
- `useSplitButton` -> `@poffy-ui/behavior/split-button`
- `getNextToggleButtonPressed` -> `@poffy-ui/behavior/toggle-button`
- `normalizeWheelPickerValue` / wheel option helpers -> `@poffy-ui/behavior/wheel-picker`
- `useCalendarNavigation` -> Calendar component-local hook in `@poffy-ui/react`
- DataGrid-only behavior -> tier package, not core behavior

Consumption notes:

- Import shared hooks directly from `@poffy-ui/behavior/hooks` when building reusable internals.
- Import feature behavior from feature subpaths when available (`@poffy-ui/behavior/activation`, `@poffy-ui/behavior/accordion`, `@poffy-ui/behavior/calendar`, `@poffy-ui/behavior/context-menu`, `@poffy-ui/behavior/datetime`, `@poffy-ui/behavior/dropdown`, `@poffy-ui/behavior/file-upload`, `@poffy-ui/behavior/listbox`, `@poffy-ui/behavior/number-input`, `@poffy-ui/behavior/otp-input`, `@poffy-ui/behavior/pagination`, `@poffy-ui/behavior/radio-group`, `@poffy-ui/behavior/scroll-area`, `@poffy-ui/behavior/split-button`, `@poffy-ui/behavior/time`, `@poffy-ui/behavior/toggle-button`).
- Clipboard and wheel-picker behavior are also available from
  `@poffy-ui/behavior/clipboard` and `@poffy-ui/behavior/wheel-picker`.
- `@poffy-ui/react` should not re-export shared behavior hooks. Consumers that need shared hooks should import them from `@poffy-ui/behavior/hooks`.

## Build Pipeline

The root package is a private workspace orchestrator. It is not published and
does not own public `exports`.

Development-only tooling is root-owned. Publishable packages under
`packages/*` should not declare `devDependencies`; build tools such as
`@pandacss/dev`, `tsup`, TypeScript, ESLint, Vitest, and shared tooling
packages belong in the root `devDependencies`. Package scripts may still invoke
those tools because repository development, CI, and release jobs install from
the workspace root.

`pnpm build` is the repository-wide build contract: it runs the build scripts
for every publishable package under `packages/*`. After it completes,
`pnpm check:exports` must be able to validate all package `exports` targets.

Each package build may perform:

1. Panda code generation (`panda codegen`, `panda cssgen`)
2. TS/JS bundling with `tsup`
3. Declaration output via `tsup` or `tsc --emitDeclarationOnly`
4. ESM declaration mirroring from `.d.ts` to `.d.mts` when declarations are
   emitted separately from `tsup`

Published package `exports` use conditional type declarations: ESM `import`
conditions point to `.d.mts` files, while CommonJS `require` conditions point
to `.d.ts` files.

Generated artifacts:

- `packages/react/src/styled-system/`: canonical Panda generated runtime/style helpers for React, Storybook, visual tests, and root-level development tooling
- `packages/system/src/styled-system/`: system package Panda generated runtime/style helpers
- `packages/*/dist/`: package build output for each workspace package

Distribution boundary checks:

- `pnpm check:package-boundaries` verifies that publishable package manifests do
  not reintroduce package-local `devDependencies` or root-owned build tools as
  runtime/peer dependencies.
- `pnpm check:declarations` verifies that published declaration files do not
  leak internal or development-only imports.
- `pnpm check:pack-smoke` packs the publishable packages and type-checks a
  temporary consumer project without repository build tools.

## Public React Surface

`@poffy-ui/react` re-exports the public component groups, hooks, and providers
from `packages/react/src/index.ts`. Public subpath exports are available for:

- `@poffy-ui/react/a11y`
- `@poffy-ui/react/animations`
- `@poffy-ui/react/layout`
- `@poffy-ui/react/typography`
- `@poffy-ui/react/inputs`
- `@poffy-ui/react/data-display`
- `@poffy-ui/react/feedback`
- `@poffy-ui/react/navigation`
- `@poffy-ui/react/overlay`
- `@poffy-ui/react/surfaces`
- `@poffy-ui/react/media`
- `@poffy-ui/react/tree-view`

Other public code exports:

- `@poffy-ui/types`
- `@poffy-ui/system`
- `@poffy-ui/system/preset`
- `@poffy-ui/behavior`
- `@poffy-ui/behavior/activation`
- `@poffy-ui/behavior/hooks`
- `@poffy-ui/behavior/accordion`
- `@poffy-ui/behavior/calendar`
- `@poffy-ui/behavior/clipboard`
- `@poffy-ui/behavior/context-menu`
- `@poffy-ui/behavior/datetime`
- `@poffy-ui/behavior/dropdown`
- `@poffy-ui/behavior/file-upload`
- `@poffy-ui/behavior/listbox`
- `@poffy-ui/behavior/number-input`
- `@poffy-ui/behavior/otp-input`
- `@poffy-ui/behavior/pagination`
- `@poffy-ui/behavior/radio-group`
- `@poffy-ui/behavior/scroll-area`
- `@poffy-ui/behavior/split-button`
- `@poffy-ui/behavior/time`
- `@poffy-ui/behavior/toggle-button`
- `@poffy-ui/behavior/wheel-picker`
- `@poffy-ui/behavior/logic` (compatibility-only)

Public asset and metadata exports:

- `@poffy-ui/react/styles.css`
- `@poffy-ui/react/style/poffy-ui.min.css`
- `@poffy-ui/react/package.json`
- `@poffy-ui/system/styles.css`

## Conventions

- Prefer named exports only.
- Keep component APIs composable (slot/asChild patterns where relevant).
- Keep tokens in system package; avoid hard-coded style constants in components.
- Keep shared interaction logic out of `@poffy-ui/react` when it has no styled UI dependency.
- Do not edit generated files under `packages/react/src/styled-system/` or `packages/system/src/styled-system/`.
