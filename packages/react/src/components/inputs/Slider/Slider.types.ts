import { SliderVariantProps } from '@/styled-system/recipes';
import { type SemanticIntent } from '@poffy-ui/types';
import { ComponentProps, ReactNode } from 'react';

/** Visual recipe options for `Slider`. */
export type SliderVariants = SliderVariantProps;

/** Semantic accent color for Slider. */
export type SliderIntent = Extract<
  SemanticIntent,
  'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'danger'
>;

/** Slider recipe options with shared semantic intent names. */
export interface SliderVariantSubset extends Omit<SliderVariantProps, 'intent'> {
  /** Semantic accent color. */
  intent?: SliderIntent;
}

/**
 * Props for a native range field. Provide `children`, a native label, or an ARIA name.
 *
 * Native range ownership keeps the browser's min/max/step/value semantics. `FormControl` supplies
 * an omitted id, disabled/read-only state, invalid state, and helper/error associations.
 */
export interface SliderProps
  extends
    Omit<
      ComponentProps<'input'>,
      | 'size'
      | 'type'
      | 'role'
      | 'aria-orientation'
      | 'aria-valuemin'
      | 'aria-valuemax'
      | 'aria-valuenow'
      | 'aria-disabled'
      | 'aria-readonly'
      | 'aria-required'
      | 'required'
    >,
    SliderVariantSubset {
  /**
   * Optional visible label content rendered in the component's wrapping native `<label>`.
   */
  children?: ReactNode;
}
