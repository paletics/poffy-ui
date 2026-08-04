'use client';

import { cx } from '@/styled-system/css';
import { skeleton } from '@/styled-system/recipes';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import {
  createNoMotionStyle,
  sanitizeControlledMotionProps,
  sanitizeMotionPropsForSlot,
  sanitizeStaticStyle,
} from '@/types/motion';
import { Slot } from '@radix-ui/react-slot';
import { MotionConfig, type HTMLMotionProps, type MotionStyle, motion } from 'motion/react';
import {
  cloneElement,
  type CSSProperties,
  type ReactNode,
  forwardRef,
  isValidElement,
} from 'react';
import type {
  SkeletonAnimation,
  SkeletonComponent,
  SkeletonIntent,
  SkeletonProps,
  SkeletonShape,
} from '@/components/feedback/Skeleton/Skeleton.types';

const skeletonAsChildElements = new Set(['div', 'output', 'span']);
const skeletonVariants = new Set([
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'danger',
  'light',
  'dark',
]);
const skeletonShapes = new Set(['text', 'circle', 'rect']);
const skeletonAnimations = new Set(['pulse', 'shimmer', 'none']);

const isSafeSkeletonAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  skeletonAsChildElements.has(children.type);

const normalizeValue = <T extends string>(value: unknown, values: Set<string>, fallback: T): T =>
  typeof value === 'string' && values.has(value) ? (value as T) : fallback;

const SkeletonImpl = forwardRef<HTMLElement, SkeletonProps>((props, ref) => {
  const {
    asChild = false,
    intent = 'secondary',
    shape = 'text',
    animation = 'pulse',
    className,
    width,
    height,
    style,
    children,
    ...rest
  } = props;
  const { variant: _unsupportedVariant, ...restWithoutVariant } = rest as typeof rest & {
    variant?: unknown;
  };
  const { isAnimating } = useOptionalAnimation();
  const safeRest = sanitizeControlledMotionProps(restWithoutVariant);
  const isSlotChild = asChild && isSafeSkeletonAsChildHost(children as ReactNode);
  const resolvedIntent = normalizeValue<SkeletonIntent>(intent, skeletonVariants, 'secondary');
  const resolvedShape = normalizeValue<SkeletonShape>(shape, skeletonShapes, 'text');
  const resolvedAnimation = normalizeValue<SkeletonAnimation>(
    animation,
    skeletonAnimations,
    'pulse',
  );

  const classes = skeleton({
    shape: resolvedShape,
    animation: isAnimating ? resolvedAnimation : 'none',
    variant: resolvedIntent,
  });

  const toCssSize = (v: string | number | undefined) => {
    if (typeof v === 'number') return Number.isFinite(v) && v >= 0 ? `${v}px` : undefined;
    return v;
  };
  const resolvedWidth = toCssSize(width);
  const resolvedHeight = toCssSize(height);

  const sizeVars = {
    ...(resolvedWidth !== undefined && { '--skeleton-width': resolvedWidth }),
    ...(resolvedHeight !== undefined && { '--skeleton-height': resolvedHeight }),
  } as CSSProperties;

  const sizeStyle: MotionStyle = {
    ...sanitizeStaticStyle(style),
    ...sizeVars,
    ...(!isAnimating && createNoMotionStyle()),
  };
  // Slot merges the child's style after its own style. Put the resolved size variables on the
  // child as well, so `asChild` preserves the same public width/height precedence as the root.
  const staticChild = isValidElement<{
    style?: CSSProperties;
    'aria-hidden'?: boolean;
    inert?: boolean;
  }>(children)
    ? cloneElement(children, {
        style: {
          ...sanitizeStaticStyle(children.props.style),
          ...sizeVars,
          ...(!isAnimating && createNoMotionStyle()),
        },
        'aria-hidden': true,
        inert: true,
      })
    : children;

  if (isSlotChild) {
    // `rest` is typed as HTMLMotionProps which includes framer-motion event overloads
    // (e.g. onDrag with PanInfo) that are incompatible with Slot's standard React types.
    // Casting to HTMLAttributes is safe here: asChild delegates rendering to the consumer's
    // child element, so motion-specific event handlers are irrelevant in this branch.
    const htmlRest = sanitizeMotionPropsForSlot(safeRest) as React.HTMLAttributes<HTMLElement>;
    return (
      <MotionConfig skipAnimations={!isAnimating}>
        <Slot
          ref={ref}
          className={cx(classes, className)}
          style={sizeStyle as CSSProperties}
          {...htmlRest}
          aria-hidden="true"
          inert={true}
        >
          {staticChild as ReactNode}
        </Slot>
      </MotionConfig>
    );
  }

  return (
    <MotionConfig skipAnimations={!isAnimating}>
      <motion.span
        ref={ref}
        className={cx(classes, className)}
        style={sizeStyle}
        {...(safeRest as HTMLMotionProps<'span'>)}
        aria-hidden="true"
        inert={true}
      >
        {null}
      </motion.span>
    </MotionConfig>
  );
});

SkeletonImpl.displayName = 'Skeleton';
/**
 * Reserves visual space while content loads and remains hidden from assistive technology.
 *
 * Put `aria-busy` or status text on the owning loading region when an announcement is needed.
 * `asChild` is limited to `div`, `output`, and `span`; the delegated host and its content are
 * always made hidden and inert. Invalid recipe values fall back to the supported defaults, and
 * animation resolves to static when the animation provider disables motion.
 */
export const Skeleton = SkeletonImpl as SkeletonComponent;
