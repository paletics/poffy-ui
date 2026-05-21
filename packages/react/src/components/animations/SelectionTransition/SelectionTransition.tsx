'use client';

import { Slot } from '@radix-ui/react-slot';
import { AnimatePresence } from 'motion/react';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { forwardRef, ReactNode, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { selectionVariants } from './SelectionTransition.presets';
import { SelectionAnimationType, SelectionTransitionProps } from './SelectionTransition.types';

/**
 * A controlled wrapper for selected-state indicators.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion (`AnimatePresence`), Radix Slot
 * ### Design Tokens
 * - transition: Uses Silver Ratio spring and duration presets from `selectionVariants`.
 * ### Variant Logic
 * - `check`: default selection mark entrance.
 * - `pop`: higher-emphasis dot or chip selection.
 * - `fade`: minimal visual state changes.
 * @example
 * ```tsx
 * import { SelectionTransition } from '@poffy-ui/react';
 *
 * <SelectionTransition isSelected={checked}>
 *   <CheckIcon aria-hidden="true" />
 * </SelectionTransition>
 * ```
 * ### Notes
 * `SelectionTransition` only animates the indicator. The owning control must still
 * provide semantic state through native checked attributes or ARIA such as `aria-selected`.
 * ### Accessibility
 * - Respects `prefers-reduced-motion`.
 * - Closed persistent indicators receive `aria-hidden`.
 * ### AI Usage
 * - **DO**: Use for Checkbox marks, Radio dots, Switch thumbs/marks, selected menu item markers,
 *   and active filter indicators.
 * - **DON'T**: Use as the selected-state source of truth; the owning input or option controls semantics.
 */
export const SelectionTransition = forwardRef<HTMLSpanElement, SelectionTransitionProps>(
  (
    {
      asChild,
      isSelected,
      animationType = 'check',
      transitionKey,
      keepMounted = false,
      initial = false,
      children,
      className,
      style,
      ...rest
    },
    ref,
  ) => {
    const { isAnimating } = useOptionalAnimation();
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'span'), [asChild]);
    const variants = selectionVariants[animationType as SelectionAnimationType];

    if (keepMounted) {
      return (
        // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
        <Component
          ref={ref}
          className={className}
          style={style}
          data-selected={isSelected ? '' : undefined}
          aria-hidden={!isSelected}
          initial={false}
          animate={!isAnimating || isSelected ? 'animate' : 'exit'}
          variants={isAnimating ? variants : undefined}
          transition={variants.transition}
          {...rest}
        >
          {children as ReactNode}
        </Component>
      );
    }

    return (
      <AnimatePresence mode="wait" initial={initial}>
        {isSelected && (
          // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
          <Component
            key={transitionKey ?? 'selected'}
            ref={ref}
            className={className}
            style={style}
            data-selected=""
            initial={isAnimating ? 'initial' : false}
            animate={isAnimating ? 'animate' : undefined}
            exit={isAnimating ? 'exit' : undefined}
            variants={isAnimating ? variants : undefined}
            transition={variants.transition}
            {...rest}
          >
            {children as ReactNode}
          </Component>
        )}
      </AnimatePresence>
    );
  },
);

SelectionTransition.displayName = 'SelectionTransition';
