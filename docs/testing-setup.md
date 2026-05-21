---
name: testing-setup
trigger: model_decision
description: Poffy UI のテストツール構成リファレンス。Vitest、Playwright、Storybook、vitest-axe のセットアップと CI 統合を定義する。
---

# Testing Tools Setup Guide

This document describes how to set up the testing tools used in this project.

## 1. Unit & Component Testing (Vitest + React Testing Library)

We use **Vitest** for its speed and Vite/Rollup compatibility, and **React Testing Library** for testing React components.

### Installation

Dependencies are managed through the root `pnpm-workspace.yaml` catalog. Use
`pnpm install` after dependency changes instead of installing ad hoc versions.

- **vitest**: Test runner.
- **jsdom**: Simulates a browser environment in Node.js.
- **@testing-library/react**: Utilities for testing React components.
- **@testing-library/jest-dom**: Custom matchers (e.g., `toBeInTheDocument`).
- **vitest-axe**: Accessibility violation assertions — **required** in all component tests.

### Configuration (`tooling/configs/vitest.config.ts`)

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'unit',
          environment: 'jsdom',
          globals: true,
          setupFiles: './tests/setup.ts',
          include: [
            'packages/react/src/**/*.test.{ts,tsx}',
            'packages/behavior/src/**/*.test.{ts,tsx}',
          ],
        },
      },
    ],
  },
});
```

### Accessibility Test Pattern

Every component test MUST include an axe assertion:

```ts
import { axe } from 'vitest-axe';

it('has no accessibility violations', async () => {
  const { container } = render(<MyComponent />);
  expect(await axe(container)).toHaveNoViolations();
});
```

---

## 2. End-to-End Testing (Playwright)

We use **Playwright** for E2E testing across different browsers.

### Installation

Playwright is managed through the workspace catalog and root scripts.

### Configuration (`tooling/configs/playwright.config.ts`)

```ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './packages/react/src',
  fullyParallel: true,
  webServer: {
    command: 'pnpm storybook',
    url: 'http://localhost:6006',
    reuseExistingServer: !process.env.CI,
  },
});
```

### Test Authoring Rules

Playwright tests in this repository are primarily used for **visual regression**, **real-browser interaction checks**, and **accessibility audits**.

#### Use the Storybook iframe as the source of truth

Do not build ad-hoc test pages for component verification. Reuse existing stories and visit them directly:

```ts
await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
```

This keeps Playwright tests aligned with the same render surface used in docs and Storybook reviews.

#### Recommended test granularity

Do not try to snapshot every possible state in one test. Split by purpose:

- **Component-level visual guard**: snapshot the component root for local layout regressions such as overflow, border breaks, icon misalignment, or stepper protrusion.
- **Story-level visual guard**: snapshot the full page for stories such as `Sizes`, `Variants`, or state galleries where spacing and arrangement are part of the contract.
- **Interaction check**: perform a real user action in the browser, then assert both behavior and the post-interaction screenshot.
- **Accessibility check**: include at least one axe-based audit in each visual suite.

For most components, start with:

1. One default component-level snapshot
2. One story-level snapshot for sizes or variants
3. One interaction snapshot after a meaningful user action
4. One accessibility test

#### Whole-page vs locator screenshots

Use both, but for different reasons:

- `expect(page).toHaveScreenshot(...)`
  Best when the layout of the entire story matters, such as multiple sizes shown side-by-side.
- `expect(locator).toHaveScreenshot(...)`
  Best when you want low-noise regression protection for a single component instance.

Example:

```ts
const input = page.getByRole('spinbutton');
const root = input.locator('..');

await expect(root).toHaveScreenshot('number-input-default-component.png');
await expect(page).toHaveScreenshot('number-input-sizes.png');
```

Default guidance:

- Use **locator screenshots** for `Default`, focused states, and interaction-after-state cases
- Use **page screenshots** for `Sizes`, `Variants`, and showcase stories

#### Selector rules

Prefer accessible queries:

- `page.getByRole()`
- `page.getByLabel()`
- `page.getByText()`

Avoid brittle CSS selectors when a user-facing query is available.

#### Accessibility pattern

Use `@axe-core/playwright` for browser-based accessibility checks:

```ts
import AxeBuilder from '@axe-core/playwright';

test('should pass accessibility compliance', async ({ page }) => {
  await page.goto('/iframe.html?id=inputs-numberinput--default&viewMode=story');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

#### Snapshot update workflow

When a visual change is intentional:

```bash
pnpm test:vrt:update -- path/to/MyComponent.visual.spec.ts
```

Then review:

1. The updated PNG files in `*.spec.ts-snapshots/`
2. The changed story or component implementation
3. Whether the change is local to the target component or indicates a broader layout regression

Do not update snapshots blindly. A changed snapshot is a code review event, not just test maintenance.

#### Stability rules

- Keep `reducedMotion: 'reduce'` enabled in Playwright config
- Treat VRT as stable-state coverage, not proof that motion occurred
- Verify animation enabling/disabling in unit or browser interaction tests instead of timing screenshots
- Prefer asserting visibility and state instead of using fixed delays
- Snapshot only after the component has reached a stable rendered state
- Keep visual suites focused; avoid combining unrelated stories into one spec file

---

## 3. Visual & Interaction Testing (Storybook)

We use Storybook addons for interaction testing and accessibility checks.

### Installation

Storybook dependencies are managed through the root workspace catalog.

### Configuration (`.storybook/main.ts`)

```ts
const config: StorybookConfig = {
  addons: ['@storybook/addon-docs', '@storybook/addon-a11y', '@storybook/addon-vitest'],
};
export default config;
```

---

## 4. CI Integration (GitHub Actions)

```yaml
- name: Run Unit Tests
  run: pnpm test:unit

- name: Install Playwright Browsers
  run: pnpm exec playwright install --with-deps

- name: Run E2E Tests
  run: pnpm test:e2e
```

---

## 5. Test Coverage

We use **@vitest/coverage-v8** for coverage reports.

### Installation

Coverage dependencies are managed through the root workspace catalog.

### Usage

```bash
pnpm coverage
```

Outputs a summary in the terminal and a detailed HTML report at `coverage/index.html`.
