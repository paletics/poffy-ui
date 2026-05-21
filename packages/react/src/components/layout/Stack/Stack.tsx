import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { stackStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import { StackProps } from './Stack.types';

/**
 * The foundational flex-layout primitive of the Poffy UI design system.
 * Stacks children along a configurable axis with consistent Silver Ratio spacing.
 * All higher-level stack aliases (`<HStack>`, `<VStack>`) are built on top of this component.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: stackStyle, splitCssProps), Radix Slot. Accepts arbitrary Panda CSS style props via `splitCssProps`.
 * - **Props**: StackProps
 *
 * ### Design Tokens
 * - **spacing**: gap: Silver Ratio spacing tokens (`none` | `2xs` | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | `3xl`). Default `gap="md"` corresponds to the 1.414× base unit.
 *
 * ### Variant Logic
 * - **direction="column"**: (default) Vertical stack — the most common composition pattern.
 * - **direction="row"**: Horizontal stack — prefer `<HStack>` alias for clarity.
 * - **motion="pop"**: Enables subtle pop animation on mount via recipe class — no extra wrapper needed.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent ARIA role. Use `asChild` with semantic HTML (`<nav>`, `<section>`, `<ul>`) to assign landmark meaning when structuring page regions.
 *
 * ### AI Usage
 * - **DO**: Use as the default layout wrapper for grouping related child elements.
 * - **DO**: Prefer `<HStack>` and `<VStack>` aliases for direction-specific layouts (improved readability).
 * - **DO**: Use `<ReorderTransition>` when children will be dynamically added/removed/reordered.
 *
 * @example Vertical card stack
 * ```tsx
 * <Stack gap="lg">
 *   <Card>Section A</Card>
 *   <Card>Section B</Card>
 * </Stack>
 * ```
 *
 * @example Semantic nav with asChild
 * ```tsx
 * <Stack asChild direction="row" gap="md">
 *   <nav>
 *     <a href="/">Home</a>
 *     <a href="/docs">Docs</a>
 *   </nav>
 * </Stack>
 * ```
 *
 * ### Notes
 * Passing Panda CSS style props (e.g., `padding`, `bg`) is supported via `splitCssProps`.
 * Do not use inline `style` for design system tokens — always use Panda props.
 */
export const Stack = forwardRef<HTMLDivElement, StackProps>((props, ref) => {
  const {
    asChild,
    direction = 'column',
    align = 'stretch',
    justify = 'flex-start',
    wrap = 'nowrap',
    gap = 'md',
    motion = 'none',
    className,
    children,
    ...rest
  } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = stackStyle({
    direction,
    align,
    justify,
    gap,
    wrap,
    motion,
  });

  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {children}
    </Component>
  );
});

Stack.displayName = 'Stack';
