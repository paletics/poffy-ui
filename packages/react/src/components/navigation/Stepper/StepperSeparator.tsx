'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { StepSeparatorProps } from './Stepper.types';
import { useStepper } from './StepperContext';

/**
 * A decorative separator displayed between steps in the Stepper.
 */
export const StepperSeparator = forwardRef<HTMLDivElement, StepSeparatorProps>((props, ref) => {
  const { className, completed, ...rest } = props;
  const { classes, isComplete } = useStepper();
  const isCompleted = [isComplete, completed === true].some(Boolean);
  return (
    <div
      ref={ref}
      className={cx(classes.separator, className)}
      {...rest}
      data-stepper-separator="manual"
      data-state={isCompleted ? 'completed' : 'inactive'}
      aria-hidden="true"
    />
  );
});

StepperSeparator.displayName = 'StepperSeparator';
