---
name: tech-stack
trigger: always_on
---

# Technology Stack & Versions

## Runtime & Language

- **Runtime:** Node.js v20+
- **Package Manager:** pnpm (enforce `pnpm-workspace.yaml` and lockfiles)
- **Language:** TypeScript v5.9+ (Strict mode)
- **Framework:** React v19.2+ (v18 compatibility maintained)

## Styling

- **Panda CSS:** `@pandacss/dev` v1.11+ — zero-runtime, build-time CSS generation
- **CSS Variable Prefix:** `--poffy-` (configured in `panda.config.ts`)
- **Design System:** Poffy UI (Silver Ratio spacing scale)

## Component Primitives

- **Radix UI Slot:** `@radix-ui/react-slot` — polymorphic `asChild` pattern
- **Animation:** `motion` v12+ (Motion for React, formerly Framer Motion)

## Testing

- **Unit / Component:** Vitest + React Testing Library + jsdom
- **Accessibility:** `vitest-axe` — required in all component tests
- **E2E:** Playwright
- **Visual / Interaction:** Storybook v10+ with `@storybook/addon-vitest`, `addon-a11y`

## Documentation & Development

- **Storybook:** v10+ (`@storybook/react-vite`)
- **Versioning:** Changesets (`@changesets/cli`)
- **Builder:** tsup (library bundling)
- **Linting / Formatting:** ESLint + Prettier + Commitlint + Husky
