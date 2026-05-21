'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { forwardRef, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { contentVariants } from './ContentTransition.presets';
import { ContentAnimationType, ContentTransitionProps } from './ContentTransition.types';

/**
 * A polymorphic component that handles smooth content switching with various animation presets.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (`AnimatePresence`), Radix Slot
 * ### Design Tokens
 * - transition/timing: Defined by Silver Ratio scalars in `contentVariants` (e.g. `springs.snappy`).
 * ### Variant Logic
 * - animationType: 'fade', 'slide-up', 'zoom', 'morph', 'book-turn', etc.
 * @example
 * ```tsx
 * import { ContentTransition } from '@poffy-ui/react';
 *
 * <ContentTransition transitionKey={activeTabId} animationType="slide-up">
 *   <div>{activeTabContent}</div>
 * </ContentTransition>
 * ```
 * ### Notes
 * Internally manages `AnimatePresence`. To trigger animations, the `transitionKey` prop must change.
 * ### Accessibility
 * - Automatically falls back to `'fade'` or `'none'` when the user's OS has "prefer-reduced-motion" enabled.
 * ### AI Usage
 * - **DO**: Replace manual `AnimatePresence` + `motion.div` setups for tabs, steps, and conditional panels.
 * - **DO**: Provide a unique `transitionKey` when the children's shape changes.
 * - **DON'T**: Use for array item mutations; prefer `ReorderTransition` for keyed collections.
 */
export const ContentTransition = forwardRef<HTMLDivElement, ContentTransitionProps>(
  (props, ref) => {
    const {
      asChild,
      children,
      animationType = 'fade',
      mode = 'wait',
      transitionKey,
      customData,
      initial = true,
      className,
      style,
      ...rest
    } = props;

    const { isAnimating } = useOptionalAnimation();

    const effectiveAnimationType =
      !isAnimating && animationType !== 'none' ? 'fade' : animationType;

    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const variants = contentVariants[effectiveAnimationType as ContentAnimationType];

    return (
      <AnimatePresence mode={mode} initial={initial}>
        {/* eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support. */}
        <Component
          key={transitionKey ?? (typeof children === 'string' ? children : undefined)}
          ref={ref}
          className={className}
          style={style}
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          custom={customData}
          {...rest}
        >
          {children}
        </Component>
      </AnimatePresence>
    );
  },
);

ContentTransition.displayName = 'ContentTransition';
