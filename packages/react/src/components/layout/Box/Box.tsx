import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { boxStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { Fragment, forwardRef, isValidElement, type ElementType } from 'react';
import type { BoxComponent, BoxProps } from './Box.types';


const BoxImpl = forwardRef<Element, BoxProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = boxStyle();

  const styleClass = css(cssProps);

  const canUseAsChild = asChild && isValidElement(children) && children.type !== Fragment;
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, styleClass, className)} {...elementProps}>
      {children}
    </Component>
  );
});

BoxImpl.displayName = 'Box';
/** Provides a polymorphic, style-prop-aware layout container without additional semantics. */
export const Box = BoxImpl as BoxComponent;
