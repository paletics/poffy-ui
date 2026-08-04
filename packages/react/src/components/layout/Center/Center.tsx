import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { centerStyle } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { ElementType, forwardRef, Fragment, isValidElement } from 'react';
import type { CenterComponent, CenterProps } from './Center.types';


const CenterImpl = forwardRef<Element, CenterProps>((props, ref) => {
  const { asChild, className, children, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = centerStyle({});

  const canUseAsChild = Boolean(asChild && isValidElement(children) && children.type !== Fragment);
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(recipeClass, css(cssProps), className)} {...elementProps}>
      {canUseAsChild ? <Slottable>{children}</Slottable> : children}
    </Component>
  );
});

CenterImpl.displayName = 'Center';
/** Centers its children along both axes. */
export const Center = CenterImpl as CenterComponent;
