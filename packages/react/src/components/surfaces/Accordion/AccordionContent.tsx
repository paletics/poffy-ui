'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { AccordionContentProps } from './Accordion.types';
import { useAccordion } from './AccordionContext';
import { useAccordionItem } from './AccordionItemContext';
import { CollapseTransition } from '@/components/animations';

/**
 * The collapsible container that holds the content for an accordion section.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS, CollapseTransition
 * ### Design Tokens
 * - padding: silver ratio tokens via content recipe
 * ### Variant Logic
 * - Uses CollapseTransition for semantic open/close animations.
 * @example
 * ```tsx
 * <AccordionContent>Details revealed upon toggle.</AccordionContent>
 * ```
 * ### Notes
 * Do not attach click handlers meant to toggle the accordion to this panel.
 * ### Accessibility
 * - Implements `role="region"` and `aria-labelledby` automatically.
 * ### AI Usage
 * - Use to wrap the actual details inside an AccordionItem.
 * - Content is automatically unmounted/hidden when the item is closed via CollapseTransition.
 */
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>((props, ref) => {
  const { children, className, initial: _initial, ...rest } = props;
  const { value: openValues, classes } = useAccordion();
  const { value, contentId } = useAccordionItem();

  const isOpen = openValues.includes(value);

  return (
    <CollapseTransition
      ref={ref}
      animationType="height-fade"
      customData={{ duration: 0.28 }}
      {...rest}
      // a11y-critical: always override consumer props to preserve WAI-ARIA linkage.
      id={`${contentId}-content`}
      role="region"
      aria-labelledby={`${contentId}-trigger`}
      isOpen={isOpen}
      className={cx(classes.content, className)}
    >
      <div data-accordion-content-inner="">{children}</div>
    </CollapseTransition>
  );
});

AccordionContent.displayName = 'AccordionContent';
