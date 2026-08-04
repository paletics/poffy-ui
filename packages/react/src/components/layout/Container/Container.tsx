import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { containerStyle } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { ElementType, forwardRef, Fragment, isValidElement } from 'react';
import type { ContainerComponent, ContainerProps } from './Container.types';


const ContainerImpl = forwardRef<Element, ContainerProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = containerStyle({});

  const canUseAsChild = Boolean(asChild && isValidElement(children) && children.type !== Fragment);
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {canUseAsChild ? <Slottable>{children}</Slottable> : children}
    </Component>
  );
});

ContainerImpl.displayName = 'Container';
/** Centers page content within a responsive maximum width and horizontal gutters. */
export const Container = ContainerImpl as ContainerComponent;
