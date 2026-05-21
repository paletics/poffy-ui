import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { aspectRatioStyle } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { CSSProperties, ElementType, forwardRef } from 'react';
import { AspectRatioProps } from './AspectRatio.types';

type AspectRatioCSSVars = CSSProperties & { '--aspect-ratio'?: number };

/**
 * A layout container that maintains a specific proportional aspect ratio for its child element.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (Recipe: aspectRatio), Radix Slot
 * - **Props**: PrimitiveProps<'div', AspectRatioBaseProps>
 *
 * ### Design Tokens
 * - **ratio**: Commonly uses standard photographic/video ratios (e.g., 16/9, 4/3, 1/1) but can hook into Silver Ratio proportions if mathematically desired.
 *
 * ### Accessibility
 * - **Role**: generic
 * - **Required**: Essential for preventing Cumulative Layout Shift (CLS) on slow loading images or iframes.
 *
 * @example Standard usage
 * ```tsx
 * <AspectRatio ratio={16 / 9}>
 *   <iframe src="https://www.google.com/maps/embed..." />
 * </AspectRatio>
 * ```
 */
export const AspectRatio = forwardRef<HTMLDivElement, AspectRatioProps>((props, ref) => {
  const { asChild, ratio = 16 / 9, className, children, style, ...rest } = props;

  const [cssProps, elementProps] = splitCssProps(rest);

  const recipeClass = aspectRatioStyle();
  const Component = (asChild ? Slot : 'div') as ElementType;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, css(cssProps), className)}
      style={{ '--aspect-ratio': ratio, ...style } satisfies AspectRatioCSSVars}
      {...elementProps}
    >
      {children}
    </Component>
  );
});

AspectRatio.displayName = 'AspectRatio';
