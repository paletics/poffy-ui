import { circleProgress } from '@/styled-system/recipes';
import { type FeedbackAppearance, type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';

/**
 * Variants for the CircleProgress component, driven by Panda CSS recipes.
 *
 * ### Notes
 * Prefer `intent` for new code. `variant` is retained as a legacy
 * semantic color alias.
 */
export interface CircleProgressVariants {
  /**
   * Public surface treatment for the circular indicator.
   * @defaultValue 'solid'
   */
  appearance?: Extract<FeedbackAppearance, 'solid' | 'soft'>;
  /**
   * Semantic accent color.
   * @defaultValue 'primary'
   */
  intent?: Extract<
    SemanticIntent,
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
  >;
  /** Legacy semantic color alias. Prefer `intent`. */
  variant?: 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger';
  /**
   * Progress animation mode.
   * @defaultValue 'progress'
   */
  animation?: 'progress' | 'none';
}

/**
 * Props for the CircleProgress component.
 *
 * @example
 * ```tsx
 * import { CircleProgress } from '@poffy-ui/react/feedback';
 *
 * <CircleProgress value={72} showValue aria-label="Upload progress" />
 * ```
 *
 * ### Notes
 * Do: provide `aria-label` or `aria-labelledby` because the root renders
 * `role="progressbar"`.
 * Don't: use CircleProgress for unknown-duration loading; use Spinner instead.
 *
 * ### AI Usage
 * - Use for determinate circular progress where a numeric value is known.
 * - Keep `value` in the 0-100 range; rendering clamps out-of-range values.
 */
export type CircleProgressProps = PrimitiveProps<'span', CircleProgressVariants> & {
  /**
   * The current progress value (0 to 100).
   *
   * ### Notes
   * Values outside the range are clamped for ARIA and visual rendering.
   */
  value: number;
  /**
   * Diameter of the circle in pixels.
   * @defaultValue 100
   */
  size?: number;
  /**
   * Stroke thickness of the progress indicator.
   * @defaultValue 8
   */
  thickness?: number;
  /**
   * Whether to show the numeric value in the center.
   * @defaultValue false
   */
  showValue?: boolean;
};

/**
 * Internal common props for CircleProgress sub-components.
 */
export interface InternalProgressProps {
  size: number;
  thickness: number;
  radius: number;
  circumference: number;
  /** Resolved CSS classes from Panda CSS recipe. */
  classes: ReturnType<typeof circleProgress>;
}
