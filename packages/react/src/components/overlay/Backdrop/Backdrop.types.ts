import { PrimitiveProps } from '@poffy-ui/types';
import type { ComponentPropsWithoutRef, ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Props for Backdrop.
 *
 * Backdrop renders a full-screen overlay layer with optional body scroll
 * locking. With `asChild`, set `lockScroll={false}` and provide one native
 * article, aside, div, or section container. Use it as the visual/screen-locking layer behind modal surfaces;
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
interface BackdropOwnProps {
  /**
   * Whether to lock the body scroll when the backdrop is open.
   * @defaultValue true
   */
  lockScroll?: boolean;
}

type BackdropNativeProps = PrimitiveProps<'div', BackdropOwnProps>;
/** Props for Backdrop rendered with its default host. */
export type BackdropDefaultProps = DefaultHostProps<BackdropNativeProps>;
type BackdropAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'aside'>, 'aside'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;
/** Props for Backdrop delegated to an asChild host. */
export type BackdropAsChildProps = Omit<
  RetargetedAsChildHostProps<BackdropNativeProps, HTMLElement, BackdropAsChildElement>,
  'lockScroll'
> & {
  lockScroll?: false;
};
/** Public props for Backdrop. */
export type BackdropProps = BackdropDefaultProps | BackdropAsChildProps;
/** Polymorphic component call signatures for Backdrop. */
export type BackdropComponent = PolymorphicAsChildComponent<
  BackdropDefaultProps,
  BackdropAsChildProps,
  HTMLDivElement,
  HTMLElement
>;
