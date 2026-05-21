'use client';

import { Slot } from '@radix-ui/react-slot';
import { MotionProps } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { forwardRef, ReactNode, useMemo } from 'react';
import { baseTokens } from '@poffy-ui/system';
import { getMotionComponent } from '../utils';
import { revealVariants } from './RevealTransition.presets';
import { RevealAnimationType, RevealTransitionProps } from './RevealTransition.types';

const reducedMotionVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};
const reducedMotionTransition = { duration: baseTokens.motion.durations.fast };

/**
 * A wrapper that triggers highly performant entrance animations when an element scrolls into the viewport.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (whileInView, Intersection Observer API), Radix Slot
 * ### Design Tokens
 * - translate/scale: Hooked into Silver Ratio motion equivalents via `revealVariants`.
 * ### Variant Logic
 * - animationType: 'fade-up', 'fade-down', 'fade-left', 'fade-right', 'zoom', or 'blur' defines spatial origin and emphasis.
 * @example
 * ```tsx
 * import { RevealTransition } from '@poffy-ui/react';
 *
 * // Reveals as soon as 20% of the element enters the viewport
 * <RevealTransition animationType="fade-up" threshold={0.2} asChild>
 *   <section>Content block</section>
 * </RevealTransition>
 * ```
 * ### Notes
 * Utilizes native `IntersectionObserver` via Framer Motion's `whileInView`, avoiding expensive `onScroll` event listener bindings.
 * ### Accessibility
 * - Must map to user's "prefer-reduced-motion" settings or default to a simple opacity fade if disabled at higher levels.
 * ### AI Usage
 * - **DO**: Wrap landing page sections, marketing cards, and heavy text blocks to choreograph scroll reading.
 * - **DO**: Keep `once` enabled unless repeated scroll playback is a core interaction.
 * - **DON'T**: Hide information that must be immediately measurable or announced behind a delayed reveal.
 */
export const RevealTransition = forwardRef<HTMLDivElement, RevealTransitionProps>(
  (
    {
      asChild,
      children,
      animationType = 'fade-up',
      viewport,
      threshold,
      once = true,
      delay = 0,
      customData,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);
    const { isAnimating } = useOptionalAnimation();

    const animationKey = animationType as RevealAnimationType;
    const baseVariant = revealVariants[animationKey] as MotionProps;

    const activeVariants = isAnimating ? baseVariant.variants : reducedMotionVariants;
    const activeTransition = isAnimating ? baseVariant.transition : reducedMotionTransition;

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        {...rest}
        variants={activeVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once,
          // Negative bottom margin triggers animation before element is fully visible
          margin: '0px 0px -20% 0px',
          amount: threshold ?? 0.2,
          ...viewport,
        }}
        transition={{ ...activeTransition, delay }}
        custom={customData}
      >
        {children as ReactNode}
      </Component>
    );
  },
);

RevealTransition.displayName = 'RevealTransition';
