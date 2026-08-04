import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { aspectRatioStyle } from '@/styled-system/recipes';
import { Slot, Slottable } from '@radix-ui/react-slot';
import {
  cloneElement,
  CSSProperties,
  ElementType,
  forwardRef,
  Fragment,
  isValidElement,
} from 'react';
import type { AspectRatioComponent, AspectRatioProps } from './AspectRatio.types';

type AspectRatioCSSVars = CSSProperties & { '--aspect-ratio'?: number };

interface AspectRatioChildProps extends Record<string, unknown> {
  style?: CSSProperties;
}


const AspectRatioImpl = forwardRef<Element, AspectRatioProps>((props, ref) => {
  const { asChild, ratio = 16 / 9, className, children, style, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const resolvedRatio = Number.isFinite(ratio) && ratio > 0 ? ratio : 16 / 9;
  const asChildElement =
    isValidElement<AspectRatioChildProps>(children) && children.type !== Fragment ? children : null;
  const canUseAsChild = Boolean(asChild && asChildElement);
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const resolvedStyle = { ...style, '--aspect-ratio': resolvedRatio } satisfies AspectRatioCSSVars;
  const childStyle = asChildElement?.props.style ?? {};
  const slottableChild =
    canUseAsChild && asChildElement
      ? cloneElement(asChildElement, { style: { ...childStyle, ...resolvedStyle } })
      : children;
  const recipeClass = aspectRatioStyle();

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, css(cssProps), className)}
      style={resolvedStyle}
      {...elementProps}
    >
      {canUseAsChild ? <Slottable>{slottableChild}</Slottable> : children}
    </Component>
  );
});

AspectRatioImpl.displayName = 'AspectRatio';
/**
 * Reserves a fixed width-to-height ratio for media, embeds, or placeholders.
 *
 * It does not crop or size its child; the child must fill the available box when that is desired.
 */
export const AspectRatio = AspectRatioImpl as AspectRatioComponent;
