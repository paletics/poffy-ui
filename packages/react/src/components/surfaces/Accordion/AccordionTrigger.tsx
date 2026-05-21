'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { ChevronDownIcon } from '@/components/media/Icon/icons';
import type { AccordionTriggerProps } from './Accordion.types';
import { useAccordion } from './AccordionContext';
import { useAccordionItem } from './AccordionItemContext';

/**
 * The clickable header that toggles the accordion item's visibility.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS, Radix Slot patterns
 * ### Design Tokens
 * - padding/font-size: silver ratio via trigger recipe, animation: snappy duration for chevron
 * ### Variant Logic
 * - Operates as the interactive affordance (button).
 * @example
 * ```tsx
 * <AccordionTrigger>Toggle Me</AccordionTrigger>
 * ```
 * ### Notes
 * Do not wrap this inside other interactive elements like `<a>` or `<button>`, as it already renders as a button.
 * ### Accessibility
 * - Implements WAI-ARIA `aria-expanded` and `aria-controls`. Automatically assigns an `id` matching its content panel.
 * ### AI Usage
 * - Use as the immediate child of AccordionItem.
 * - Automatically handles `onClick` to communicate with the parent Accordion state.
 */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  // asChild is intentionally not supported here: this component owns critical WAI-ARIA
  // attributes (aria-expanded, aria-controls, id) that must always render on a <button>.
  // Destructuring prevents it from bleeding into DOM props via ...rest.
  ({ children, className, onClick, asChild: _asChild, ...rest }, ref) => {
    const { toggle, value: openValues, classes } = useAccordion();
    const { value, contentId, disabled } = useAccordionItem();

    const isOpen = openValues.includes(value);

    return (
      <button
        ref={ref}
        type="button"
        className={cx(classes.trigger, className)}
        {...rest}
        // a11y-critical: always override consumer props to preserve WAI-ARIA linkage.
        id={`${contentId}-trigger`}
        onClick={(e) => {
          onClick?.(e);
          toggle(value);
        }}
        aria-expanded={isOpen}
        // aria-controls is set only when the panel is open (mounted in DOM).
        // When closed, AnimatePresence unmounts the panel, making a persistent IDREF invalid.
        // WAI-ARIA APG: aria-controls is optional; aria-expanded alone conveys the open/closed state.
        aria-controls={isOpen ? `${contentId}-content` : undefined}
        disabled={disabled}
      >
        {children}
        <span className={classes.indicator} data-open={isOpen ? '' : undefined}>
          <ChevronDownIcon size="sm" />
        </span>
      </button>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';
