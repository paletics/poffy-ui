import { PrimitiveProps } from '@poffy-ui/types';
import type { KeyboardEventHandler, MouseEventHandler } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Props for a button primitive that exposes press-oriented callbacks. */
export interface PressablePrimitiveBaseProps<HostElement extends HTMLElement = HTMLButtonElement> {
  /** Disables the underlying button behavior. */
  disabled?: boolean;
  /** Called after `onClick` unless that callback prevents the event. */
  onPress?: MouseEventHandler<HostElement>;
  /** Called before `onKeyDown`, including keys that are not button activation keys. */
  onPressKeyDown?: KeyboardEventHandler<HostElement>;
}

type PressablePrimitiveNativeProps = PrimitiveProps<
  'button',
  PressablePrimitiveBaseProps<HTMLButtonElement>
>;
/** Props for PressablePrimitive rendered with its default host. */
export type PressablePrimitiveDefaultProps = DefaultHostProps<PressablePrimitiveNativeProps>;
type PressablePrimitiveDelegatedBaseProps = Omit<
  PressablePrimitiveNativeProps,
  | 'form'
  | 'formAction'
  | 'formEncType'
  | 'formMethod'
  | 'formNoValidate'
  | 'formTarget'
  | 'name'
  | 'onPress'
  | 'onPressKeyDown'
  | 'type'
  | 'value'
> &
  PressablePrimitiveBaseProps<HTMLElement>;
/** Props for PressablePrimitive delegated to an asChild host. */
export type PressablePrimitiveAsChildProps = RetargetedAsChildHostProps<
  PressablePrimitiveDelegatedBaseProps,
  HTMLElement
>;
/** Public props for PressablePrimitive. */
export type PressablePrimitiveProps =
  | PressablePrimitiveDefaultProps
  | PressablePrimitiveAsChildProps;
/** Polymorphic component call signatures for PressablePrimitive. */
export type PressablePrimitiveComponent = PolymorphicAsChildComponent<
  PressablePrimitiveDefaultProps,
  PressablePrimitiveAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
