'use client';

import { cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, useId } from 'react';
import type { AccordionItemProps } from './Accordion.types';
import { useAccordion } from './AccordionContext';
import { AccordionItemContext } from './AccordionItemContext';

/**
 * A container for a single section of the accordion.
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: Panda CSS, Context Provider
 * ### Design Tokens
 * - border/spacing: silver-ratio tokens via recipe
 * ### Variant Logic
 * - Inherits visual variants automatically from the parent Accordion context.
 * @example
 * ```tsx
 * <AccordionItem value="unique-section">
 *   <AccordionTrigger>Title</AccordionTrigger>
 *   <AccordionContent>Panel info</AccordionContent>
 * </AccordionItem>
 * ```
 * ### Notes
 * Must be a direct child of Accordion. Must contain exactly one Trigger and one Content.
 * ### Accessibility
 * - Automatically generates a unique `id` for establishing WAI-ARIA linkages between its trigger and content.
 * ### AI Usage
 * - Wrap each collapsable section in this component.
 * - Ensure the `value` prop is stable and unique across items in the same Accordion.
 */
export const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ children, value, disabled, className, asChild, ...rest }, ref) => {
    const { classes } = useAccordion();
    const contentId = useId();

    const Component = asChild ? Slot : 'div';

    return (
      <AccordionItemContext.Provider value={{ value, contentId, disabled }}>
        <Component ref={ref} className={cx(classes.item, className)} {...rest}>
          {children}
        </Component>
      </AccordionItemContext.Provider>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';
