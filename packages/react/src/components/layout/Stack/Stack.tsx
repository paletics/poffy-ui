import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { stackStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { Fragment, forwardRef, isValidElement, type ElementType } from 'react';
import type { StackComponent, StackProps } from './Stack.types';


const StackImpl = forwardRef<Element, StackProps>((props, ref) => {
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

  const canUseAsChild = asChild && isValidElement(children) && children.type !== Fragment;
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {children}
    </Component>
  );
});

StackImpl.displayName = 'Stack';

/** Arranges children in one flexbox direction with consistent alignment and spacing. */
export const Stack = StackImpl as StackComponent;
