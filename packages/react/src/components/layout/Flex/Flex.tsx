import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { flexStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import { FlexProps } from './Flex.types';

/**
 * A pre-configured Flexbox layout container exposing key flex properties as typed props.
 * It is a wrapper over `display: flex`. When direction is undefined or 'row', prefer `HStack` for semantically clearer intent.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: flexStyle, splitCssProps), Radix Slot
 * - **Props**: PrimitiveProps<'div', FlexBaseProps>
 *
 * ### Design Tokens
 * - **spacing**: gap: Must use Silver Ratio spacing keys (e.g. `gap="4"`).
 *
 * ### Variant Logic
 * - **direction**: 'row' (default), 'column', 'row-reverse', 'column-reverse'.
 * - **align / justify**: Maps to CSS flexbox alignment.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: No inherent semantic meaning. Use `asChild` when wrapping landmark elements.
 *
 * ### AI Usage
 * - **DO**: Use when you need fine-grained control over alignment, justification, and direction simultaneously.
 * - **DO**: Prefer `HStack` / `VStack` for common single-axis layouts for clarity.
 *
 * @example Standard usage
 * ```tsx
 * <Flex align="center" justify="space-between" gap="4">
 *   <Box>Item 1</Box>
 *   <Box>Item 2</Box>
 * </Flex>
 * ```
 */
export const Flex = forwardRef<HTMLDivElement, FlexProps>((props, ref) => {
  const { asChild, direction, align, justify, wrap, gap, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = flexStyle({
    direction,
    align,
    justify,
    wrap,
    gap,
  });

  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {children}
    </Component>
  );
});

Flex.displayName = 'Flex';
