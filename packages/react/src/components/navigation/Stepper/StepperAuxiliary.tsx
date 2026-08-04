import type { StepperAuxiliaryProps } from './Stepper.types';

/**
 * Marks non-step content that should be preserved inside a Stepper without
 * participating in step indexing or automatic separator placement.
 */
export const StepperAuxiliary = ({ children }: StepperAuxiliaryProps) => children;

StepperAuxiliary.displayName = 'Stepper.Auxiliary';
