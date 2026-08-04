'use client';

import { Slot } from '@radix-ui/react-slot';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo } from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { type MotionStyle, Variants } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  createNoMotionStyle,
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { loopVariants } from './LoopEffect.presets';
import { LoopAnimationType, LoopEffectProps } from './LoopEffect.types';

const LoopEffectImpl = forwardRef<HTMLDivElement, LoopEffectProps>(
  (
    {
      asChild,
      animationType = 'float',
      isPaused = false,
      duration,
      customData,
      children,
      className,
      style,
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
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();

    const animationKey = resolvePresetKey<typeof loopVariants, LoopAnimationType>(
      loopVariants,
      animationType,
      'float',
    );
    const variants = loopVariants[animationKey];

    const isStatic = [
      isPaused,
      animationKey === 'none',
      !isAnimating,
      resolvedMotionStyle === 'subtle',
    ].some(Boolean);
    const staticStyle = (!isAnimating ? createNoMotionStyle(style) : sanitizeStaticStyle(style)) as
      | MotionStyle
      | undefined;
    const staticChildren = withNoMotionStyle(children as ReactNode, !isAnimating && canUseAsChild);

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={staticStyle}
        {...sanitizeControlledMotionProps(rest)}
        variants={
          isStatic
            ? undefined
            : (applyMotionStyle(variants, resolvedMotionStyle) as unknown as Variants)
        }
        animate={isStatic ? undefined : 'animate'}
        custom={isStatic ? undefined : { ...customData, duration }}
      >
        {staticChildren as ReactNode}
      </Component>
    );
  },
);

LoopEffectImpl.displayName = 'LoopEffect';

/**
 * Applies a non-essential looping visual effect.
 *
 * It becomes static when paused, when `animationType` is `none`, when the
 * animation provider disables motion, or when that provider selects the
 * subtle policy. The effect must not be the only indication of state. `asChild`
 * delegates to one non-Fragment child; otherwise it renders a `div`.
 */

export const LoopEffect = defineMotionSlotComponent<HTMLDivElement, LoopEffectProps>(
  LoopEffectImpl,
);
