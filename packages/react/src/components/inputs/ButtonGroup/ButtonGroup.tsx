'use client';

import { ButtonGroupRoot } from './ButtonGroupRoot';

/**
 * A layout molecule that groups `Button` atoms into a connected row or vertical stack.
 * Shares orientation and connected state to children via `ButtonGroupContext`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`buttonGroup` recipe), `ButtonGroupContext`, `ActionMotion`
 * - **Props**: `PrimitiveProps<'div'>`
 *
 * ### Design Tokens
 * - **spacing**: gap between buttons → `silver.{sm|md|lg|none}`
 * - **color**: inherits from child `Button` intents — no direct color tokens
 *
 * ### Variant Logic
 * - **connected**: Removes gaps and collapses shared borders between adjacent buttons. Switches child animation to `subtle`.
 * - **orientation="vertical"**: Stacks buttons in a column.
 * - **fullWidth**: Stretches the group to fill its container.
 *
 * ### Accessibility
 * - **Role**: `group` (explicit)
 * - **Keyboard**: Tab / Arrow: navigate between buttons
 * - **Required**: Provide `aria-label` on `ButtonGroup` to name the group for screen readers
 *
 * ### AI Usage
 * - **DO**: Use for 2+ related actions. Use `connected` for toolbar/segmented controls.
 * - **DON'T**: Do not use for navigation — use `Tabs`. Do not nest `ButtonGroup` inside another `ButtonGroup`.
 *
 * @example Standard horizontal group
 * ```tsx
 * <ButtonGroup>
 *   <Button>Bold</Button>
 *   <Button>Italic</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Connected segmented control
 * ```tsx
 * <ButtonGroup connected aria-label="Text alignment">
 *   <Button>Left</Button>
 *   <Button>Center</Button>
 *   <Button>Right</Button>
 * </ButtonGroup>
 * ```
 */
export const ButtonGroup = Object.assign(ButtonGroupRoot, {
  Root: ButtonGroupRoot,
});
