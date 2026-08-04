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
 * Visual checked or indeterminate mark for Checkbox.Root.
 *
 * It renders nothing when unchecked, uses static SVG by default, and switches to selection motion
 * only when the root's `animated` option is enabled. The mark is decorative; Checkbox.Input owns
 * the native checked state.
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
