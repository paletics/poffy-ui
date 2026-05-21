'use client';

import { Slot } from '@radix-ui/react-slot';
import { MotionProps } from 'motion/react';
import { forwardRef, useMemo } from 'react';
import { getMotionComponent } from '../utils';
import { actionVariants } from './ActionMotion.presets';
import type { ActionMotionType } from './ActionMotion.presets';
import type { ActionMotionProps } from './ActionMotion.types';

/**
 * A highly reusable transition wrapper that provides standardized micro-interactions (hover, tap, focus).
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Framer Motion, Radix Slot
 * ### Design Tokens
 * - scale/timing: Derived directly from Silver Ratio motion presets (`springs`, `motionScales`).
 * ### Variant Logic
 * - animationType: 'press' (default, bouncy), 'physical' (shadow depth), 'subtle' (minimal), etc.
 * @example
 * ```tsx
 * import { ActionMotion } from '@poffy-ui/react';
 *
 * <ActionMotion animationType="physical" asChild>
 *   <button>Click Me</button>
 * </ActionMotion>
 * ```
 * ### Notes
 * Acts purely as an animation shell. It relies on Framer Motion's event dispatching (`whileHover`, `whileTap`) rather than React's event loop.
 * ### Accessibility
 * - Relies on the child element (via `asChild`) to carry the correct interactive semantics (`role="button"`, `tabIndex`, etc.).
 * ### AI Usage
 * - **DO**: Use as the interaction animation shell around buttons, links, cards, and other actionable atoms.
 * - **DO**: Pass `asChild` when the child element already owns semantic behavior or event handlers.
 * - **DON'T**: Attach `onClick` handlers to `ActionMotion`; attach them directly to the underlying child element.
 */
export const ActionMotion = forwardRef<HTMLDivElement, ActionMotionProps>(
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
      ...rest
    },
    ref,
  ) => {
    const Component = useMemo(() => getMotionComponent(asChild ? Slot : 'div'), [asChild]);

    const disabledStates = [disabled, ariaDisabled];
    const isDisabled = disabledStates.includes(true) ? true : disabledStates.includes('true');
    const shouldAnimate = !isDisabled && animationType !== false && animationType !== 'none';
    const animationKey = animationType as ActionMotionType;
    const variants = shouldAnimate ? (actionVariants[animationKey] as MotionProps) : {};

    return (
      // eslint-disable-next-line react-hooks/static-components -- Component is resolved through the shared motion cache for polymorphic asChild support.
      <Component
        ref={ref}
        className={className}
        style={style}
        aria-disabled={ariaDisabled}
        {...rest}
        {...variants}
        custom={customData}
      >
        {children}
      </Component>
    );
  },
);

ActionMotion.displayName = 'ActionMotion';
