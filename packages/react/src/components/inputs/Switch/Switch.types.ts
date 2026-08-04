import { type ControlIntent, NativeProps } from '@poffy-ui/types';
import type { SwitchControlVariantProps } from '@/styled-system/recipes';
import type { ReactNode } from 'react';

/** Visual recipe options for Switch; checked state continues to use the native input props. */
export type SwitchVariants = SwitchControlVariantProps;

/** Switch recipe options using shared intent names. */
export interface SwitchVariantSubset extends Omit<SwitchControlVariantProps, 'intent'> {
  /** Semantic accent color. */
  intent?: ControlIntent;
}

/** Props owned by the switch wrapper. */
export interface SwitchOwnProps extends SwitchVariantSubset {
  /**
   * Visible label content displayed next to the switch.
   *
   * Omit it only when an accessible name is supplied with `aria-label` or
   * `aria-labelledby`.
   */
  children?: ReactNode;
}

/**
 * Native checkbox props with a fixed `role="switch"` and `type="checkbox"`.
 *
 * Use React's `checked` with `onChange` for controlled state, or `defaultChecked` for native
 * uncontrolled state. Direct `disabled`, `readOnly`, `required`, and `id` values override the
 * nearest FormControl; read-only remains focusable and cannot change through pointer or Space-key
 * activation.
 */
export type SwitchProps = Omit<
  NativeProps<'input', SwitchOwnProps>,
  'role' | 'type' | 'aria-checked' | 'aria-disabled' | 'aria-readonly' | 'aria-required'
>;
