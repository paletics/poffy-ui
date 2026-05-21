import { Slot } from '@radix-ui/react-slot';
import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { icon as iconRecipe } from '@/styled-system/recipes';
import { forwardRef, type ElementType } from 'react';
import type { IconProps } from './Icon.types';

/**
 * The foundational SVG icon primitive of the Poffy UI design system.
 * Renders an inline SVG with a standard 24×24 viewBox, Silver Ratio–scaled size variants,
 * and automatic ARIA decoration suppression. Supports `asChild` for polymorphic custom SVG components.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: icon via `iconRecipe.splitVariantProps`),
 * Radix Slot (`asChild`). `aria-hidden="true"` and `focusable="false"` are injected automatically
 * on the default `<svg>` render but NOT when using `asChild`.
 * ### Design Tokens
 * - size: Silver Ratio token scale (`2xs` → `2xl`). Each step is ~1.414× the previous,
 * ensuring icon sizes harmonize with adjacent text and spacing tokens throughout the system.
 * ### Variant Logic
 * - `size="sm"`: Inline with body text — status indicators, input adornments.
 * - `size="md"` (default): Standard toolbar icon — balanced with most UI controls.
 * - `size="lg"`: Feature icon — illustrative callouts in cards or empty states.
 * - `disabled=true`: Reduces opacity to indicate non-interactive state.
 * @example Decorative icon (aria-hidden auto-injected)
 * ```tsx
 * import { Icon } from '@poffy-ui/react/media';
 *
 * <Icon size="md">
 *   <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth={2} fill="none" />
 * </Icon>
 * ```
 * @example Semantic icon with label (outside the Icon, for screen readers)
 * ```tsx
 * import { Icon } from '@poffy-ui/react/media';
 *
 * <button aria-label="Close dialog">
 *   <Icon size="sm"><path d="M6 18L18 6M6 6l12 12" /></Icon>
 * </button>
 * ```
 * @example asChild with a custom SVG component
 * ```tsx
 * import { Icon } from '@poffy-ui/react/media';
 *
 * <Icon asChild size="lg">
 *   <StarIcon aria-label="Favorite" role="img" />
 * </Icon>
 * ```
 * ### Notes
 * When using `asChild`, `aria-hidden`, `focusable`, and `viewBox` are NOT injected.
 * The consumer is fully responsible for managing ARIA attributes on the custom SVG component.
 * ### Accessibility
 * - Decorative icons MUST have `aria-hidden="true"` (injected automatically on default render).
 * Meaningful standalone icons MUST be wrapped in a parent with `aria-label` (e.g., a `<button>`),
 * or use `<Icon asChild>` with `role="img"` and `aria-label` on the custom SVG.
 * ### AI Usage
 * - Use for all inline SVG icons throughout the design system.
 * - Always provide an `aria-label` on the interactive parent when the icon conveys meaning.
 * - Use `asChild` only when integrating third-party SVG components that manage their own attributes.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const [variantProps, localProps] = iconRecipe.splitVariantProps(props);
  const { asChild = false, className, children, ...rest } = localProps;

  const [cssProps, elementProps] = splitCssProps(rest);
  const styles = iconRecipe(variantProps);

  const Component = (asChild ? Slot : 'svg') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(styles, css(cssProps), className)}
      {...(asChild
        ? {}
        : {
            viewBox: '0 0 24 24',
            'aria-hidden': 'true',
            focusable: 'false',
          })}
      {...elementProps}
    >
      {children}
    </Component>
  );
});

Icon.displayName = 'Icon';
