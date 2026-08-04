---
name: poffy-ui-design-system
trigger: model_decision
description: Poffy UI のトークン参照構文、2層トークンアーキテクチャ、Silver Ratio スペーシングスケールの権威ある定義。AIが生成するコードのトークン構文ミスを防ぐために必ず参照すること。
---

# Design System Reference

This document defines the **authoritative rules** for using design tokens in Poffy UI.
It exists to prevent systematic mistakes — particularly in AI-generated code.

---

## 1. Token Reference Syntax in Panda CSS

There are exactly **three valid ways** to reference a token. Using the wrong form
produces literal invalid CSS that browsers silently ignore.

### In `css()` / JSX style props — use the **shorthand key**

The CSS property already maps to the right scale, so just pass the key:

```ts
css({ gap: 'md' }); // ✅ → var(--poffy-spacing-md)
css({ px: 'lg' }); // ✅ → var(--poffy-spacing-lg)
css({ fontSize: 'sm' }); // ✅ → var(--poffy-font-sizes-sm)
css({ color: 'blue.500' }); // ✅ → var(--poffy-colors-blue-500)
```

### In recipe variant values — use **`{token.path}`** (curly braces)

Inside `defineRecipe` / `cva` / `sva` variant objects, Panda CSS does **not** apply
utility mappings. You must use the explicit token-path syntax with curly braces:

```ts
// ✅ Correct
gap: {
  sm: {
    gap: '{spacing.sm}';
  }
}
gap: {
  md: {
    gap: '{spacing.md}';
  }
}
padding: {
  base: {
    padding: '{spacing.base}';
  }
}
color: {
  primary: {
    color: '{colors.brand.primary}';
  }
}

// ❌ Wrong — outputs literal "spacing.sm" as CSS value (browser ignores it)
gap: {
  sm: {
    gap: 'spacing.sm';
  }
}

// ❌ Wrong — shorthand only works in utility context, not raw recipe CSS
gap: {
  sm: {
    gap: 'sm';
  }
}
```

### In recipe `base` — same rule as variant values

```ts
base: {
  gap: '{spacing.md}',   // ✅
  gap: 'spacing.md',     // ❌
}
```

### Quick Reference

| Context                       | Correct syntax  | Example               |
| ----------------------------- | --------------- | --------------------- |
| `css()` / style props         | shorthand key   | `gap: 'md'`           |
| recipe `base`                 | `{token.path}`  | `gap: '{spacing.md}'` |
| recipe variant value          | `{token.path}`  | `gap: '{spacing.md}'` |
| `token()` function (JS value) | dot-path string | `token('spacing.md')` |

---

## 2. The Two-Tier Token Architecture

```
baseTokens (src/theme/tokens.ts)
  └─ primitive values (Silver Ratio for spacing/sizing; readability scale for typography)
       ↓  mapped via defineTokens()
tokens (src/theme/tokensConfig.ts)
  └─ Panda CSS format → generates CSS variables
       ↓  referenced as
{spacing.md} in recipes  →  var(--poffy-spacing-md)  →  0.707rem
```

**Rule:** Never hardcode raw values (`'0.707rem'`) in recipes. Always reference a token.

---

## 3. Silver Ratio Spacing Scale

| Token key | Value              | CSS variable                |
| --------- | ------------------ | --------------------------- |
| `2xs`     | 0.25rem (4px)      | `var(--poffy-spacing-2xs)`  |
| `xs`      | 0.353rem (~5.6px)  | `var(--poffy-spacing-xs)`   |
| `sm`      | 0.5rem (8px)       | `var(--poffy-spacing-sm)`   |
| `md`      | 0.707rem (~11.3px) | `var(--poffy-spacing-md)`   |
| `base`    | 1rem (16px)        | `var(--poffy-spacing-base)` |
| `lg`      | 1.414rem (~22.6px) | `var(--poffy-spacing-lg)`   |
| `xl`      | 2rem (32px)        | `var(--poffy-spacing-xl)`   |
| `2xl`     | 2.828rem (~45.2px) | `var(--poffy-spacing-2xl)`  |
| `3xl`     | 4rem (64px)        | `var(--poffy-spacing-3xl)`  |

The multiplier between adjacent steps is **√2 ≈ 1.414** (Silver Ratio).

Typography is intentionally independent of the spacing scale. Use `2xs` (12px)
for compact metadata, `xs` (13px) for captions, `sm` (14px) for secondary text,
`md` (16px) for body text, and `lg`–`4xl` (18–36px) for headings and display text.

## 3.1 Sizing Scale

Use `sizes.*` tokens for component dimensions and constrained content widths.
`sizes.full` is the canonical full-size token for recipe values that should
generate `100%`.

| Token key         | Value | CSS variable              |
| ----------------- | ----- | ------------------------- |
| `full`            | 100%  | `var(--poffy-sizes-full)` |
| `sm` / `ratio.sm` | 11rem | `var(--poffy-sizes-sm)`   |
| `md` / `ratio.md` | 16rem | `var(--poffy-sizes-md)`   |
| `lg` / `ratio.lg` | 22rem | `var(--poffy-sizes-lg)`   |
| `xl`              | 32rem | `var(--poffy-sizes-xl)`   |

Additional generated sizing tokens:

| Token key  | Value     | CSS variable                  |
| ---------- | --------- | ----------------------------- |
| `silver.1` | 1rem      | `var(--poffy-sizes-silver-1)` |
| `silver.2` | 2rem      | `var(--poffy-sizes-silver-2)` |
| `silver.3` | 4rem      | `var(--poffy-sizes-silver-3)` |
| `silver.4` | 8rem      | `var(--poffy-sizes-silver-4)` |
| `silver.5` | 16rem     | `var(--poffy-sizes-silver-5)` |
| `root.1`   | 1.414rem  | `var(--poffy-sizes-root-1)`   |
| `root.2`   | 2.828rem  | `var(--poffy-sizes-root-2)`   |
| `root.3`   | 5.656rem  | `var(--poffy-sizes-root-3)`   |
| `root.4`   | 11.312rem | `var(--poffy-sizes-root-4)`   |

---

## 3.2 Font Family Tokens

Use `fonts.*` tokens for font family assignments in recipes. `fonts.heading`
currently maps to the same system stack as `fonts.body`, but keeps heading
typography semantically distinct for future brand overrides.

| Token key | CSS variable                 |
| --------- | ---------------------------- |
| `body`    | `var(--poffy-fonts-body)`    |
| `heading` | `var(--poffy-fonts-heading)` |

The default stack includes common Japanese system fonts and Noto Sans CJK JP
fallbacks. Consumers that render CJK text must make at least one matching font
available in their runtime environment. Poffy UI does not bundle font files.
The repository browser-test environment installs `fonts-noto-cjk` so localized
stories fail visibly if the fallback contract regresses.

---

## 4. Canonical Recipe Example

```ts
import { defineRecipe } from '@pandacss/dev';

export const exampleRecipe = defineRecipe({
  className: 'example',
  base: {
    display: 'flex',
    gap: '{spacing.md}', // ✅ curly-brace token path
    padding: '{spacing.base}', // ✅
  },
  variants: {
    size: {
      sm: {
        gap: '{spacing.sm}', // ✅
        fontSize: '{fontSizes.sm}', // ✅
        px: '{spacing.md}', // ✅
      },
      md: {
        gap: '{spacing.md}',
        fontSize: '{fontSizes.md}',
        px: '{spacing.lg}',
      },
    },
  },
});
```

---

## 5. How to Verify Generated Output

After changing a recipe, confirm the CSS was emitted correctly:

```bash
pnpm prepare:css:codegen
rg "example--size_sm" packages/react/src/styled-system/styles.css
# Should show: gap: var(--poffy-spacing-sm);
# NOT:         gap: spacing.sm;
```

A literal `spacing.xxx` or `{spacing.xxx}` appearing in the generated CSS means the
token reference was not resolved — the recipe value syntax is wrong.

When checking package builds, remember that package-local Panda config writes to
`packages/react/src/styled-system/` or `packages/system/src/styled-system/`.
These generated directories are build artifacts and must not be edited by hand.

## 6. Consumer Theme Customization

### Set runtime CSS custom-property values

`ThemeProvider` and `ThemeBoundary` accept `tokenOverrides` for
`--poffy-*` custom-property values. This includes existing Poffy token
variables and application-defined values such as `--poffy-app-sidebar`.
At the application root, the provider applies the values to
`document.documentElement`; `global={false}` scopes them to the provider
boundary and its Poffy portals instead. Nested global providers restore the
previous owner when they unmount. `--poffy-custom-*` remains reserved for
`customBrand`.

Use `--poffy-app-*` for application-owned runtime variables. Other
`--poffy-*` names may be introduced by Poffy in a future release, so they
should be used only to override an existing Poffy token.

```tsx
<ThemeProvider
  tokenOverrides={{
    '--poffy-spacing-md': '0.75rem',
    '--poffy-radii-md': '0.625rem',
    '--poffy-fonts-body': 'Inter, sans-serif',
  }}
>
  <App />
</ThemeProvider>
```

`customBrand` exclusively owns `--poffy-custom-*`; use that API for a runtime
brand palette rather than including those variables in `tokenOverrides`.

For server-rendered application roots, pass the same values to
`getInitialThemeAttributes` so the initial `<html>` style matches the hydrated
`ThemeProvider`.

```tsx
const tokenOverrides = { '--poffy-spacing-md': '0.75rem' } as const;

<html {...getInitialThemeAttributes({ tokenOverrides })}>
  <body>
    <ThemeProvider tokenOverrides={tokenOverrides}>
      <App />
    </ThemeProvider>
  </body>
</html>;
```

### Register an application-specific Panda token at build time

New tokens that must work with Panda recipes, utilities, and TypeScript types
must be added to the consuming application's Panda configuration.
`tokenOverrides` can set a custom property value, but does not register a new
Panda token or generate any CSS that consumes it.
`--poffy-app-*` values must be consumed explicitly through `var()` in
application CSS or recipes. For example, extending `sizes.sidebar` generates
the Panda token and CSS variable `--poffy-sizes-sidebar`, which can then be
used by generated Panda utilities.

```ts
// panda.config.ts
export default defineConfig({
  // Keep generated application tokens compatible with Poffy's CSS variable prefix.
  prefix: 'poffy',
  presets: [poffyPreset],
  theme: {
    extend: {
      tokens: {
        sizes: {
          sidebar: { value: '18rem' },
        },
      },
    },
  },
});
```
