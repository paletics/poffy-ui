import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { centerStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import { CenterProps } from './Center.types';

/**
 * A specialized flexbox layout component strictly designed to center its children on both the X and Y axes.
 * It is a wrapper over `display: flex`, `align-items: center`, and `justify-content: center`.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: centerStyle, splitCssProps), Radix Slot
 * - **Props**: PrimitiveProps<'div', CenterBaseProps>
 *
 * ### Design Tokens
 * - **spacing**: Inherits standard box spacing tokens. No direct Silver Ratio dependencies purely for centering.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: Relies entirely on its children for semantic meaning unless overridden with `asChild`.
 *
 * @example Standard usage
 * ```tsx
 * <Center bg="gray.100" h="200px">
 *   <div>Perfectly Centered</div>
 * </Center>
 * ```
 */
export const Center = forwardRef<HTMLDivElement, CenterProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = centerStyle({});

  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {children}
    </Component>
  );
});

Center.displayName = 'Center';
