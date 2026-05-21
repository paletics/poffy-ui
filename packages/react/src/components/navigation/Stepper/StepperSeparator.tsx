'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { StepSeparatorProps } from './Stepper.types';
import { useStepper } from './StepperContext';

/**
 * A decorative separator displayed between steps in the Stepper.
 */
export const StepperSeparator = forwardRef<HTMLDivElement, StepSeparatorProps>((props, ref) => {
  const { className, ...rest } = props;
  const { classes } = useStepper();
  return <div ref={ref} className={cx(classes.separator, className)} {...rest} />;
});

StepperSeparator.displayName = 'StepperSeparator';
