'use client';

import { Slot } from '@radix-ui/react-slot';
import { mergeRefs } from '@poffy-ui/behavior/hooks';
import { css, cx } from '@/styled-system/css';
import { AnimatePresence, type MotionStyle, type Variants } from 'motion/react';
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
  ReactNode,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { collapseVariants } from './CollapseTransition.presets';
import { CollapseAnimationType, CollapseTransitionProps } from './CollapseTransition.types';

const heightCollapseClassName = css({
  display: 'flow-root',
  // Motion clips height transitions with an inline overflow style. A focused child needs its
  // external ring immediately, even before the transition's overflow reset runs.
  _focusWithin: {
    overflow: 'visible !important',
  },
});

const CollapseTransitionImpl = forwardRef<HTMLDivElement, CollapseTransitionProps>(
  (
    {
      asChild,
      isOpen,
      animationType = 'height-fade',
      keepMounted = false,
      initial = false,
      customData,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const canUseAsChild = Boolean(
      asChild && isValidElement(children) && children.type !== Fragment,
    );
    const Component = useMemo(
      () => getMotionComponent(canUseAsChild ? Slot : 'div'),
      [canUseAsChild],
    );
    const animationKey = resolvePresetKey<typeof collapseVariants, CollapseAnimationType>(
      collapseVariants,
      animationType,
      'height-fade',
    );
    const variants = collapseVariants[animationKey];
    const animatesHeight = ['height', 'height-fade'].includes(animationKey);
    const resolvedClassName = cx(animatesHeight && heightCollapseClassName, className);
    const nodeRef = useRef<HTMLElement | null>(null);
    const mergedRef = useMemo(
      () => mergeRefs<HTMLElement>(nodeRef, ref as React.Ref<HTMLElement>),
      [ref],
    );
    const transition = useMemo(
      () =>
        typeof variants.transition === 'function'
          ? variants.transition(customData)
          : variants.transition,
      [variants, customData],
    );
    const reducedTransition = shouldAnimate
      ? applyMotionStyle(transition, resolvedMotionStyle)
      : { duration: 0 };
    const openTarget = variants.animate;
    const closedTarget = variants.exit;

    // AnimatePresence retains an exiting node after `isOpen` becomes false. Hide
    // that interval from assistive technology and keyboard interaction immediately,
    // rather than waiting for the visual exit animation to complete.
    useLayoutEffect(() => {
      if (keepMounted) return;
      const node = nodeRef.current;
      if (!node) return;

      if (isOpen) {
        node.removeAttribute('aria-hidden');
        node.removeAttribute('inert');
        return;
      }

      node.setAttribute('aria-hidden', 'true');
      node.setAttribute('inert', '');
    }, [isOpen, keepMounted]);

    const motionVariants = animatesHeight
      ? undefined
      : !shouldAnimate
        ? undefined
        : (applyMotionStyle(variants, resolvedMotionStyle) as unknown as Variants);
    const staticStyle = (
      shouldAnimate ? sanitizeStaticStyle(style) : createNoMotionStyle(style)
    ) as MotionStyle | undefined;
    const staticChildren = withNoMotionStyle(
      children as ReactNode,
      !shouldAnimate && canUseAsChild,
    );

    if (keepMounted) {
      return (
        // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
        <Component
          ref={mergedRef}
          className={resolvedClassName}
          style={staticStyle}
          {...sanitizeControlledMotionProps(rest)}
          data-state={isOpen ? 'open' : 'closed'}
          aria-hidden={!isOpen}
          inert={!isOpen ? true : undefined}
          hidden={!shouldAnimate && !isOpen ? true : undefined}
          initial={false}
          animate={shouldAnimate ? (isOpen ? openTarget : closedTarget) : undefined}
          variants={shouldAnimate ? motionVariants : undefined}
          transition={shouldAnimate ? reducedTransition : undefined}
          custom={shouldAnimate ? customData : undefined}
        >
          {staticChildren as ReactNode}
        </Component>
      );
    }

    return (
      <AnimatePresence initial={false}>
        {isOpen && (
          // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
          <Component
            key={shouldAnimate && initial ? 'collapse-entrance' : 'collapse-static'}
            ref={mergedRef}
            className={resolvedClassName}
            style={staticStyle}
            data-state="open"
            initial={shouldAnimate ? closedTarget : false}
            animate={shouldAnimate ? openTarget : undefined}
            exit={shouldAnimate ? closedTarget : undefined}
            variants={shouldAnimate ? motionVariants : undefined}
            transition={shouldAnimate ? reducedTransition : undefined}
            custom={shouldAnimate ? customData : undefined}
            {...sanitizeControlledMotionProps(rest)}
          >
            {staticChildren as ReactNode}
          </Component>
        )}
      </AnimatePresence>
    );
  },
);

CollapseTransitionImpl.displayName = 'CollapseTransition';

/**
 * Animates a caller-controlled open region without managing disclosure state.
 *
 * With `keepMounted={false}` (the default), closed content is removed after
 * its exit animation; while exiting it is immediately inert and hidden from
 * assistive technology. With `keepMounted`, the closed region remains mounted
 * but is inert and `aria-hidden`. Motion policy can reduce this to an instant
 * state change. `asChild` delegates to one non-Fragment child.
 */

export const CollapseTransition = defineMotionSlotComponent<
  HTMLDivElement,
  CollapseTransitionProps
>(CollapseTransitionImpl);
