import type { CloseButtonVariantProps } from '@/styled-system/recipes';
import { type ControlShape, type InputAppearance, PrimitiveProps } from '@poffy-ui/types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Visual options for `CloseButton`. */
export interface CloseButtonVariants extends Omit<CloseButtonVariantProps, 'appearance' | 'shape'> {
  /**
   * Visual treatment of the dismiss button.
   *
   * @defaultValue `'ghost'`
   */
  appearance?: InputAppearance | 'ghost';
  /**
   * Corner geometry for the dismiss button hit target.
   *
   * @defaultValue `'rounded'`
   */
  shape?: ControlShape;
}

type CloseButtonNativeProps = Omit<PrimitiveProps<'button', CloseButtonVariants>, 'type'>;

/** Props for CloseButton's owned native `type="button"` host. */
export type CloseButtonDefaultProps = DefaultHostProps<CloseButtonNativeProps>;

type CloseButtonDelegatedBaseProps = DelegatedButtonHostProps<CloseButtonNativeProps>;

/**
 * Props for CloseButton delegated with `asChild`.
 *
 * The child must be an action-only host. Passive hosts receive button role and
 * keyboard semantics; links and incompatible hosts fall back to the owned
 * native button.
 */
export type CloseButtonAsChildProps = RetargetedAsChildHostProps<
  CloseButtonDelegatedBaseProps,
  HTMLElement
>;

/** Props accepted by CloseButton's owned or delegated button host. */
export type CloseButtonProps = CloseButtonDefaultProps | CloseButtonAsChildProps;

/** Ref-forwarding public component signature for CloseButton. */
export type CloseButtonComponent = PolymorphicAsChildComponent<
  CloseButtonDefaultProps,
  CloseButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
