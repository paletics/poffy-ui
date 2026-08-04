'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { forwardRef, Fragment, isValidElement, type ReactNode, useMemo } from 'react';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { contentVariants } from './ContentTransition.presets';
import { ContentAnimationType, ContentTransitionProps } from './ContentTransition.types';
import { ContentTransitionPresence } from './ContentTransitionPresence';

const ContentTransitionImpl = forwardRef<HTMLDivElement, ContentTransitionProps>((props, ref) => {
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

  const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();

  const effectiveAnimationType =
    !shouldAnimate && animationType !== 'none' ? 'fade' : animationType;

  const canUseAsChild = Boolean(asChild && isValidElement(children) && children.type !== Fragment);
  const Component = useMemo(
    () => getMotionComponent(canUseAsChild ? Slot : 'div'),
    [canUseAsChild],
  );
  const animationKey = resolvePresetKey<typeof contentVariants, ContentAnimationType>(
    contentVariants,
    effectiveAnimationType,
    'fade',
  );
  const { transition, ...variants } = contentVariants[animationKey];
  const contentIdentity =
    transitionKey === undefined
      ? `fallback:${typeof children === 'string' ? children : 'content'}`
      : `${typeof transitionKey}:${String(transitionKey)}`;
  const shouldPlayEntrance = shouldAnimate && initial;
  const motionKey = `${contentIdentity}:${shouldPlayEntrance ? 'entrance' : 'static'}`;

  return (
    <AnimatePresence mode={mode} initial={false}>
      <ContentTransitionPresence
        key={motionKey}
        Component={Component}
        ref={ref}
        className={className}
        customData={customData}
        isAsChild={canUseAsChild}
        safeRest={sanitizeControlledMotionProps(rest)}
        shouldAnimate={shouldAnimate}
        staticStyle={sanitizeStaticStyle(style)}
        transition={applyMotionStyle(transition, resolvedMotionStyle)}
        variants={applyMotionStyle(variants, resolvedMotionStyle)}
      >
        {children as ReactNode}
      </ContentTransitionPresence>
    </AnimatePresence>
  );
});

ContentTransitionImpl.displayName = 'ContentTransition';

/**
 * Animates replacement content when `transitionKey` changes.
 *
 * The key identifies which child should enter and exit; without one, a limited
 * fallback identity is derived from string children. `mode` controls presence
 * sequencing. Exiting content is isolated from interaction by the presence
 * wrapper, and a reduced-motion policy yields a static transition. `asChild`
 * delegates only to one non-Fragment child.
 */

export const ContentTransition = defineMotionSlotComponent<HTMLDivElement, ContentTransitionProps>(
  ContentTransitionImpl,
);
