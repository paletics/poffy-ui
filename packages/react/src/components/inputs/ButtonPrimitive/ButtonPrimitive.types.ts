import type { PrimitiveProps } from '@poffy-ui/types';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';

/** Props for an unstyled button with an optional delegated host. */
export interface ButtonPrimitiveBaseProps {
  /**
   * Prevents activation. Delegated hosts use `aria-disabled` because `disabled` is valid only on
   * native buttons.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
}

type ButtonPrimitiveNativeProps = PrimitiveProps<'button', ButtonPrimitiveBaseProps>;
/** Props for ButtonPrimitive rendered with its default host. */
export type ButtonPrimitiveDefaultProps = DefaultHostProps<ButtonPrimitiveNativeProps>;
/** Native-button-only attributes omitted when props are delegated through `asChild`. */
type ButtonPrimitiveDelegatedBaseProps = DelegatedButtonHostProps<ButtonPrimitiveNativeProps>;
/** Props for ButtonPrimitive delegated to an asChild host. */
export type ButtonPrimitiveAsChildProps = RetargetedAsChildHostProps<
  ButtonPrimitiveDelegatedBaseProps,
  HTMLElement
>;
/** Public props for ButtonPrimitive. */
export type ButtonPrimitiveProps = ButtonPrimitiveDefaultProps | ButtonPrimitiveAsChildProps;
/** Polymorphic component call signatures for ButtonPrimitive. */
export type ButtonPrimitiveComponent = PolymorphicAsChildComponent<
  ButtonPrimitiveDefaultProps,
  ButtonPrimitiveAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
