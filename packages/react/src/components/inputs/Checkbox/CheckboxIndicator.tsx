'use client';

import { forwardRef } from 'react';
import { SelectionTransition } from '@/components/animations';
import { useCheckbox } from './CheckboxContext';
import { checkbox } from '@/styled-system/recipes';
import { CheckIcon } from './CheckIcon';
import { IndeterminateIcon } from './IndeterminateIcon';
import { StaticCheckIcon } from './StaticCheckIcon';
import { StaticIndeterminateIcon } from './StaticIndeterminateIcon';

/**
 * Animated checkmark or indeterminate line for the Checkbox.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: SelectionTransition, PathDrawTransition
 *
 * ### Notes
 * Motion is localized to the checkmark path for optimal performance.
 *
 * ### Accessibility
 * - Mark icons as decorative; checked and indeterminate state belong to `CheckboxInput`.
 * - Keep the indicator inside `CheckboxControl` or the root compound checkbox.
 *
 * ### AI Usage
 * - Internal use only.
 *
 * @example Compound checkbox indicator
 * ```tsx
 * import { CheckboxIndicator } from './CheckboxIndicator';
 *
 * <CheckboxIndicator />
 * ```
 */
export const CheckboxIndicator = forwardRef<HTMLSpanElement>((_, ref) => {
  const { size, intent, error, checked, indeterminate, animated } = useCheckbox();
  const classes = checkbox({ size, intent, error });
  const isSelected = [indeterminate, checked].some(Boolean);

  if (!isSelected) {
    return <span ref={ref} className={classes.icon} />;
  }

  if (!animated) {
    return (
      <span ref={ref} className={classes.icon}>
        {indeterminate ? <StaticIndeterminateIcon /> : <StaticCheckIcon />}
      </span>
    );
  }

  return (
    <span ref={ref} className={classes.icon}>
      <SelectionTransition
        isSelected={isSelected}
        transitionKey={indeterminate ? 'indeterminate' : 'check'}
      >
        {indeterminate ? <IndeterminateIcon /> : <CheckIcon />}
      </SelectionTransition>
    </span>
  );
});

CheckboxIndicator.displayName = 'Checkbox.Indicator';
