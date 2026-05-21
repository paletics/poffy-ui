import { PrimitiveProps } from '@poffy-ui/types';
import type { KeyboardEventHandler, MouseEventHandler } from 'react';

/**
 * Behavior-focused pressable primitive for clickable controls.
 * Can be rendered as a native button or delegated via `asChild`.
 */
export interface PressablePrimitiveBaseProps {
  /** Whether the pressable control is disabled. */
  disabled?: boolean;
  /** Pointer activation handler normalized by the primitive. */
  onPress?: MouseEventHandler<HTMLElement>;
  /** Keyboard activation handler normalized by the primitive. */
  onPressKeyDown?: KeyboardEventHandler<HTMLElement>;
}

/** Props for `PressablePrimitive`. */
export type PressablePrimitiveProps = PrimitiveProps<'button', PressablePrimitiveBaseProps>;
