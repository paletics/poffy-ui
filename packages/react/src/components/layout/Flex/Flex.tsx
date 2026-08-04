import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { flexStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { Fragment, forwardRef, isValidElement, type ElementType } from 'react';
import type { FlexComponent, FlexProps } from './Flex.types';


const FlexImpl = forwardRef<Element, FlexProps>((props, ref) => {
  const { asChild, direction, align, justify, wrap, gap, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = flexStyle({
    direction,
    align,
    justify,
    wrap,
    gap,
  });

  const canUseAsChild = asChild && isValidElement(children) && children.type !== Fragment;
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {children}
    </Component>
  );
});

FlexImpl.displayName = 'Flex';
/** Arranges children with configurable flexbox direction, alignment, wrapping, and gap. */
export const Flex = FlexImpl as FlexComponent;
