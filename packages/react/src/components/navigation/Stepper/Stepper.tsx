'use client';

import { cx } from '@/styled-system/css';
import { stepper } from '@/styled-system/recipes';
import { Children, forwardRef, isValidElement, useMemo } from 'react';
import type { StepperRootProps } from './Stepper.types';
import { StepContext, StepperContext } from './StepperContext';

/**
 * A progress indicator guiding users through a sequential multi-step workflow.
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: stepper), StepperContext + StepContext
 * ### Design Tokens
 * - gap/sizing: silver-ratio tokens applied to connector length and step indicator diameter.
 * ### Variant Logic
 * - orientation: horizontal=left-to-right, vertical=top-to-bottom stack.
 * ### Notes
 * Distributes `index` and `isLast` per step via nested `StepContext` instead of `cloneElement`.
 * ### Accessibility
 * - Renders with `role="group"`. Each Step should contain a visible label for keyboard/screen reader users.
 * ### AI Usage
 * - Use for onboarding flows, checkout, setup wizards or any process with 2–6 sequential steps.
 *
 * @example
 * ```tsx
 * import { Step, Stepper } from '@poffy-ui/react/navigation';
 *
 * <Stepper activeStep={1} aria-label="Checkout process">
 *   <Step title="Cart" completed />
 *   <Step title="Shipping" />
 *   <Step title="Payment" />
 * </Stepper>
 * ```
 *
 * @example Controlled stepper
 * ```tsx
 * import { Step, Stepper } from '@poffy-ui/react/navigation';
 *
 * <Stepper activeStep={activeStep} onStepChange={setActiveStep} linear>
 *   <Step title="Account" />
 *   <Step title="Profile" />
 * </Stepper>
 * ```
 */
export const Stepper = forwardRef<HTMLDivElement, StepperRootProps>((props, ref) => {
  const {
    children,
    activeStep = 0,
    onStepChange,
    appearance,
    intent,
    orientation = 'horizontal',
    size,
    linear,
    className,
    ...rest
  } = props;

  const normalizedOrientation: 'horizontal' | 'vertical' =
    orientation === 'vertical' ? 'vertical' : 'horizontal';
  const classes = useMemo(
    () => stepper({ appearance, intent, orientation: normalizedOrientation, size }),
    [appearance, intent, normalizedOrientation, size],
  );

  const steps = Children.toArray(children).filter(isValidElement);

  const contextValue = useMemo(
    () => ({
      activeStep,
      classes,
      orientation: normalizedOrientation,
      linear,
      onStepChange,
    }),
    [activeStep, classes, normalizedOrientation, linear, onStepChange],
  );

  return (
    <StepperContext.Provider value={contextValue}>
      <div
        ref={ref}
        role="group"
        className={cx(classes.root, className)}
        data-orientation={normalizedOrientation}
        {...rest}
      >
        {steps.map((child, index) => {
          const isLast = index === steps.length - 1;
          return (
            <StepContext.Provider key={child.key} value={{ index, isLast }}>
              {child}
            </StepContext.Provider>
          );
        })}
      </div>
    </StepperContext.Provider>
  );
});

Stepper.displayName = 'Stepper.Root';
