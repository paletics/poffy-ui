import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Props for Backdrop.
 *
 * Backdrop renders a full-screen overlay layer with optional body scroll
 * locking. Use it as the visual/screen-locking layer behind modal surfaces;
 * it does not add dialog semantics, labels, or focus management by itself.
 *
 * Do: place dialog or drawer content inside a higher-level overlay component
 * when accessibility behavior is needed. Don't: use Backdrop alone as a
 * Modal replacement.
 *
 * @example
 * ```tsx
 * import { Backdrop } from '@poffy-ui/react/overlay';
 *
 * <Backdrop lockScroll />
 * ```
 *
 * Related: import('@poffy-ui/react/overlay').ModalProps
 * Related: import('@poffy-ui/react/overlay').DrawerProps
 */
export interface BackdropProps extends PrimitiveProps<'div'> {
  /**
   * Whether to lock the body scroll when the backdrop is open.
   * @defaultValue true
   */
  lockScroll?: boolean;
}
