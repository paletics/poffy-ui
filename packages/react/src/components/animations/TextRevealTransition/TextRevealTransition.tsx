'use client';

import { cx } from '@/styled-system/css';
import { textRevealTransition } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import type { MotionStyle } from 'motion/react';
import { applyMotionStyle } from '@/providers/motionStyle';
import {
  createNoMotionStyle,
  defineMotionSlotComponent,
  sanitizeControlledMotionProps,
  sanitizeStaticStyle,
} from '@/types/motion';
import { cloneElement, forwardRef, isValidElement, ReactElement, ReactNode, useMemo } from 'react';
import { withNoMotionStyle } from '@/components/shared/withNoMotionStyle';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import { getMotionComponent, resolvePresetKey } from '../utils';
import { useHydratedAnimationPolicy } from '../useHydratedAnimationPolicy';
import { textContainerVariants, textVariants } from './TextRevealTransition.presets';
import { TextAnimationType, TextRevealTransitionProps } from './TextRevealTransition.types';

const TextRevealTransitionImpl = forwardRef<HTMLDivElement, TextRevealTransitionProps>(
  (
    {
      asChild,
      children,
      animationType = 'bounce',
      viewport,
      staggerDelay = 0.057,
      className,
      style,
      customData,
      ...rest
    },
    ref,
  ) => {
    const MotionSlot = useMemo(() => getMotionComponent(Slot), []);
    const MotionDiv = useMemo(() => getMotionComponent('div'), []);
    const MotionSpan = useMemo(() => getMotionComponent('span'), []);
    const { resolvedMotionStyle, shouldAnimate } = useHydratedAnimationPolicy();
    const safeRest = sanitizeControlledMotionProps(rest);
    const classes = textRevealTransition();
    const staticStyle = (
      shouldAnimate ? sanitizeStaticStyle(style) : createNoMotionStyle(style)
    ) as MotionStyle | undefined;
    const canUseAsChild = Boolean(asChild && isNonVoidAsChildHost(children as ReactNode));
    const staticChildren = withNoMotionStyle(
      children as ReactNode,
      !shouldAnimate && canUseAsChild,
    );

    const MotionComponent = canUseAsChild ? MotionSlot : MotionDiv;
    const animationKey = resolvePresetKey<typeof textVariants, TextAnimationType>(
      textVariants,
      animationType,
      'bounce',
    );

    const { elements, isWordMode, textContent } = useMemo(() => {
      let text = '';
      if (typeof children === 'string') {
        text = children;
      } else if (
        canUseAsChild &&
        isValidElement<{ children?: ReactNode }>(children) &&
        typeof children.props.children === 'string'
      ) {
        text = children.props.children;
      }

      if (!shouldAnimate || animationKey === 'none' || !text) {
        return { elements: [], isWordMode: false, textContent: text };
      }

      const isWord = animationKey === 'word-pop';
      return {
        elements: text.split(isWord ? ' ' : ''),
        isWordMode: isWord,
        textContent: text,
      };
    }, [animationKey, canUseAsChild, children, shouldAnimate]);

    if (elements.length === 0) {
      return (
        // eslint-disable-next-line react-hooks/static-components -- MotionComponent is resolved through the shared motion cache for polymorphic asChild support.
        <MotionComponent
          ref={ref}
          className={cx(classes.root, className)}
          style={staticStyle}
          {...safeRest}
        >
          {staticChildren}
        </MotionComponent>
      );
    }

    const content = (
      <span aria-hidden="true">
        {elements.map((el, i) => {
          return (
            <MotionSpan
              key={`${i}-${el}`}
              className={classes.char}
              variants={applyMotionStyle(textVariants[animationKey], resolvedMotionStyle)}
              custom={customData}
            >
              {el === ' ' ? '\u00A0' : el}
              {isWordMode && i !== elements.length - 1 && '\u00A0'}
            </MotionSpan>
          );
        })}
      </span>
    );

    return (
      // eslint-disable-next-line react-hooks/static-components -- MotionComponent is resolved through the shared motion cache for polymorphic asChild support.
      <MotionComponent
        ref={ref}
        className={cx(classes.root, className)}
        variants={
          shouldAnimate ? applyMotionStyle(textContainerVariants, resolvedMotionStyle) : undefined
        }
        initial={false}
        animate={shouldAnimate ? 'hidden' : undefined}
        whileInView={shouldAnimate ? 'visible' : undefined}
        viewport={{
          once: true,
          margin: '0px 0px -14.14% 0px',
          amount: 0.2,
          ...viewport,
        }}
        aria-label={textContent}
        custom={staggerDelay}
        style={staticStyle}
        {...safeRest}
        role={canUseAsChild ? undefined : 'group'}
      >
        {canUseAsChild && isValidElement(children)
          ? cloneElement(children as ReactElement<{ children?: ReactNode }>, undefined, content)
          : content}
      </MotionComponent>
    );
  },
);

TextRevealTransitionImpl.displayName = 'TextRevealTransition';

/**
 * Splits short plain text into spans for a staged entrance animation.
 *
 * It is intended for presentation text, not as the only way to convey new
 * content. Animation policy can render it statically, and `asChild` delegates
 * to one non-Fragment host while replacing that host’s content with the spans.
 */

export const TextRevealTransition = defineMotionSlotComponent<
  HTMLDivElement,
  TextRevealTransitionProps
>(TextRevealTransitionImpl);
