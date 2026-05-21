import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { containerStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { ElementType, forwardRef } from 'react';
import { ContainerProps } from './Container.types';

/**
 * A horizontal layout constraint block strictly responsible for bounding content to application-wide max-widths.
 * By default centering is achieved using `margin-inline: auto`. DO NOT use Container for vertical bounding or alignment.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: containerStyle, splitCssProps), Radix Slot
 * - **Props**: PrimitiveProps<'div', ContainerBaseProps>
 *
 * ### Design Tokens
 * - **spacing**: Integrates with global breakpoints (`breakpoints` from theme config) to determine fluid width capping.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: Relies entirely on its children for semantic meaning unless overridden with `asChild`.
 *
 * ### AI Usage
 * - **DO**: Wrap major page sections (Header, Main, Footer) to ensure content does not bleed to the absolute edges on ultrawide monitors.
 *
 * @example Standard usage
 * ```tsx
 * <Container maxW="3xl">
 *   <main>Content bounded horizontally</main>
 * </Container>
 * ```
 */
export const Container = forwardRef<HTMLDivElement, ContainerProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = containerStyle({});

  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {children}
    </Component>
  );
});

Container.displayName = 'Container';
