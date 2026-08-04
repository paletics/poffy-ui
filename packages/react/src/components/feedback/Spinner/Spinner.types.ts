import { spinner } from '@/styled-system/recipes';
import type { PoffyMotionStyle } from '@/providers/AnimationProvider.types';
import { type SemanticIntent, PrimitiveProps } from '@poffy-ui/types';
import type { ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Visual and animation options for `Spinner`. */
export interface SpinnerVariants {
  /**
   * Semantic accent color.
   * @defaultValue `'primary'`
   */
  intent?: SemanticIntent;
  /**
   * Visual animation style.
   * @defaultValue `'spin'`
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

type SpinnerOwnProps = SpinnerVariants & {
  /**
   * Removes the loading status from the accessibility tree when another
   * component owns the loading semantics.
   *
   * Decorative spinners are also inert so slotted descendants cannot remain
   * focusable inside an aria-hidden subtree.
   * @defaultValue `false`
   */
  decorative?: boolean;
  /**
   * Preferred maximum diameter of the spinner in pixels. The rendered spinner
   * shrinks to fit a narrower containing block.
   * @defaultValue `40`
   */
  size?: number;
  /**
   * Stroke thickness of the spinner.
   * @defaultValue `4`
   */
  thickness?: number;
};

type SpinnerNativeProps = PrimitiveProps<'span', SpinnerOwnProps>;
type SpinnerAsChildElement = ReactElement<Record<string, unknown>, 'div' | 'output' | 'span'>;

export type SpinnerDefaultProps = DefaultHostProps<SpinnerNativeProps>;
export type SpinnerAsChildProps = RetargetedAsChildHostProps<
  SpinnerNativeProps,
  HTMLElement,
  SpinnerAsChildElement
>;
/** Public props for Spinner. */
export type SpinnerProps = SpinnerDefaultProps | SpinnerAsChildProps;
export type SpinnerComponent = PolymorphicAsChildComponent<
  SpinnerDefaultProps,
  SpinnerAsChildProps,
  HTMLSpanElement,
  HTMLElement
>;

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
  motionStyle: PoffyMotionStyle;
}
