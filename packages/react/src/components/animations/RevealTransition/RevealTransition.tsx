'use client';

import { Slot } from '@radix-ui/react-slot';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo, useState } from 'react';
import { isolatePresenceChild } from '../presenceIsolation';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { revealVariants } from './RevealTransition.presets';
import { RevealAnimationType, RevealTransitionProps } from './RevealTransition.types';

const RevealTransitionImpl = forwardRef<HTMLDivElement, RevealTransitionProps>(
  (
    {
      asChild,
      children,
      animationType = 'fade-up',
      viewport,
      threshold,
      once = true,
      delay = 0,
      duration,
      blurAmount,
      customData,
      className,
      style,
      onViewportEnter,
      onViewportLeave,
      ...rest
    },
    ref,
  ) => {
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const safeRest = sanitizeControlledMotionProps(rest);
    const [hasEntered, setHasEntered] = useState(false);
    const staticStyle = sanitizeStaticStyle(style);
    const effectiveOnce = viewport?.once ?? once;

    const animationKey = resolvePresetKey<typeof revealVariants, RevealAnimationType>(
      revealVariants,
      animationType,
      'fade-up',
    );
    const baseVariant = revealVariants[animationKey];

    const normalizedBlurAmount =
      typeof blurAmount === 'number' && Number.isFinite(blurAmount) && blurAmount >= 0
        ? blurAmount
        : undefined;
    const activeVariants =
      shouldAnimate && animationKey === 'blur' && normalizedBlurAmount !== undefined
        ? {
            ...baseVariant.variants,
            hidden: {
              ...baseVariant.variants.hidden,
              filter: `blur(${normalizedBlurAmount}px)`,
            },
          }
        : baseVariant.variants;
    const baseTransition = baseVariant.transition;
    const normalizedThreshold =
      typeof threshold === 'number' && Number.isFinite(threshold)
        ? Math.min(1, Math.max(0, threshold))
        : 0.2;
    const normalizedDuration =
      typeof duration === 'number' && Number.isFinite(duration) && duration >= 0
        ? duration
        : undefined;
    const normalizedDelay =
      typeof delay === 'number' && Number.isFinite(delay) && delay >= 0 ? delay : 0;
    const activeTransition =
      normalizedDuration === undefined
        ? baseTransition
        : { ...baseTransition, duration: normalizedDuration };
    const isHidden = shouldAnimate && !hasEntered;
    const renderedChildren = isolatePresenceChild(children as ReactNode, canUseAsChild && isHidden);
    const handleViewportEnter = (entry: IntersectionObserverEntry | null) => {
      setHasEntered(true);
      onViewportEnter?.(entry);
    };
    const handleViewportLeave = (entry: IntersectionObserverEntry | null) => {
      if (!effectiveOnce) setHasEntered(false);
      onViewportLeave?.(entry);
    };

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={{
          ...staticStyle,
          pointerEvents: isHidden ? 'none' : staticStyle?.pointerEvents,
        }}
        {...safeRest}
        variants={shouldAnimate ? applyMotionStyle(activeVariants, resolvedMotionStyle) : undefined}
        initial={false}
        animate={shouldAnimate ? 'hidden' : undefined}
        whileInView={shouldAnimate ? 'visible' : undefined}
        viewport={{
          // Negative bottom margin triggers animation before element is fully visible
          margin: '0px 0px -20% 0px',
          amount: normalizedThreshold,
          ...viewport,
          once: effectiveOnce,
        }}
        transition={
          shouldAnimate
            ? applyMotionStyle({ ...activeTransition, delay: normalizedDelay }, resolvedMotionStyle)
            : undefined
        }
        custom={customData}
        aria-hidden={isHidden ? true : safeRest['aria-hidden']}
        inert={isHidden ? true : safeRest.inert}
        onViewportEnter={handleViewportEnter}
        onViewportLeave={handleViewportLeave}
      >
        {renderedChildren as ReactNode}
      </Component>
    );
  },
);

RevealTransitionImpl.displayName = 'RevealTransition';

/**
 * Reveals content when it enters the viewport.
 *
 * Before its first reveal, animated content is inert, hidden from assistive
 * technology, and cannot receive pointer events. `once` defaults to true;
 * setting it false lets leave events reset the hidden state. Threshold, delay,
 * duration, and blur values are normalized to safe ranges. When motion is
 * disabled, content is immediately available. `asChild` delegates to one child.
 */

export const RevealTransition = defineMotionSlotComponent<HTMLDivElement, RevealTransitionProps>(
  RevealTransitionImpl,
);
