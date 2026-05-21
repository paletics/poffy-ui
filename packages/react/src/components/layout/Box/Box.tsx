import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { boxStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import { BoxProps } from './Box.types';

/**
 * The most fundamental abstract layout component, acting as the foundation for the entire Poffy UI system.
 * Extracts known Panda CSS properties from standard HTML properties to allow type-safe, utility-class generation on the fly.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: boxStyle, splitCssProps), Radix Slot
 * - **Props**: PrimitiveProps<'div', BoxBaseProps>
 *
 * ### Design Tokens
 * - **spacing**: Accepts all Panda CSS tokens as inline props. Use Silver Ratio aliases (e.g. `p="4"` which maps to silver tokens) for layout math.
 *
 * ### Accessibility
 * - **Role**: generic (implicit `<div>`)
 * - **Required**: By default it renders as a `<div>`, granting it no inherent semantic value. Use `asChild` if you need to mutate it into an `<article>` or `<section>`.
 *
 * @example Standard usage
 * ```tsx
 * // inline prop styling mapped to Panda CSS
 * <Box bg="gray.100" p={4} borderRadius="md">
 *   Content
 * </Box>
 * ```
 */
export const Box = forwardRef<HTMLDivElement, BoxProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = boxStyle();

  const styleClass = css(cssProps);

  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, styleClass, className)} {...elementProps}>
      {children}
    </Component>
  );
});

Box.displayName = 'Box';
