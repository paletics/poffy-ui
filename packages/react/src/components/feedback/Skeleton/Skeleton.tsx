'use client';

import { cx } from '@/styled-system/css';
import { skeleton } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { type MotionStyle, motion } from 'motion/react';
import { type CSSProperties, type ReactNode, forwardRef } from 'react';
import { SkeletonProps } from './Skeleton.types';

/**
 * A loading placeholder that mimics content layout while data is being fetched.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: skeleton), motion/react, Radix Slot
 * ### Design Tokens
 * - shape/animation: CSS keyframes (pulse/shimmer) in `keyframes.ts`; sizing via CSS variables.
 * ### Variant Logic
 * - shape: text=full-width line, circle=aspect-ratio 1:1, rect=custom width/height.
 * ### Variant Logic
 * - animation: pulse=opacity keyframe, shimmer=gradient sweep, none=static.
 * ### Notes
 * ANIMATION STRATEGY: All skeleton animations are CSS-only keyframes to prevent hydration conflicts
 * with motion/react's inline-style opacity overrides. `motion.span` is retained as root to allow
 * consumer-level entrance/exit animations via motion props.
 * SIZING STRATEGY: `width` and `height` are passed as CSS variables; the recipe maps
 * those variables to the active shape.
 * ### Accessibility
 * - Must set `aria-hidden="true"`. Never display meaningful content inside Skeleton.
 * ### AI Usage
 * - Replace content regions during async fetch with a matching Skeleton shape.
 * - Use `asChild` to apply skeleton styles directly onto a consumer's element.
 *
 * @example Text placeholder
 * ```tsx
 * import { Skeleton } from '@poffy-ui/react/feedback';
 *
 * <Skeleton shape="text" width="100%" height={16} />
 * ```
 */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>((props, ref) => {
  const {
    asChild = false,
    variant = 'secondary',
    shape = 'text',
    animation = 'pulse',
    className,
    width,
    height,
    style,
    children,
    ...rest
  } = props;

  const classes = skeleton({ shape, animation, variant });

  const toPx = (v: string | number) => (typeof v === 'number' ? `${v}px` : v);
  const resolvedHeight = shape === 'circle' ? (height ?? width) : height;

  const sizeVars = {
    ...(width !== undefined && { '--skeleton-width': toPx(width) }),
    ...(resolvedHeight !== undefined && { '--skeleton-height': toPx(resolvedHeight) }),
  } as CSSProperties;

  const sizeStyle: MotionStyle = {
    ...sizeVars,
    ...style,
  };

  if (asChild) {
    // `rest` is typed as HTMLMotionProps which includes framer-motion event overloads
    // (e.g. onDrag with PanInfo) that are incompatible with Slot's standard React types.
    // Casting to HTMLAttributes is safe here: asChild delegates rendering to the consumer's
    // child element, so motion-specific event handlers are irrelevant in this branch.
    const htmlRest = rest as React.HTMLAttributes<HTMLElement>;
    return (
      <Slot
        ref={ref}
        className={cx(classes, className)}
        style={sizeStyle as CSSProperties}
        {...htmlRest}
        aria-hidden="true"
      >
        {children as ReactNode}
      </Slot>
    );
  }

  return (
    <motion.span
      ref={ref}
      className={cx(classes, className)}
      style={sizeStyle}
      aria-hidden="true"
      {...rest}
    >
      {children}
    </motion.span>
  );
});

Skeleton.displayName = 'Skeleton';
