import type { ToggleButtonVariantProps } from '@/styled-system/recipes';
import type { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/**
 * Semantic accent color for ToggleButton.
 */
export type ToggleButtonIntent = 'primary' | 'secondary' | 'success' | 'danger' | 'light' | 'dark';

/**
 * Public surface treatment for ToggleButton.
 */
export type ToggleButtonAppearance = 'soft' | 'outline' | 'ghost' | 'minimal';

/**
 * Public geometry control for ToggleButton.
 */
export type ToggleButtonShape = 'rounded' | 'pill' | 'square';

/** Visual options for `ToggleButton`. */
export interface ToggleButtonVariants extends Omit<
  ToggleButtonVariantProps,
  'intent' | 'variant' | 'pressed'
> {
  intent?: ToggleButtonIntent;
  appearance?: ToggleButtonAppearance;
  shape?: ToggleButtonShape;
}

/** Visual and content props shared by controlled and uncontrolled toggle buttons. */
export interface ToggleButtonOwnProps extends Omit<ToggleButtonVariants, 'pressed'> {
  /** Content that names the toggle; icon-only uses must provide `aria-label`. */
  children: ReactNode;

  /** Decorative icon placed before the content. */
  startIcon?: ReactNode;

  /** Decorative icon placed after the content. */
  endIcon?: ReactNode;

  /**
   * Whether the button is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;
}

type ToggleButtonStateProps =
  | {
      pressed: boolean;
      defaultPressed?: never;
      onPressedChange: (pressed: boolean) => void;
    }
  | {
      pressed?: never;
      defaultPressed?: boolean;
      onPressedChange?: (pressed: boolean) => void;
    };

type ToggleButtonNativeBaseProps = Omit<PrimitiveProps<'button', ToggleButtonOwnProps>, 'type'>;

/** Native-host props for a toggle with either controlled or uncontrolled state ownership. */
export type ToggleButtonDefaultProps = ToggleButtonStateProps extends infer StateProps
  ? StateProps extends ToggleButtonStateProps
    ? DefaultHostProps<ToggleButtonNativeBaseProps & StateProps>
    : never
  : never;

type ToggleButtonDelegatedBaseProps =
  DelegatedButtonHostProps<ToggleButtonNativeBaseProps>;

/**
 * Props for a toggle delegated with `asChild`.
 *
 * The child must be an action-only host. A native button receives `disabled` and
 * `type="button"`; a passive host receives button role and keyboard semantics.
 * Link-like or incompatible hosts fall back to the owned native button.
 */
export type ToggleButtonAsChildProps = ToggleButtonStateProps extends infer StateProps
  ? StateProps extends ToggleButtonStateProps
    ? RetargetedAsChildHostProps<ToggleButtonDelegatedBaseProps & StateProps, HTMLElement>
    : never
  : never;

/**
 * Props accepted by ToggleButton in its owned or delegated form.
 *
 * Controlled usage requires both `pressed` and `onPressedChange`; otherwise
 * `defaultPressed` seeds local state and the callback is optional.
 */
export type ToggleButtonProps = ToggleButtonDefaultProps | ToggleButtonAsChildProps;

/** Ref-forwarding public component signature for ToggleButton. */
export type ToggleButtonComponent = PolymorphicAsChildComponent<
  ToggleButtonDefaultProps,
  ToggleButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
