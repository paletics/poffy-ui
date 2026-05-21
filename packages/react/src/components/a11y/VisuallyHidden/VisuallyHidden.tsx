import { css, cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { VisuallyHiddenProps } from './VisuallyHidden.types';

/**
 * A utility component that hides content visually while ensuring it remains accessible to screen readers.
 * Uses the `srOnly` utility from Panda CSS. Supports the `asChild` pattern for rendering as a different element.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms
 * - Stack: Panda CSS `srOnly` utility, Radix Slot for `asChild`
 *
 * ### Design Tokens
 * - Uses the shared `srOnly` utility instead of component-specific color, spacing, or typography tokens.
 *
 * ### Variant Logic
 * - No visual variants. `asChild` only changes the rendered element while preserving screen-reader visibility.
 *
 * ### Accessibility
 * - Keeps content in the accessibility tree while removing it from visual layout.
 * - Use for non-visual labels, helper text, skip links, or context that visible UI already implies.
 *
 * ### AI Usage
 * - **DO**: Provide readable text that names an icon-only control or adds hidden context.
 * - **DON'T**: Hide interactive controls from sighted users unless the owning pattern explicitly supports it.
 *
 * @example
 * ```tsx
 * import { VisuallyHidden } from '@poffy-ui/react/a11y';
 *
 * <VisuallyHidden>Skip to main content</VisuallyHidden>
 * <VisuallyHidden asChild><div>Hidden div content</div></VisuallyHidden>
 * ```
 */
export const VisuallyHidden = forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  ({ asChild, children, className, ...rest }, ref) => {
    const Component = asChild ? Slot : 'span';

    return (
      <Component ref={ref} className={cx(css({ srOnly: true }), className)} {...rest}>
        {children}
      </Component>
    );
  },
);

VisuallyHidden.displayName = 'VisuallyHidden';
