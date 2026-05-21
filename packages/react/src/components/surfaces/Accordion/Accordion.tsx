'use client';
import { cx } from '@/styled-system/css';
import { accordion } from '@/styled-system/recipes';
import { forwardRef, useMemo } from 'react';
import type { AccordionProps } from './Accordion.types';
import { AccordionContext } from './AccordionContext';
import { useAccordionState } from './useAccordionState';
import { Slot } from '@radix-ui/react-slot';

/**
 * A flexible, accessible accordion component for organizing content into collapsible sections.
 *
 * @example
 * ```tsx
 * import {
 *   Accordion,
 *   AccordionContent,
 *   AccordionItem,
 *   AccordionTrigger,
 * } from '@poffy-ui/react/surfaces';
 *
 * <Accordion defaultValue="billing">
 *   <AccordionItem value="billing">
 *     <AccordionTrigger>Billing</AccordionTrigger>
 *     <AccordionContent>Invoices and payment settings.</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 *
 * ### Notes
 * Required structure: each item needs a unique `value`, one trigger, and one content
 * region. Use `multiple` only when users need to compare sections side by side.
 *
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: accordion), Radix Slot, React State (useAccordionState)
 * ### Design Tokens
 * - padding/gap/border: silver-ratio tokens via accordion recipe
 * ### Variant Logic
 * - standard: Default visual enclosure. seamless: Minimal layout without borders.
 * @example
 * ```tsx
 * <Accordion multiple defaultValue={["item-1"]}>
 *   <AccordionItem value="item-1">
 *     <AccordionTrigger>Section 1</AccordionTrigger>
 *     <AccordionContent>Content</AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 * ```
 * ### Notes
 * Must contain AccordionItem children. Do not use without the prescribed child structure.
 * ### Accessibility
 * - Manages state for its children and ensures ARIA roles are coordinated.
 * ### AI Usage
 * - Use for FAQs, settings panels, or condensing large vertical layouts.
 * - Set `multiple={true}` to allow multiple sections to be open simultaneously.
 * - Do not use Accordion for primary navigation; use navigation components instead.
 *
 * Related API: `AccordionProps`.
 */
export const Accordion = forwardRef<HTMLDivElement, AccordionProps>((props, ref) => {
  const {
    children,
    multiple = false,
    value,
    defaultValue,
    onChange,
    className,
    appearance,
    variant,
    asChild,
    ...rest
  } = props;

  const { currentValue, toggle } = useAccordionState({
    multiple,
    value,
    defaultValue,
    onChange,
  });
  const resolvedAppearance =
    appearance ?? (variant === 'outline' ? 'outline' : variant === 'pop' ? 'soft' : 'soft');

  const classes = useMemo(
    () => accordion({ appearance: resolvedAppearance }),
    [resolvedAppearance],
  );

  const contextValue = useMemo(
    () => ({
      value: currentValue,
      toggle,
      multiple,
      classes,
    }),
    [currentValue, toggle, multiple, classes],
  );

  const Component = asChild ? Slot : 'div';

  return (
    <AccordionContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        {children}
      </Component>
    </AccordionContext.Provider>
  );
});

Accordion.displayName = 'Accordion';
