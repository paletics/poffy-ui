import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Base properties for VisuallyHidden.
 *
 * ### Notes
 * Do: use for labels, descriptions, and status text that must remain available to
 * screen readers.
 * Don't: hide focusable interactive controls with this component.
 */
export interface VisuallyHiddenBaseProps {
  /** The content to be accessible only to screen readers. */
  children: ReactNode;
}

/**
 * Props for the VisuallyHidden component.
 *
 * @example
 * ```tsx
 * import { VisuallyHidden } from '@poffy-ui/react/a11y';
 *
 * <button>
 *   <Icon aria-hidden />
 *   <VisuallyHidden>Close dialog</VisuallyHidden>
 * </button>
 * ```
 *
 * ### Notes
 * The element remains in the accessibility tree and reading order. It is not a
 * general-purpose visibility toggle.
 *
 * Related: `VisuallyHiddenBaseProps`
 *
 * Extends PrimitiveProps for asChild Slot support.
 */
export type VisuallyHiddenProps = PrimitiveProps<'span', VisuallyHiddenBaseProps>;
