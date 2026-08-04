import { circleProgress } from '@/styled-system/recipes';
import { type FeedbackAppearance, type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Visual and motion options for `CircleProgress`. */
export interface CircleProgressVariants {
  /**
   * Public surface treatment for the circular indicator.
   * @defaultValue `'solid'`
   */
  appearance?: Extract<FeedbackAppearance, 'solid' | 'soft'>;
  /**
   * Semantic accent color.
   * @defaultValue `'primary'`
   */
  intent?: Extract<
    SemanticIntent,
    'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
  >;
  /**
   * Progress animation mode.
   * @defaultValue `'progress'`
   */
  animation?: 'progress' | 'none';
}

type CircleProgressOwnProps = CircleProgressVariants & {
  /**
   * The current progress value (0 to 100).
   *
   * ### Notes
   * Finite values outside the range are clamped; non-finite values render as 0.
   */
  value: number;
  /**
   * Preferred maximum diameter of the circle in pixels. The rendered circle
   * shrinks to fit a narrower containing block. Invalid values fall back to 100.
   * Use at least 48px when `showValue` is visible and at least 64px for a short
   * custom center label. Smaller unlabelled indicators remain supported; when a
   * labelled circle shrinks below these values, center-label readability is not guaranteed.
   * @defaultValue `100`
   */
  size?: number;
  /**
   * Stroke thickness of the progress indicator. Invalid values fall back to 8;
   * valid values are capped to fit inside the normalized size.
   * @defaultValue `8`
   */
  thickness?: number;
  /**
   * Whether to show the numeric value in the center.
   * @defaultValue `false`
   */
  showValue?: boolean;
};

type CircleProgressNativeProps = PrimitiveProps<'span', CircleProgressOwnProps>;
type CircleProgressAsChildElement = ReactElement<
  Record<string, unknown>,
  'div' | 'output' | 'span'
>;

export type CircleProgressDefaultProps = DefaultHostProps<CircleProgressNativeProps>;
export type CircleProgressAsChildProps = RetargetedAsChildHostProps<
  CircleProgressNativeProps,
  HTMLElement,
  CircleProgressAsChildElement
>;
/** Public props for CircleProgress. */
export type CircleProgressProps = CircleProgressDefaultProps | CircleProgressAsChildProps;
export type CircleProgressComponent = PolymorphicAsChildComponent<
  CircleProgressDefaultProps,
  CircleProgressAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

/**
 * Internal common props for CircleProgress sub-components.
 */
export interface InternalProgressProps {
  size: number;
  thickness: number;
  radius: number;
  /** Resolved CSS classes from Panda CSS recipe. */
  classes: ReturnType<typeof circleProgress>;
}
