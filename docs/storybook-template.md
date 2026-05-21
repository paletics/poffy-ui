---
name: storybook-template
trigger: model_decision
description: Storybook story structure and review template for Poffy UI components.
---

# Storybook Template

Use Storybook as both component documentation and a visual review surface. Each public component story file should cover three angles:

1. Basic usage.
2. API exploration through Controls.
3. Fixed visual galleries for variants, states, dimensions, and edge cases.

## Story Order

Use this order unless the component has a strong reason to differ.

| Story                            | Purpose                                                                            | Required                                 |
| -------------------------------- | ---------------------------------------------------------------------------------- | ---------------------------------------- |
| `Default`                        | Minimal representative usage with stable `args`.                                   | Yes                                      |
| `Playground`                     | Controls-focused story. Keep the render surface simple.                            | Yes for public components                |
| `Variants`                       | Fixed gallery of semantic variants or visual styles.                               | When component has variants              |
| `Sizes` / `Widths` / `Thickness` | Fixed gallery for dimensional props. Use the prop name users recognize.            | When dimensional props exist             |
| `States`                         | Disabled, error, selected, loading, readOnly, focused, or open states.             | When state props exist                   |
| `Shapes` / `Appearances`         | Fixed gallery for shape, appearance, intent, or emphasis differences.              | When relevant                            |
| `Composed`                       | Realistic composition with sibling system components or subcomponents.             | For compound components                  |
| `Interaction`                    | Story with a `play` function for expected user behavior.                           | When interaction is part of the contract |
| `EdgeCases`                      | Boundaries such as empty, long text, 0/100, overflow, many items, or narrow width. | For layout-sensitive components          |

## Fixed Galleries

Fixed gallery stories are the most important stories for visual review and visual regression tests.

- Use literal JSX for every important variant value.
- Do not rely on Storybook Controls values for Panda CSS extraction.
- Avoid inline styles; use `css()` from `@/styled-system/css`.
- Keep labels short and visual.
- Use stable widths and layout constraints so snapshots are comparable.
- Split stories by review purpose instead of packing every prop combination into one story.

Example:

```tsx
export const Variants: Story = {
  render: () => (
    <div className={css({ display: 'grid', gap: 'md', width: '320px' })}>
      <ProgressBar variant="primary" value={64} />
      <ProgressBar variant="secondary" value={64} />
      <ProgressBar variant="success" value={64} />
      <ProgressBar variant="warning" value={64} />
      <ProgressBar variant="danger" value={64} />
    </div>
  ),
};
```

## Controls

- Keep Controls focused in `Playground`.
- `argTypes.options` must include every supported enum value.
- Add a short `description` when a prop name is ambiguous.
- Use stable defaults in `args`.
- Avoid randomized values or current dates unless the component specifically represents date behavior.

## Naming

- Use `Widths` when a `size` prop controls only width.
- Use `Thickness` when vertical size is independently configurable.
- Use `Appearances` for broad style modes such as solid, outline, or ghost.
- Use `Variants` for semantic color or intent values such as primary, secondary, success, warning, or danger.
- Use `States` for behavior or form state such as disabled, invalid, loading, selected, or readOnly.

## Review Priority

When reviewing existing stories, prioritize components in this order:

1. Components with generated CSS gaps or Panda extraction issues.
2. Components with semantic variants or color intents.
3. Components with dimensional props such as size, width, or thickness.
4. Interactive overlay or form components.
5. Layout-sensitive components with overflow or long-content behavior.
