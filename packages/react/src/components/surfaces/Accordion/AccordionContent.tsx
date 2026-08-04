'use client';

import { cx } from '@/styled-system/css';
import { forwardRef, useEffect, useId } from 'react';
import type { AccordionContentProps } from './Accordion.types';
import { useAccordion } from './AccordionContext';
import { useAccordionItem } from './AccordionItemContext';
import { CollapseTransition } from '@/components/animations';
import { ACCORDION_CONTENT_MARKER } from './AccordionTopology';

/**
 * Renders one AccordionItem details panel through `CollapseTransition`.
 *
 * A valid item makes it a labelled `region` owned by the trigger. Closed
 * content exits and unmounts; it does not retain application state on its own.
 * Use `Accordion.Trigger` to change state rather than panel click handlers.
 */
export const AccordionContent = forwardRef<HTMLDivElement, AccordionContentProps>((props, ref) => {
  const { children, className, initial, ...rest } = props;
  const { value: openValues, classes } = useAccordion();
  const { value, disabled, invalidStructure, panelId, registerContent, triggerId } =
    useAccordionItem();
  const generatedId = useId();
  const ownId = panelId ?? generatedId;
  useEffect(() => registerContent(ownId), [ownId, registerContent]);

  const isOpen = !disabled && !invalidStructure && openValues.includes(value);

  return (
    <CollapseTransition
      ref={ref}
      animationType="height-fade"
      customData={{ duration: 0.28 }}
      initial={initial}
      {...rest}
      // a11y-critical: always override consumer props to preserve WAI-ARIA linkage.
      id={ownId}
      role="region"
      aria-labelledby={!disabled && !invalidStructure ? triggerId : undefined}
      isOpen={isOpen}
      className={cx(classes.content, className)}
    >
      <div data-accordion-content-inner="">{children}</div>
    </CollapseTransition>
  );
});

AccordionContent.displayName = 'AccordionContent';
(AccordionContent as typeof AccordionContent & { [ACCORDION_CONTENT_MARKER]?: boolean })[
  ACCORDION_CONTENT_MARKER
] = true;
