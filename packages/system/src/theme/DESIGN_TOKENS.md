# Design Tokens

Design token specification for Poffy UI. Defines the token hierarchy, purpose, and selection guidelines.

> **Audience:** Component implementors and AI agents
> **When to consult:** When selecting color tokens in recipe files

---

## Two-Tier Token Architecture

```text
Layer 1: Primitive  (src/theme/colors.ts, tokens.ts)
  Raw values. Never referenced directly from components.
     e.g., colors.blue.100, spacing.base

Layer 2: Semantic   (src/theme/semanticTokens.ts)
  Purpose-driven names. Components always reference this layer.
     e.g., brand.tint, variants.primary.main, layout.surface
```

Component recipes **must always reference Layer 2 (semantic tokens)**.
Direct palette references such as `blue.100` are forbidden because they cannot adapt to brand changes.

---

## Color Tokens

### `brand.*` - Brand Colors

Colors that follow the active brand (`blue` / `pome`). Used for single-color components such as Button, Link, and focus rings.

| Token            | Light value                              | Usage                                           |
| ---------------- | ---------------------------------------- | ----------------------------------------------- |
| `brand.main`     | `blue.500`                               | Buttons, links, accent color                    |
| `brand.contrast` | `#FFFFFF`                                | Text rendered on top of `brand.main`            |
| `brand.surface`  | `blue.50`                                | Input backgrounds, subtle hover states          |
| `brand.tint`     | `blue.100`                               | Selected or active states, loading placeholders |
| `brand.border`   | `blue.500` darkened 40% via `color-mix`  | Borders and outlines                            |
| `brand.hover`    | `blue.500` darkened 10% via `color-mix`  | Hovered `main` color                            |
| `brand.active`   | `blue.500` darkened 20% via `color-mix`  | Pressed `main` color                            |
| `brand.accent`   | `blue.500` lightened 30% via `color-mix` | Highlights and decorations                      |

> **Dark mode:** `brand.*` tokens automatically invert via Panda CSS `_dark` conditions defined in `semanticTokens.ts`.

**`brand.surface` vs `brand.tint` - when to use which**

```text
brand.surface (.50) -> Use when the background should recede visually
  - Input field backgrounds (Input, Select, Textarea)
  - Dropdown menu backgrounds
  - Default hover states (Sidebar, Accordion, Dropdown items)

brand.tint (.100) -> Use when communicating "selected" or "active"
  - Selected tree items (TreeView selected)
  - Active toolbar buttons (RichTextEditor active)
  - Loading placeholders (Skeleton)
  - Range-selection backgrounds (Calendar range)
  - DataGrid selected cells
```

---

### `variants.*` - Color Variants

Eight variants: `primary / secondary / info / success / warning / danger / light / dark`.
Used for components that support multiple color schemes such as Alert, Badge, ProgressBar, and Skeleton.

Each variant exposes the following tokens:

| Token                 | Scale equivalent     | Usage                          |
| --------------------- | -------------------- | ------------------------------ |
| `variants.*.main`     | `.500`               | Primary fill color             |
| `variants.*.contrast` | white or dark        | Text rendered on top of `main` |
| `variants.*.surface`  | `.50`                | Very subtle background         |
| `variants.*.tint`     | `.100` to `.200`     | Visible light background       |
| `variants.*.border`   | darkened             | Borders and outlines           |
| `variants.*.hover`    | `.500` darkened 10%  | Hovered `main` color           |
| `variants.*.active`   | `.500` darkened 20%  | Pressed `main` color           |
| `variants.*.accent`   | `.500` lightened 30% | Highlights                     |

The same `surface` vs `tint` rules from `brand.*` apply here. `primary` is aliased to `brand`, so `variants.primary.*` internally maps to `brand.*`.

---

### `text.*` - Text Colors

| Token            | Light       | Dark        | Usage                         |
| ---------------- | ----------- | ----------- | ----------------------------- |
| `text.primary`   | `slate.800` | `slate.50`  | Body text, headings           |
| `text.secondary` | `slate.500` | `slate.400` | Supporting text, placeholders |
| `text.disabled`  | `slate.300` | `slate.600` | Disabled state                |
| `text.inverse`   | `#FFFFFF`   | `slate.950` | Text on dark backgrounds      |

---

### `layout.*` - Page Structure Colors

| Token               | Light                | Dark               | Usage                      |
| ------------------- | -------------------- | ------------------ | -------------------------- |
| `layout.background` | `slate.50`           | `slate.950`        | Page background            |
| `layout.surface`    | `#FFFFFF`            | `slate.800`        | Card and modal backgrounds |
| `layout.divider`    | `slate.200`          | `slate.700`        | Dividers and borders       |
| `layout.overlay`    | `rgba(15,23,42,0.6)` | `rgba(0,0,0,0.75)` | Modal backdrop             |

---

### `poffy.*` - Expressive Semantic Aliases

These tokens are additive semantic aliases for more expressive UI treatments. They do **not** replace `brand.*` or `variants.*`, and existing component APIs should not be migrated wholesale to them.

Current sets:

- `poffy.cloud`
- `poffy.night`
- `poffy.berry`
- `poffy.plum`
- `poffy.mint`
- `poffy.soda`
- `poffy.leaf`
- `poffy.marmalade`

Each set exposes the following tokens:

| Token              | Usage                                                    |
| ------------------ | -------------------------------------------------------- |
| `poffy.*.main`     | Primary fill color for custom surfaces or accents        |
| `poffy.*.contrast` | Text or icon color rendered on top of `main`             |
| `poffy.*.surface`  | Soft background tone derived from the same family        |
| `poffy.*.border`   | Border or outline color for framed treatments            |
| `poffy.*.hover`    | Hovered `main` color                                     |
| `poffy.*.active`   | Pressed `main` color                                     |
| `poffy.*.accent`   | Companion color for highlights, decoration, and contrast |

Use `poffy.*` when:

- A story, marketing surface, or special component needs more personality than `brand.*`
- You need a reusable named color family without changing the public `intent` API
- You want a companion accent color that is not the same hue family as `main`

Do not use `poffy.*` when:

- A standard product-state meaning is required such as `success`, `warning`, or `danger`
- The component already exposes `intent` and should remain constrained to the existing semantic API
- A one-off value can be derived inline and does not need design-system reuse

> **Note:** `poffy.*.accent` is intentionally a companion color, not a lighter version of `main`.

---

## Color Hierarchy Overview

```text
layout.background  (slate.50) -> Page background
layout.surface     (#FFF) -> Card / modal background
brand.surface      (blue.50) -> Input fields / subtle hover
brand.tint         (blue.100) -> Selected / active states
brand.main         (blue.500) -> Buttons / links
poffy.berry.main   (pink.500) -> Expressive custom surface / accent
```

---

## Anti-Patterns (Do NOT Do These)

### Referencing tokens that do not exist

```ts
// NG: brand.bg.subtle / brand.bg.muted do not exist
bg: 'brand.bg.subtle';
bg: 'brand.bg.muted';

// OK: use brand.tint
bg: 'brand.tint';
```

> **Background:** `brand.bg.subtle` and `brand.bg.muted` were incorrectly used in multiple components. These are now formally defined as `brand.tint`.

### Using palette tokens directly in recipes

```ts
// NG: will not adapt when the brand changes
backgroundColor: 'blue.100';
backgroundColor: 'slate.200';

// OK: reference through semantic tokens
backgroundColor: 'variants.secondary.tint';
backgroundColor: 'brand.tint';
```

---

## Rules for Adding New Tokens

Criteria for deciding whether a new semantic token is warranted:

1. **Two or more components require the same value** -> Add a semantic token.
2. **Only one component needs it** -> Derive the value inline in the recipe using `color-mix()`.
3. **An existing token can substitute** -> Do not add a new token.

When adding a token, it must be added simultaneously to the `brand` group **and** all `variants` groups (`primary / secondary / info / success / warning / danger / light / dark`) inside `semanticTokens.ts`.
Exception: additive `poffy.*` aliases may be introduced independently when they do not alter existing component APIs or replace current semantic roles.

---

## Silver Ratio Spacing and Sizing

Spacing and sizing follow the Silver Ratio (`1.414`) scale. Typography is deliberately
independent: it uses a readability scale with a 12px minimum for compact UI text,
13px for captions, 14px for secondary text, and 16px for body copy.

```text
2xs -> xs -> sm -> md -> base -> lg -> xl -> 2xl -> 3xl
4px    5.6   8    11.3   16     22.6   32    45.2   64px
       1.414 per step
```

Typography uses these independent role tokens:

| Token | Value | Intended role |
| ----- | ----- | ------------- |
| `2xs` | 12px  | Compact, short UI metadata |
| `xs`  | 13px  | Captions and supporting labels |
| `sm`  | 14px  | Secondary prose and controls |
| `md`  | 16px  | Body copy and default UI text |
| `lg`–`4xl` | 18–36px | Heading and display hierarchy |

See `src/theme/tokens.ts` (`baseTokens`) and `src/theme/typography.ts` for the
canonical spacing, sizing, and typography definitions.

## Border Width Tokens

Border widths are exposed as dedicated tokens to keep visual weight consistent across components.

- `borderWidths.thin` -> `1px`
- `borderWidths.default` -> `2px`
- `borderWidths.strong` -> `3px`

Use `thin` for standard surfaces and dividers, `default` for workhorse controls, and `strong` for expressive surfaces such as `neo`.

## Focus Ring Tokens

Focus ring measurements are exposed as dedicated tokens so keyboard focus stays consistent across components.

- `focusRing.width` -> `2px`
- `focusRing.offset` -> `2px`
- `focusRing.insetOffset` -> `-2px`
- `focusRing.underlineWidth` -> `2px`

## Shadow Offset Tokens

Shadow offsets are exposed as dedicated tokens for physical and expressive surfaces.

- `shadowOffsets.sm` -> `4px`
- `shadowOffsets.md` -> `6px`
- `shadowOffsets.lg` -> `8px`

## Stroke Width Tokens

Stroke widths are exposed as dedicated tokens for icons, SVG arrows, and selection indicators.

- `strokeWidths.thin` -> `1px`
- `strokeWidths.default` -> `2px`
- `strokeWidths.strong` -> `3px`
