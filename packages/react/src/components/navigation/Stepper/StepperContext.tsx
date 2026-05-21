'use client';

import { createContext, useContext } from 'react';

/**
 * Value provided by the StepperContext.
 */
interface StepperContextValue {
  /**
   * The current active step index.
   */
  activeStep: number;
  /**
   * Generated recipe classes for Stepper slots.
   */
  classes: {
    root: string;
    item: string;
    trigger: string;
    indicator: string;
    indicatorContent: string;
    body: string;
    title: string;
    description: string;
    content: string;
    separator: string;
  };
  /**
   * Layout orientation of the stepper.
   */
  orientation: 'horizontal' | 'vertical';
  /**
   * Whether the stepper follows a linear progression.
   */
  linear?: boolean;
  /**
   * Callback to notify when a step is selected.
   */
  onStepChange?: (step: number) => void;
}

/**
 * Context for the Stepper component suite.
 */
export const StepperContext = createContext<StepperContextValue | null>(null);

/**
 * Context value for a single Stepper step.
 *
 * This exists to support Stepper composition; application code should access
 * it through `useStep()`.
 */
interface StepContextValue {
  index: number;
  isLast: boolean;
}

/**
 * React context carrying state for a single Stepper step.
 */
export const StepContext = createContext<StepContextValue | null>(null);

/**
 * Custom hook to access the Step's index and position.
 */
export const useStep = () => {
  const context = useContext(StepContext);
  if (!context) {
    throw new Error('useStep must be used within a <Stepper /> component wrapper around <Step />');
  }
  return context;
};

/**
 * Custom hook to access the Stepper context.
 *
 * @throws {Error} `useStepper must be used within a <Stepper /> component`
 * @returns `StepperContextValue`
 */
export const useStepper = () => {
  const context = useContext(StepperContext);
  if (!context) {
    throw new Error('useStepper must be used within a <Stepper /> component');
  }
  return context;
};
