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
        collapsible/
        calendar/
        clipboard/
        combobox/
        command-menu/
        context-menu/
        date/
        datetime/
        dropdown/
        file-upload/
        json/
        markdown/
        multi-select/
        number-input/
        otp-input/
        pagination/
        radio-group/
        range-slider/
        scroll-area/
        split-button/
        time/
        toggle-button/
        tree-view/
        wheel-picker/
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
- `@poffy-ui/behavior/screen-composer`: serializable screen-schema validation and immutable node registry composition; it has no React or tier dependency.
- `@poffy-ui/react/screen-composer`: maps a schema-validated screen document to Core components. Optional extensions contribute their own definitions and renderers; Core never imports an extension package. The host explicitly composes all installed extensions and owns action dispatch.

See [Screen Composer Contract](./screen-composer.md) for persistence, authority,
data-binding, form, layout, and release-boundary decisions.

## Shared Behavior Usage

Place code according to these rules:

- Put low-level reusable hooks in `@poffy-ui/behavior/hooks`.
- As shared hooks grow, organize internals under `packages/behavior/src/hooks/<category>/` and keep the public `hooks/index.ts` barrel thin.
- Put feature-specific non-visual behavior under `@poffy-ui/behavior/<feature>` such as
  `@poffy-ui/behavior/accordion`, `@poffy-ui/behavior/calendar`, or `@poffy-ui/behavior/pagination`.
- When a behavior module exposes reusable public types, colocate them in a `*.types.ts` file and re-export them with `export type`.
- Keep component-specific or React adapter hooks in `@poffy-ui/react` near the component or under `packages/react/src/hooks`.
- Do not place Panda recipes, styled components, or product-tier behavior in `@poffy-ui/behavior`.

Examples:

- `useMergeRefs` -> `@poffy-ui/behavior/hooks`
- `useImage` -> `@poffy-ui/behavior/hooks`
- `useAccordionState` -> `@poffy-ui/behavior/accordion`
- `useCollapsibleState` -> `@poffy-ui/behavior/collapsible`
- `filterCommandMenuItems` / `useCommandMenuState` / command-menu keyboard and shortcut ownership
  helpers -> `@poffy-ui/behavior/command-menu`
- `buildPaginationItems` -> `@poffy-ui/behavior/pagination`
- `buildCalendarGrid` -> `@poffy-ui/behavior/calendar`
- `getInitialCalendarMonth` / `getNextCalendarFocusDate` -> `@poffy-ui/behavior/calendar`
- `formatDateISO` / `isSameDay` / `compareDateDay` / `isDateUnavailable` -> `@poffy-ui/behavior/date`
- `useDatePickerState` -> `@poffy-ui/behavior/date/react`
- `formatTimeParts` / `parseTimeValue` / `compareTimeParts` / `isTimeUnavailable` -> `@poffy-ui/behavior/time`
- `buildTimeClockHourOptions` / `buildTimeUnitRange` -> `@poffy-ui/behavior/time`
- `copyToClipboard` -> `@poffy-ui/behavior/clipboard`
- `guardActivationHandlers` -> `@poffy-ui/behavior/activation`
- `mergeDateAndTime` / `formatLocalDateTimeValue` -> `@poffy-ui/behavior/datetime`
- `useDropdown` -> `@poffy-ui/behavior/dropdown`
- `filterListboxOptions` / enabled-index helpers -> `@poffy-ui/behavior/listbox`
- `useListboxSelectState` / selection identity and keyboard ownership -> `@poffy-ui/behavior/listbox/react`
- `useComboBoxState` / ComboBox keyboard intent -> `@poffy-ui/behavior/combobox`
- `useContextMenu` / `useContextMenuTrigger` -> `@poffy-ui/behavior/context-menu`
- `formatFileSize` / `filterAcceptedFiles` -> `@poffy-ui/behavior/file-upload`
- `useFileUploadState` / file selection and rejection ownership -> `@poffy-ui/behavior/file-upload/react`
- `parseMarkdown` / `sanitizeMarkdownUrl` -> `@poffy-ui/behavior/markdown`
- `serializeJson` -> `@poffy-ui/behavior/json`
- `useMultiSelectInteractionState` / MultiSelect keyboard intent -> `@poffy-ui/behavior/multi-select`
- `clampNumberInputValue` -> `@poffy-ui/behavior/number-input`
- `applyOtpInputChange` / `applyOtpPaste` -> `@poffy-ui/behavior/otp-input`
- `useOtpInputState` -> `@poffy-ui/behavior/otp-input/react`
- `useRadioGroupState` -> `@poffy-ui/behavior/radio-group`
- `normalizeRangeSliderValue` / range-slider helpers -> `@poffy-ui/behavior/range-slider`
- `useRangeSliderState` -> `@poffy-ui/behavior/range-slider/react`
- `calcScrollAreaThumb` -> `@poffy-ui/behavior/scroll-area`
- `useScrollArea` -> `@poffy-ui/behavior/scroll-area`
- `useSplitButton` -> `@poffy-ui/behavior/split-button`
- `getNextToggleButtonPressed` -> `@poffy-ui/behavior/toggle-button`
- `useTreeViewState` / TreeView keyboard intent -> `@poffy-ui/behavior/tree-view`
- `normalizeWheelPickerValue` / wheel option helpers -> `@poffy-ui/behavior/wheel-picker`
- `useWheelPickerState` -> `@poffy-ui/behavior/wheel-picker/react`
- `useCalendarNavigation` -> Calendar component-local hook in `@poffy-ui/react`
- DataGrid-only behavior -> tier package, not core behavior

Consumption notes:

- Import shared hooks directly from `@poffy-ui/behavior/hooks` when building reusable internals.
- Import feature behavior from feature subpaths when available (`@poffy-ui/behavior/activation`, `@poffy-ui/behavior/accordion`, `@poffy-ui/behavior/calendar`, `@poffy-ui/behavior/clipboard`, `@poffy-ui/behavior/collapsible`, `@poffy-ui/behavior/combobox`, `@poffy-ui/behavior/command-menu`, `@poffy-ui/behavior/context-menu`, `@poffy-ui/behavior/date`, `@poffy-ui/behavior/datetime`, `@poffy-ui/behavior/dropdown`, `@poffy-ui/behavior/file-upload`, `@poffy-ui/behavior/json`, `@poffy-ui/behavior/listbox`, `@poffy-ui/behavior/markdown`, `@poffy-ui/behavior/multi-select`, `@poffy-ui/behavior/number-input`, `@poffy-ui/behavior/otp-input`, `@poffy-ui/behavior/pagination`, `@poffy-ui/behavior/radio-group`, `@poffy-ui/behavior/range-slider`, `@poffy-ui/behavior/scroll-area`, `@poffy-ui/behavior/split-button`, `@poffy-ui/behavior/time`, `@poffy-ui/behavior/toggle-button`, `@poffy-ui/behavior/tree-view`, `@poffy-ui/behavior/wheel-picker`).
- Feature utility subpaths remain server-safe. Import React state hooks from the
  matching `/react` subpath; importing a hook must not turn the utility entry
  into a React Client Component boundary.
- Import date utilities such as `formatDateISO` and `isSameDay` from
  `@poffy-ui/behavior/date`; calendar-specific grid and selection behavior
  remains under `@poffy-ui/behavior/calendar`.
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
- `@poffy-ui/react/ssr`
- `@poffy-ui/react/providers`
- `@poffy-ui/react/hooks`

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
- `@poffy-ui/behavior/collapsible`
- `@poffy-ui/behavior/command-menu`
- `@poffy-ui/behavior/context-menu`
- `@poffy-ui/behavior/date`
- `@poffy-ui/behavior/date/react`
- `@poffy-ui/behavior/datetime`
- `@poffy-ui/behavior/dropdown`
- `@poffy-ui/behavior/file-upload`
- `@poffy-ui/behavior/file-upload/react`
- `@poffy-ui/behavior/listbox`
- `@poffy-ui/behavior/listbox/react`
- `@poffy-ui/behavior/markdown`
- `@poffy-ui/behavior/number-input`
- `@poffy-ui/behavior/otp-input`
- `@poffy-ui/behavior/otp-input/react`
- `@poffy-ui/behavior/pagination`
- `@poffy-ui/behavior/radio-group`
- `@poffy-ui/behavior/range-slider`
- `@poffy-ui/behavior/range-slider/react`
- `@poffy-ui/behavior/scroll-area`
- `@poffy-ui/behavior/split-button`
- `@poffy-ui/behavior/time`
- `@poffy-ui/behavior/toggle-button`
- `@poffy-ui/behavior/wheel-picker`
- `@poffy-ui/behavior/wheel-picker/react`

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
