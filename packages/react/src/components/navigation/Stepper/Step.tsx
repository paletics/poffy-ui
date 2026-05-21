'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { CollapseTransition, IconSwapTransition } from '@/components/animations';
import { PressablePrimitive } from '@/components/inputs/PressablePrimitive';
import { cx } from '@/styled-system/css';
import { forwardRef, useCallback } from 'react';
import { CheckOutlineIcon } from '@/components/media/Icon/icons';
import type { StepItemProps } from './Stepper.types';
import { useStep, useStepper } from './StepperContext';

/**
 * An individual step within a Stepper component.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules, Stack: ActionMotion, Recipe: stepper
 * ### Design Tokens
 * - spacing: silver-ratio, sizes: silver-ratio, colors: brand.main
 * ### Variant Logic
 * - inactive: Default state. active: Current step. completed: Finished step with checkmark.
 * ### Accessibility
 * - Handles aria-current="step" and provides descriptive aria-labels for each step.
 * - Use a short visible `title`; optional `description` should clarify the step.
 * ### AI Usage
 * - **DO**: Render only as a direct child of `Stepper` so step index context is available.
 * - **DO**: Put vertical step details in `children`; horizontal steppers should
 *   keep details outside the compact step row.
 * - **DON'T**: Manually pass index values or use `Step` as a standalone progress item.
 *
 * @example Stepper steps
 * ```tsx
 * import { Step, Stepper } from '@poffy-ui/react/navigation';
 *
 * <Stepper activeStep={1} aria-label="Checkout progress">
 *   <Step title="Cart" completed />
 *   <Step title="Shipping" description="Address and delivery" />
 *   <Step title="Payment" />
 * </Stepper>
 * ```
 *
 * @example Vertical step content
 * ```tsx
 * import { Step, Stepper } from '@poffy-ui/react/navigation';
 *
 * <Stepper orientation="vertical" activeStep={0}>
 *   <Step title="Profile">Profile form fields</Step>
 *   <Step title="Security">Security settings</Step>
 * </Stepper>
 * ```
 */
export const Step = forwardRef<HTMLDivElement, StepItemProps>((props, ref) => {
  const { children, className, title, description, completed: propCompleted, ...rest } = props;
  const { activeStep, classes, orientation, onStepChange, linear } = useStepper();
  const { index, isLast } = useStep();

  const isCompleted = propCompleted ?? index < activeStep;
  const isActive = propCompleted ? false : index === activeStep;
  const isClickable = [!linear, isCompleted, index === activeStep, index === activeStep + 1].some(
    Boolean,
  );
  const accessibleTitle = title ?? `Step ${index + 1}`;

  const handleClick = useCallback(() => {
    if (onStepChange && isClickable) {
      onStepChange(index);
    }
  }, [onStepChange, isClickable, index]);

  return (
    <div
      ref={ref}
      className={cx(classes.item, className)}
      data-state={isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}
      {...rest}
    >
      <ActionMotion asChild animationType="press" disabled={!isClickable}>
        <PressablePrimitive
          className={classes.trigger}
          onClick={handleClick}
          disabled={!isClickable}
          aria-current={isActive ? 'step' : undefined}
          aria-label={`Step ${index + 1}: ${accessibleTitle}${isCompleted ? ' (completed)' : ''}`}
        >
          <div
            className={classes.indicator}
            data-state={isActive ? 'active' : isCompleted ? 'completed' : 'inactive'}
          >
            <IconSwapTransition
              className={classes.indicatorContent}
              transitionKey={isCompleted ? 'completed' : `step-${index}`}
            >
              {isCompleted ? <CheckOutlineIcon /> : index + 1}
            </IconSwapTransition>
          </div>
          <div className={classes.body}>
            {title && <div className={classes.title}>{title}</div>}
            {description && <div className={classes.description}>{description}</div>}
          </div>
        </PressablePrimitive>
      </ActionMotion>
      {!isLast && (
        <div className={classes.separator} data-state={isCompleted ? 'completed' : 'inactive'} />
      )}

      {orientation === 'vertical' && children && (
        <CollapseTransition isOpen={isActive} className={classes.content}>
          <div>{children}</div>
        </CollapseTransition>
      )}
    </div>
  );
});

Step.displayName = 'Stepper.Step';
