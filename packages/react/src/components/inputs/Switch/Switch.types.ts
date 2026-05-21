import { type ControlIntent, NativeProps } from '@poffy-ui/types';
import { SwitchControlVariantProps } from '@/styled-system/recipes';
import { ReactNode } from 'react';

/**
 * Variants for the Switch component based on Panda CSS recipe.
 */
export type SwitchVariants = SwitchControlVariantProps;

/**
 * Public Switch variant props with shared control intent names.
 */
export interface SwitchVariantSubset extends Omit<SwitchControlVariantProps, 'intent'> {
  /** Semantic accent color. */
  intent?: ControlIntent;
}

/**
 * Own props for Switch.
 */
export interface SwitchOwnProps extends SwitchVariantSubset {
  /**
   * The label or content to display next to the switch.
   */
  children?: ReactNode;
}

/**
 * Properties for the Switch component.
 * Wraps a fixed `<input type="checkbox">` element; no polymorphism needed.
 * Uses NativeProps to inherit all standard input attributes while allowing
 * SwitchVariantSubset (including `size`) to take precedence over conflicting HTML attrs.
 */
export type SwitchProps = NativeProps<'input', SwitchOwnProps>;
