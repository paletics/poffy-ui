'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence, type MotionProps, type MotionStyle } from 'motion/react';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  createNoMotionStyle,
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import {
  forwardRef,
  Fragment,
  isValidElement,
  type ComponentType,
  type ReactNode,
  type Ref,
  useMemo,
} from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import {
  isolatePresenceChild,
  useExitPresenceIsolation,
  type PresenceSafeRest,
} from '../presenceIsolation';
import { overlayVariants } from './OverlayTransition.presets';
import { OverlayAnimationType, OverlayTransitionProps } from './OverlayTransition.types';

type MotionComponent = ComponentType<MotionProps & Record<string, unknown>>;

interface PresenceAwareOverlayProps {
  Component: MotionComponent;
  isAsChild: boolean;
  children: ReactNode;
  className?: string;
  customData?: Record<string, unknown>;
  layout?: OverlayTransitionProps['layout'];
  layoutId?: string;
  ref: Ref<HTMLDivElement>;
  safeRest: PresenceSafeRest;
  shouldAnimate: boolean;
  staticStyle: MotionStyle | undefined;
  styledTransition: MotionProps['transition'];
  styledVariants: MotionProps['variants'];
}

const PresenceAwareOverlay = ({
  Component,
  children,
  className,
  customData,
  isAsChild,
  layout,
  layoutId,
  ref,
  safeRest,
  shouldAnimate,
  staticStyle,
  styledTransition,
  styledVariants,
}: PresenceAwareOverlayProps) => {
  const { isPresent, renderedChildren } = useExitPresenceIsolation(children, isAsChild);
  const inertValue = safeRest.inert;

  return (
    <Component
      ref={ref}
      className={className}
      {...safeRest}
      style={{ ...staticStyle, pointerEvents: isPresent ? staticStyle?.pointerEvents : 'none' }}
      data-visible={isPresent}
      initial={shouldAnimate ? 'initial' : false}
      animate={shouldAnimate ? 'animate' : undefined}
      exit={shouldAnimate ? 'exit' : undefined}
      variants={shouldAnimate ? styledVariants : undefined}
      transition={shouldAnimate ? styledTransition : undefined}
      layout={shouldAnimate ? layout : false}
      layoutId={shouldAnimate ? layoutId : undefined}
      custom={customData}
      aria-hidden={isPresent ? safeRest['aria-hidden'] : true}
      inert={isPresent ? inertValue : true}
    >
      {renderedChildren}
    </Component>
  );
};

const OverlayTransitionImpl = forwardRef<HTMLDivElement, OverlayTransitionProps>(
  (
    {
      asChild,
      isVisible,
      animationType = 'fade',
      keepMounted = false,
      layout,
      layoutId,
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
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const safeRest = sanitizeControlledMotionProps(rest);
    const inertValue = safeRest.inert;

    const animationKey = resolvePresetKey<typeof overlayVariants, OverlayAnimationType>(
      overlayVariants,
      animationType,
      'fade',
    );
    const variants = overlayVariants[animationKey];
    const transition = useMemo(
      () =>
        typeof variants.transition === 'function'
          ? variants.transition(customData)
          : variants.transition,
      [variants, customData],
    );
    const styledVariants = applyMotionStyle(variants.variants, resolvedMotionStyle);
    const styledTransition = applyMotionStyle(transition, resolvedMotionStyle);
    const noMotionTransition = applyMotionStyle({ transition }, 'none').transition;
    const staticStyle = (
      !shouldAnimate ? createNoMotionStyle(style) : sanitizeStaticStyle(style)
    ) as MotionStyle | undefined;
    const staticChildren = withNoMotionStyle(
      children as ReactNode,
      !shouldAnimate && canUseAsChild,
    );
    const renderedPersistentChildren = isolatePresenceChild(
      staticChildren as ReactNode,
      canUseAsChild && !isVisible,
    );

    if (keepMounted) {
      // Preserve the DOM node while hidden for consumers that need stable structure or focus ownership.
      return (
        // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
        <Component
          ref={ref}
          className={className}
          {...safeRest}
          style={{ ...staticStyle, pointerEvents: isVisible ? staticStyle?.pointerEvents : 'none' }}
          data-visible={isVisible}
          inert={!isVisible ? true : inertValue}
          initial={false}
          animate={isVisible ? 'animate' : 'exit'}
          variants={styledVariants}
          transition={shouldAnimate ? styledTransition : noMotionTransition}
          layout={shouldAnimate ? layout : false}
          layoutId={shouldAnimate ? layoutId : undefined}
          custom={customData}
          aria-hidden={!isVisible ? true : safeRest['aria-hidden']}
        >
          {renderedPersistentChildren as ReactNode}
        </Component>
      );
    }

    // Fully unmount on close so AnimatePresence can own exit animation lifecycle.
    return (
      <AnimatePresence>
        {isVisible && (
          <PresenceAwareOverlay
            Component={Component}
            isAsChild={canUseAsChild}
            ref={ref}
            className={className}
            safeRest={safeRest}
            staticStyle={staticStyle}
            shouldAnimate={shouldAnimate}
            styledVariants={styledVariants}
            styledTransition={styledTransition}
            layout={layout}
            layoutId={layoutId}
            customData={customData}
          >
            {staticChildren as ReactNode}
          </PresenceAwareOverlay>
        )}
      </AnimatePresence>
    );
  },
);

OverlayTransitionImpl.displayName = 'OverlayTransition';

/**
 * Animates caller-controlled overlay visibility without owning overlay semantics.
 *
 * The caller retains focus management, dismissal, and dialog/menu roles. By
 * default a hidden overlay unmounts after its exit; `keepMounted` keeps it in
 * the DOM but disables pointer events, marks it inert, and hides it from
 * assistive technology. Exiting content gets the same isolation immediately.
 * `asChild` delegates to one non-Fragment child.
 */

export const OverlayTransition = defineMotionSlotComponent<HTMLDivElement, OverlayTransitionProps>(
  OverlayTransitionImpl,
);
