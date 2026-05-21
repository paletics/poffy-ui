import type { IconButtonProps } from '@/components/inputs/IconButton';
import { MouseEventHandler, ReactElement } from 'react';

/**
 * Icon button dedicated to open/close toggles (`aria-expanded` aware).
 */
export interface DisclosureIconButtonProps extends Omit<
  IconButtonProps,
  'icon' | 'onClick' | 'aria-expanded'
> {
  /**
   * Current expanded state mirrored to `aria-expanded`.
   */
  open: boolean;
  /**
   * Called with the next expanded state when the trigger is pressed.
   */
  onOpenChange?: (open: boolean) => void;
  /**
   * Additional click handler invoked after the disclosure state callback.
   */
  onClick?: MouseEventHandler<HTMLElement>;
  /**
   * Icon rendered inside the button.
   *
   * @defaultValue `<ChevronDownIcon />`
   */
  icon?: ReactElement;
  /**
   * Rotates the disclosure icon when `open` is true.
   *
   * @defaultValue `true`
   */
  rotateOnOpen?: boolean;
}
