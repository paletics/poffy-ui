import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Lightweight, unstyled button primitive with optional `asChild` rendering.
 * Keeps button semantics centralized without imposing visual styles.
 */
export interface ButtonPrimitiveBaseProps {
  /** Whether the primitive button is disabled. */
  disabled?: boolean;
}

/** Props for `ButtonPrimitive`. */
export type ButtonPrimitiveProps = PrimitiveProps<'button', ButtonPrimitiveBaseProps>;
