'use client';

import { Slot } from '@radix-ui/react-slot';
import type { AnimationDefinition, MotionProps, Transition, Variants } from 'motion/react';
import { forwardRef, Fragment, isValidElement, useMemo } from 'react';
import { applyMotionStyle } from '@/providers/motionStyle';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { getCustomValue, getMotionComponent, resolvePresetKey } from '../utils';
import { useOneShotEntranceVariant } from '../useOneShotEntranceVariant';
import { actionVariants } from './ActionMotion.presets';
import type { ActionMotionType } from './ActionMotion.presets';
import type { ActionMotionProps } from './ActionMotion.types';

/** Motion variant label for ActionMotion's initial entrance state. */
export const actionEntranceLabel = '__poffyActionEnter';
/** Motion variant label for ActionMotion's non-animated settled state. */
export const actionSettledLabel = '__poffyActionSettled';

const ActionMotionImpl = forwardRef<HTMLDivElement, ActionMotionProps>(
  (
    {
      asChild,
      animationType = 'press',
      disabled = false,
      'aria-disabled': ariaDisabled,
      customData,
      children,
      className,
      style,
      onAnimationComplete: consumerAnimationComplete,
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

    const disabledStates = [disabled, ariaDisabled];
    const isDisabled = disabledStates.includes(true) ? true : disabledStates.includes('true');
    const { isAnimating, resolvedMotionStyle } = useOptionalAnimation();
    const hasAnimationType = animationType !== false && animationType !== 'none';
    const shouldAnimate =
      isAnimating &&
      !isDisabled &&
      hasAnimationType &&
      !(resolvedMotionStyle === 'subtle' && animationType === 'pulse');
    const animationKey = resolvePresetKey<typeof actionVariants, ActionMotionType>(
      actionVariants,
      animationType,
      'press',
    );
    const preset = actionVariants[animationKey];
    const rawTransition =
      hasAnimationType && 'transition' in preset ? preset.transition : undefined;
    const resolvedTransition =
      typeof rawTransition === 'function' ? rawTransition(customData) : rawTransition;
    const styledPreset = shouldAnimate
      ? (applyMotionStyle(preset, resolvedMotionStyle) as MotionProps)
      : {};
    const {
      initial: _presetInitial,
      animate: presetAnimate,
      transition: _presetTransition,
      ...interactionProps
    } = styledPreset;
    const transition = applyMotionStyle(
      resolvedTransition,
      shouldAnimate ? resolvedMotionStyle : 'none',
    ) as Transition | undefined;
    const entranceScale = animationKey === 'physical' ? 0.95 : 0.98;
    const entranceVariants: Variants = {
      [actionEntranceLabel]:
        animationKey === 'stagger'
          ? { opacity: 1, transition }
          : {
              opacity: [0, 1],
              y: [10, 0],
              scale: [entranceScale, 1],
              transition,
            },
      [actionSettledLabel]: { opacity: 1, y: 0, scale: 1, transition: { duration: 0 } },
    };
    const staggerChildren = getCustomValue(customData, 'staggerChildren', 0);
    const orchestratesEntrance =
      animationKey === 'stagger' ? true : Number.isFinite(staggerChildren) && staggerChildren > 0;
    const isAmbientAnimation = ['pulse', 'shake'].includes(animationKey);
    const {
      completeSettlement,
      isHydrated,
      isSettling,
      ownsEntrance,
      settleEntrance,
      target: entranceTarget,
    } = useOneShotEntranceVariant({
      enabled: shouldAnimate,
      enter: actionEntranceLabel,
      entranceIdentity: animationKey,
      settled: actionSettledLabel,
      shouldEnter: orchestratesEntrance,
    });
    const isEntranceActive = ownsEntrance && entranceTarget === actionEntranceLabel;
    const animate = !isHydrated
      ? undefined
      : isEntranceActive
        ? entranceTarget
        : isSettling
          ? actionSettledLabel
          : isAmbientAnimation && hasAnimationType
            ? shouldAnimate
              ? presetAnimate
              : actionSettledLabel
            : ownsEntrance
              ? entranceTarget
              : !hasAnimationType
                ? undefined
                : orchestratesEntrance
                  ? entranceTarget
                  : undefined;
    const handleAnimationComplete = (definition: AnimationDefinition) => {
      if (definition === actionEntranceLabel) settleEntrance();
      if (definition === actionSettledLabel) {
        completeSettlement();
        return;
      }
      consumerAnimationComplete?.(definition);
    };

    void _presetInitial;
    void _presetTransition;

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={sanitizeStaticStyle(style)}
        aria-disabled={ariaDisabled}
        {...sanitizeControlledMotionProps(rest)}
        {...interactionProps}
        transition={shouldAnimate ? transition : undefined}
        variants={isHydrated && (hasAnimationType || ownsEntrance) ? entranceVariants : undefined}
        initial={false}
        animate={animate}
        onAnimationComplete={handleAnimationComplete}
        custom={customData}
      >
        {children}
      </Component>
    );
  },
);

ActionMotionImpl.displayName = 'ActionMotion';

/**
 * Applies a preset interaction motion without owning the child’s action state.
 *
 * Motion runs only when the nearest animation policy permits it and the child
 * is not disabled. `animationType={false}` or `"none"` disables it. `asChild`
 * delegates to one non-Fragment child; otherwise a `div` is rendered. The
 * component sanitizes controlled Motion props and preserves a stable settled state.
 */

export const ActionMotion = defineMotionSlotComponent<HTMLDivElement, ActionMotionProps>(
  ActionMotionImpl,
);
