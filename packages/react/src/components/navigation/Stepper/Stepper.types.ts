import { stepper } from '@/styled-system/recipes';
import type { NavigationAppearance, NativeProps, SemanticIntent } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Variants for the Stepper component based on Panda CSS recipe.
 */
export type StepperVariants = NonNullable<Parameters<typeof stepper>[0]>;

/**
 * Public Stepper variant props with shared navigation appearance and semantic intent names.
 */
export interface StepperVariantSubset extends Omit<StepperVariants, 'appearance' | 'intent'> {
  /**
   * Surface treatment.
   *
   * @defaultValue recipe default
   */
  appearance?: Extract<NavigationAppearance, 'soft' | 'outline'>;
  /**
   * Semantic accent color.
   *
   * @defaultValue recipe default
   */
  intent?: Extract<SemanticIntent, 'primary' | 'secondary' | 'success' | 'warning' | 'danger'>;
}

/**
 * Props for the root Stepper component.
 *
 * @example
 * ```tsx
 * import { Step, Stepper } from '@poffy-ui/react/navigation';
 * ```
 *
 * ### Notes
 * Required structure: `Stepper` should contain only `Step` children. `activeStep`
 * and `onStepChange` are 0-indexed. Use `aria-label` to name the workflow.
 *
 * ### AI Usage
 * - Do: use for finite linear workflows such as checkout, onboarding, or setup.
 * - Don't: use Stepper as general navigation between unrelated pages.
 */
export interface StepperRootProps extends NativeProps<'div', StepperVariantSubset> {
  /**
   * The stepper steps (typically <Step /> components).
   */
  children?: ReactNode;
  /**
   * Accessible label for the stepper group.
   * Recommended for screen readers to identify the purpose of the stepper.
   * @example "Checkout process"
   */
  'aria-label'?: string;
  /**
   * The index of the currently active step (0-indexed).
   * @defaultValue 0
   */
  activeStep?: number;
  /**
   * Callback fired when the active step changes.
   */
  onStepChange?: (step: number) => void;
  /**
   * If true, steps must be completed in order.
   * @defaultValue false
   *
   * ### Notes
   * Users may move only to completed, current, or next available steps.
   */
  linear?: boolean;
}

/**
 * Props for the individual Step component.
 *
 * ### Notes
 * `title` should be plain text because it is incorporated into the generated
 * accessible label. Rich content belongs in `children` for vertical steppers.
 */
export interface StepItemProps extends NativeProps<'div'> {
  /**
   * The primary label for the step. Also used in aria-label, so must be a plain string.
   */
  title?: string;
  /**
   * Additional descriptive text for the step.
   */
  description?: string;
  /**
   * The content to display when this step is active (vertical orientation only).
   */
  children?: ReactNode;
  /**
   * Whether the step is explicitly marked as completed.
   * If not provided, completion is inferred from the Stepper's activeStep.
   */
  completed?: boolean;
}

/**
 * Props for the StepperSeparator component.
 *
 * ### Notes
 * Decorative connector between steps. The normal `Stepper` rendering
 * inserts separators through `Step`; export is available for custom compositions.
 */
export type StepSeparatorProps = NativeProps<'div'>;
