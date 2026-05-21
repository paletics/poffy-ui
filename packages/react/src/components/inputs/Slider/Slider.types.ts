import { SliderVariantProps } from '@/styled-system/recipes';
import { type SemanticIntent } from '@poffy-ui/types';
import { ComponentProps, ReactNode } from 'react';

/**
 * Variants for the Slider component based on Panda CSS recipe.
 */
export type SliderVariants = SliderVariantProps;

/** Semantic accent color for Slider. */
export type SliderIntent = Extract<
  SemanticIntent,
  'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
>;

/** Public Slider variant props with shared semantic intent names. */
export interface SliderVariantSubset extends Omit<SliderVariantProps, 'intent'> {
  /** Semantic accent color. */
  intent?: SliderIntent;
}

/**
 * Properties for the Slider component.
 * Supports standard HTML input attributes (range) and recipe variants.
 *
 * ### Notes
 * Slider renders a styled native `input[type="range"]`. Use `value` with
 * `onChange` for controlled state, or `defaultValue` for uncontrolled initial
 * state. Provide a visible label, `aria-label`, or `aria-labelledby`, and set
 * `min`, `max`, and `step` to match the domain being edited.
 *
 * Do: use `children` for adjacent label content when it describes the range.
 * Don't: use Slider for exact numeric entry where typing is required; use
 * NumberInput instead.
 *
 * @example
 * ```tsx
 * import { Slider } from '@poffy-ui/react/inputs';
 *
 * <Slider aria-label="Volume" min={0} max={100} value={volume} onChange={handleVolume} />
 * ```
 *
 * Related: NumberInputProps for typed numeric entry.
 */
export interface SliderProps
  extends Omit<ComponentProps<'input'>, 'size' | 'type'>, SliderVariantSubset {
  /**
   * Optional label content to display next to the slider.
   */
  children?: ReactNode;
}
