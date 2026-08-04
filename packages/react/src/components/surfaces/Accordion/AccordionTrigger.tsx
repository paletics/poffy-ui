'use client';

import { cx } from '@/styled-system/css';
import { forwardRef, useEffect, useId } from 'react';
import { ChevronDownIcon } from '@/components/media/Icon/icons';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import type { AccordionTriggerProps } from './Accordion.types';
import { useAccordion } from './AccordionContext';
import { useAccordionItem } from './AccordionItemContext';
import { ACCORDION_TRIGGER_MARKER } from './AccordionTopology';

/**
 * Toggles its AccordionItem's details panel through a fixed native button.
 *
 * It manages `aria-expanded` and, while the mounted panel exists,
 * `aria-controls`; closed panels unmount so a persistent IDREF would be
 * invalid. The trigger is wrapped in a heading unless the root sets
 * `headingLevel={null}`. Nested interactive content is made safe and a
 * decorative chevron is appended.
 */
export const AccordionTrigger = forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  // This fixed button owns the critical WAI-ARIA attributes and does not support asChild.
  (rawProps, ref) => {
    const {
      children,
      className,
      onClick,
      'aria-controls': _ariaControls,
      'aria-disabled': _ariaDisabled,
      'aria-expanded': _ariaExpanded,
      'aria-haspopup': _ariaHasPopup,
      'aria-pressed': _ariaPressed,
      'aria-selected': _ariaSelected,
      disabled: _disabled,
      id: _id,
      role: _role,
      tabIndex: _tabIndex,
      type: _type,
      ...rest
    } = rawProps as AccordionTriggerProps & {
      'aria-controls'?: unknown;
      'aria-disabled'?: unknown;
      'aria-expanded'?: unknown;
      'aria-haspopup'?: unknown;
      'aria-pressed'?: unknown;
      'aria-selected'?: unknown;
      disabled?: unknown;
      id?: unknown;
      role?: unknown;
      tabIndex?: unknown;
      type?: unknown;
    };
    const { toggle, value: openValues, classes, headingLevel } = useAccordion();
    const { value, disabled, invalidStructure, panelId, registerTrigger, triggerId } =
      useAccordionItem();
    const generatedId = useId();
    const ownId = triggerId ?? generatedId;
    useEffect(() => registerTrigger(ownId), [ownId, registerTrigger]);

    const isOpen = !disabled && !invalidStructure && openValues.includes(value);
    const safeChildren = getSafeInteractiveContent(children, { preserveOpaque: true });

    return (
      <div
        role={headingLevel === null ? undefined : 'heading'}
        aria-level={headingLevel ?? undefined}
      >
        <button
          ref={ref}
          className={cx(classes.trigger, className)}
          {...rest}
          type="button"
          // a11y-critical: always override consumer props to preserve WAI-ARIA linkage.
          id={ownId}
          onClick={(e) => {
            onClick?.(e);
            if (e.defaultPrevented) return;
            if (!disabled && !invalidStructure) toggle(value);
          }}
          aria-expanded={isOpen}
          // aria-controls is set only when the panel is open (mounted in DOM).
          // When closed, AnimatePresence unmounts the panel, making a persistent IDREF invalid.
          // WAI-ARIA APG: aria-controls is optional; aria-expanded alone conveys the open/closed state.
          aria-controls={isOpen ? panelId : undefined}
          disabled={disabled || invalidStructure}
        >
          {safeChildren}
          <span className={classes.indicator} data-open={isOpen ? '' : undefined}>
            <ChevronDownIcon size="sm" />
          </span>
        </button>
      </div>
    );
  },
);

AccordionTrigger.displayName = 'AccordionTrigger';
(AccordionTrigger as typeof AccordionTrigger & { [ACCORDION_TRIGGER_MARKER]?: boolean })[
  ACCORDION_TRIGGER_MARKER
] = true;
