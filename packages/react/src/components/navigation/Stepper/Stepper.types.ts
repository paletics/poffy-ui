import { stepper } from '@/styled-system/recipes';
import type { NavigationAppearance, NativeProps, SemanticIntent } from '@poffy-ui/types';
import { ReactNode } from 'react';

type StepperRecipeVariants = NonNullable<Parameters<typeof stepper>[0]>;

/** Layout direction for the complete stepper structure. */
export type StepperOrientation = 'horizontal' | 'vertical';

/**
 * Public Stepper variant props with shared navigation appearance and semantic intent names.
 */
export interface StepperVariantSubset extends Omit<
  StepperRecipeVariants,
  'appearance' | 'intent' | 'orientation'
> {
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
  /**
   * Layout direction. Responsive values are unsupported because orientation
   * also controls descendant structure, context, and accessibility semantics.
   */
  orientation?: StepperOrientation;
}

/** Canonical public variants accepted by Stepper. */
export type StepperVariants = StepperVariantSubset;


interface StepperRootBaseProps extends NativeProps<'div', StepperVariantSubset> {
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
   * Whether the workflow has reached its terminal completed state.
   * When true, every step and connector is rendered as completed and no step
   * is exposed as the current step.
   *
   * @defaultValue false
   */
  completed?: boolean;
  /**
   * Callback fired when the active step changes.
   * The component is controlled: update `activeStep` in response to this callback
   * to reflect a user selection.
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
  /**
   * Controls automatic connector rendering. `auto` preserves the existing
   * behavior; `manual` renders only explicit `StepperSeparator` children.
   * @defaultValue `'auto'`
   */
  separatorMode?: 'auto' | 'manual';
}

/** Public props for StepperRoot. */
export type StepperRootProps = Omit<StepperRootBaseProps, 'role'>;

/** Props for non-step content preserved inside a Stepper without consuming an index. */
export interface StepperAuxiliaryProps {
  children?: ReactNode;
}

/**
 * Props for the individual Step component.
 *
 * ### Notes
 * `title` and `description` are exposed through the step's native text content.
 * Rich supplemental content belongs in `children` for vertical steppers.
 */
export interface StepItemProps extends NativeProps<'div'> {
  /**
   * The primary label for the step.
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
export interface StepSeparatorProps extends NativeProps<'div'> {
  /** Whether this manual connector represents a completed step transition. */
  completed?: boolean;
}
