import { Slot } from '@radix-ui/react-slot';
import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { icon as iconRecipe } from '@/styled-system/recipes';
import { forwardRef, isValidElement, type ElementType } from 'react';
import type { IconProps } from './Icon.types';

const svgChildElementNames = new Set([
  'animate',
  'animateMotion',
  'animateTransform',
  'circle',
  'clipPath',
  'defs',
  'desc',
  'ellipse',
  'feBlend',
  'feColorMatrix',
  'feComponentTransfer',
  'feComposite',
  'feConvolveMatrix',
  'feDiffuseLighting',
  'feDisplacementMap',
  'feDistantLight',
  'feDropShadow',
  'feFlood',
  'feFuncA',
  'feFuncB',
  'feFuncG',
  'feFuncR',
  'feGaussianBlur',
  'feImage',
  'feMerge',
  'feMergeNode',
  'feMorphology',
  'feOffset',
  'fePointLight',
  'feSpecularLighting',
  'feSpotLight',
  'feTile',
  'feTurbulence',
  'filter',
  'foreignObject',
  'g',
  'image',
  'line',
  'linearGradient',
  'marker',
  'mask',
  'metadata',
  'mpath',
  'path',
  'pattern',
  'polygon',
  'polyline',
  'radialGradient',
  'rect',
  'set',
  'stop',
  'switch',
  'symbol',
  'text',
  'textPath',
  'tspan',
  'use',
  'view',
]);

const isNativeNonSvgAsChildHost = (children: IconProps['children']) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  children.type !== 'svg' &&
  !svgChildElementNames.has(children.type);

/**
 * Renders a decorative SVG icon by default. With `asChild`, the child SVG owns `viewBox`, focus,
 * and ARIA attributes; label the interactive parent or provide an accessible child SVG when needed.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>((props, ref) => {
  const [variantProps, localProps] = iconRecipe.splitVariantProps(props);
  const { asChild = false, className, children, ...rest } = localProps;

  const [cssProps, elementProps] = splitCssProps(rest);
  const styles = iconRecipe(variantProps);
  const hasAccessibleName = [elementProps['aria-label'], elementProps['aria-labelledby']].some(
    (value) => typeof value === 'string' && value.trim().length > 0,
  );
  const isExplicitlyHidden =
    elementProps['aria-hidden'] === true ? true : elementProps['aria-hidden'] === 'true';
  const hasSvgGraphicsChild =
    isValidElement(children) &&
    typeof children.type === 'string' &&
    svgChildElementNames.has(children.type);
  if (asChild && isNativeNonSvgAsChildHost(children)) {
    throw new Error(
      '[Icon] `asChild` requires a native SVG or a custom component that renders an SVG host.',
    );
  }
  const usesSlot = asChild && !hasSvgGraphicsChild && isValidElement(children);

  const Component = (usesSlot ? Slot : 'svg') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(styles, css(cssProps), className)}
      {...(usesSlot
        ? {}
        : {
            viewBox: '0 0 24 24',
            focusable: 'false',
            ...(hasAccessibleName && !isExplicitlyHidden && elementProps.role === undefined
              ? { role: 'img' }
              : {}),
            ...(hasAccessibleName || elementProps.role === 'img' || isExplicitlyHidden
              ? {}
              : { 'aria-hidden': 'true' }),
          })}
      {...elementProps}
    >
      {children}
    </Component>
  );
});

Icon.displayName = 'Icon';
