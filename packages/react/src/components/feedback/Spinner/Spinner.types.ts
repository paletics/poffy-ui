import { spinner } from '@/styled-system/recipes';
import { type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';

/**
 * Variants for the Spinner component, driven by Panda CSS recipes.
 *
 * ### Notes
 * Prefer `intent` for new code. `variant` is retained as a legacy
 * semantic color alias.
 */
export interface SpinnerVariants {
  /**
   * Semantic accent color.
   * @defaultValue 'primary'
   */
  intent?: SemanticIntent;
  /** Legacy semantic color alias. Prefer `intent`. */
  variant?: SemanticIntent;
  /**
   * Visual animation style.
   * @defaultValue 'spin'
   */
  animation?:
    | 'spin'
    | 'dash'
    | 'breathe'
    | 'pop-spin'
    | 'refined-dash'
    | 'trail'
    | 'elastic'
    | 'orbit-glow'
    | 'silver'
    | 'none';
}

/**
 * Props for the Spinner component.
 *
 * @example
 * ```tsx
 * import { Spinner } from '@poffy-ui/react/feedback';
 *
 * <Spinner aria-label="Loading invoices" />
 * ```
 *
 * ### Notes
 * Do: provide a specific `aria-label` when multiple loading indicators are visible.
 * Don't: use Spinner for determinate progress; use ProgressBar or CircleProgress.
 *
 * ### AI Usage
 * - Use for unknown-duration loading.
 * - Pair long-running loading states with nearby text that explains what is loading.
 */
export type SpinnerProps = PrimitiveProps<'span', SpinnerVariants> & {
  /**
   * Diameter of the spinner in pixels.
   * @defaultValue 40
   */
  size?: number;
  /**
   * Stroke thickness of the spinner.
   * @defaultValue 4
   */
  thickness?: number;
};

/**
 * Internal common props for Spinner's Motion sub-components.
 */
export interface SpinnerInternalProps {
  size: number;
  thickness: number;
  radius: number;
  circumference: number;
  /** Resolved CSS classes from Panda CSS recipe. */
  classes: ReturnType<typeof spinner>;
}
