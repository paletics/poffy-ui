import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { dividerStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import { DividerProps } from './Divider.types';

/**
 * A semantic layout primitive that creates a visual and accessible boundary between content groups.
 * Automatically applies the correct `aria-orientation` based on the given prop. Defaults to rendering an `<hr>`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: dividerStyle), Radix Slot
 * - **Props**: PrimitiveProps<'hr', DividerBaseProps>
 *
 * ### Design Tokens
 * - **spacing**: Margins applied to the Divider should rely on Silver Ratio dimension keys.
 *
 * ### Variant Logic
 * - **solid**: Standard dividing line. The default and most common separator.
 * - **dashed**: Reduced visual weight. Use to indicate weaker groupings or sub-sections.
 *
 * ### Accessibility
 * - **Role**: separator (implicit on hr, preserved explicitly)
 * - **Required**: Explicitly retains `role="separator"` even when rendered `asChild`. Ensures screen readers understand the layout boundary.
 *
 * ### AI Usage
 * - **DO**: Use to separate distinct logical groups within Cards, Dropdowns, or Page layouts.
 *
 * @example Standard usage
 * ```tsx
 * <Divider orientation="horizontal" variant="dashed" />
 * ```
 */
export const Divider = forwardRef<HTMLElement, DividerProps>((props, ref) => {
  const { asChild, orientation, variant, className, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = dividerStyle({
    orientation,
    variant,
  });

  const Component = (asChild ? Slot : 'hr') as ElementType;

  return (
    <Component
      ref={ref}
      role="separator"
      aria-orientation={orientation === 'vertical' ? 'vertical' : 'horizontal'}
      className={cx(recipeClass, css(cssProps), className)}
      {...elementProps}
    />
  );
});

Divider.displayName = 'Divider';
