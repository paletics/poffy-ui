import type {
  IconButtonAsChildProps,
  IconButtonDefaultProps,
} from '@/components/inputs/IconButton/IconButton.types';
import type { ReactElement } from 'react';
import type { PolymorphicAsChildComponent } from '@/components/shared/polymorphicAsChild.types';

/**
 * Icon button dedicated to open/close toggles (`aria-expanded` aware).
 */
export interface DisclosureIconButtonOwnProps {
  /** Managed from `open`; callers cannot override it. */
  'aria-expanded'?: never;
  /** Managed from `open`; callers cannot override it. */
  'data-state'?: never;
  /**
   * Current expanded state mirrored to `aria-expanded`.
   */
  open: boolean;
  /**
   * Called with the next expanded state after an accepted press. Update `open` to reflect the
   * request; it is not changed internally.
   */
  onOpenChange?: (open: boolean) => void;
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

type DisclosureOwnedProp =
  | 'aria-expanded'
  | 'data-state'
  | 'icon'
  | 'open'
  | 'onOpenChange'
  | 'rotateOnOpen';

/** Props for DisclosureIconButton rendered with its default host. */
export type DisclosureIconButtonDefaultProps = Omit<
  IconButtonDefaultProps,
  DisclosureOwnedProp
> &
  DisclosureIconButtonOwnProps;

/** Props for DisclosureIconButton delegated to an asChild host. */
export type DisclosureIconButtonAsChildProps = Omit<
  IconButtonAsChildProps,
  DisclosureOwnedProp
> &
  DisclosureIconButtonOwnProps;

/** Public props for DisclosureIconButton. */
export type DisclosureIconButtonProps =
  | DisclosureIconButtonDefaultProps
  | DisclosureIconButtonAsChildProps;

/** Polymorphic component call signatures for DisclosureIconButton. */
export type DisclosureIconButtonComponent = PolymorphicAsChildComponent<
  DisclosureIconButtonDefaultProps,
  DisclosureIconButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
