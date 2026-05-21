'use client';

import { cx } from '@/styled-system/css';
import { textRevealTransition } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { cloneElement, forwardRef, isValidElement, ReactElement, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { textContainerVariants, textVariants } from './TextRevealTransition.presets';
import { TextAnimationType, TextRevealTransitionProps } from './TextRevealTransition.types';

/**
 * A highly specialized kinetic typography component that orchestrates staggered character/word reveals.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (whileInView, stagger), Radix Slot, Panda Recipe
 * ### Design Tokens
 * - staggerDelay: Mapped to `durations.silver.fastest` equivalent (0.057s default). viewport margin: Hooks into Silver Ratio padding formulas.
 * ### Variant Logic
 * - animationType: 'bounce', 'fade', 'word-pop', etc. Determines how each split string segment enters.
 * @example
 * ```tsx
 * import { TextRevealTransition } from '@poffy-ui/react';
 *
 * // Splits string into characters and bounces them in sequentially.
 * <TextRevealTransition animationType="bounce" asChild>
 *   <h1>Headline Text</h1>
 * </TextRevealTransition>
 * ```
 * ### Notes
 * String parsing is heavy. Do not use this on large paragraphs. Restrict usage to Headers `<h1>`-`<h4>` and short Hero text.
 * ### Accessibility
 * - To prevent screen readers from reading characters individually, the split characters are wrapped in `aria-hidden="true"`, while the original string is provided to the container via `aria-label`. Respects OS `reduced-motion` flags instantly.
 * ### AI Usage
 * - **DO**: Use for hero sections, landing pages, and high-impact typographic focal points.
 * - **DO**: Pass a raw string as `children`, or ensure the immediate `asChild` element contains a text node.
 * - **DON'T**: Use on long paragraphs or translated copy whose segmentation rules are unknown.
 */
export const TextRevealTransition = forwardRef<HTMLDivElement, TextRevealTransitionProps>(
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
    const { isAnimating } = useOptionalAnimation();
    const classes = textRevealTransition();

    const MotionComponent = asChild ? MotionSlot : MotionDiv;

    const { elements, isWordMode, textContent } = useMemo(() => {
      let text = '';
      if (typeof children === 'string') {
        text = children;
      } else if (
        asChild &&
        isValidElement<{ children?: ReactNode }>(children) &&
        typeof children.props.children === 'string'
      ) {
        text = children.props.children;
      }

      if (!isAnimating || animationType === 'none' || !text) {
        return { elements: [], isWordMode: false, textContent: text };
      }

      const isWord = animationType === 'word-pop';
      return {
        elements: text.split(isWord ? ' ' : ''),
        isWordMode: isWord,
        textContent: text,
      };
    }, [children, animationType, isAnimating, asChild]);

    if (elements.length === 0) {
      return (
        // eslint-disable-next-line react-hooks/static-components -- MotionComponent is resolved through the shared motion cache for polymorphic asChild support.
        <MotionComponent ref={ref} className={cx(classes.root, className)} style={style} {...rest}>
          {children}
        </MotionComponent>
      );
    }

    const content = (
      <span aria-hidden="true">
        {elements.map((el, i) => {
          const animationKey = animationType as TextAnimationType;
          return (
            <MotionSpan
              key={`${i}-${el}`}
              className={classes.char}
              variants={textVariants[animationKey]}
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
        role="group"
        variants={textContainerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          margin: '0px 0px -14.14% 0px',
          amount: 0.2,
          ...viewport,
        }}
        aria-label={textContent}
        custom={staggerDelay}
        style={style}
        {...rest}
      >
        {asChild && isValidElement(children)
          ? cloneElement(children as ReactElement<{ children?: ReactNode }>, undefined, content)
          : content}
      </MotionComponent>
    );
  },
);

TextRevealTransition.displayName = 'TextRevealTransition';
