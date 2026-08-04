import type { IconButtonProps } from '@/components/inputs/IconButton/IconButton.types';
import type { PrimitiveProps } from '@poffy-ui/types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Behavior and visual props owned by `CopyButton`. */
export interface CopyButtonOwnProps extends Pick<
  IconButtonProps,
  'animationType' | 'appearance' | 'intent' | 'loading' | 'shape' | 'size'
> {
  /**
   * The text content to copy to the clipboard.
   */
  value: string;

  /**
   * The duration in milliseconds to show the checked state.
   * Non-finite or non-positive values also use this fallback.
   *
   * @defaultValue `2000`
   */
  timeout?: number;

  /**
   * Called after a successful copy, including an older request whose feedback is no longer current.
   */
  onCopy?: () => void;

  /**
   * Callback fired when copying fails after both clipboard strategies are attempted.
   */
  onCopyError?: (error: unknown) => void;

  /**
   * Accessible label and status message used after a successful copy.
   *
   * When omitted, uses the active locale's “copied” message with the resolved
   * button label.
   */
  copiedLabel?: string;

  /**
   * Polite status message announced when copying fails.
   * Uses the active locale's fallback message when omitted or blank.
   */
  copyErrorLabel?: string;

  /**
   * Accessible label for the button.
   * Uses the active locale's “Copy to clipboard” message when omitted.
   */
  'aria-label'?: string;
}

type CopyButtonNativeProps = Omit<PrimitiveProps<'button', CopyButtonOwnProps>, 'type'>;

/** Props for CopyButton's owned native button. */
export type CopyButtonDefaultProps = DefaultHostProps<CopyButtonNativeProps>;

type CopyButtonDelegatedBaseProps = DelegatedButtonHostProps<CopyButtonNativeProps>;

type CopyButtonRetargetedProps = RetargetedAsChildHostProps<
  CopyButtonDelegatedBaseProps,
  HTMLElement
>;

/**
 * Props for CopyButton delegated with `asChild`.
 *
 * The child must be an action-only host. Passive hosts receive button behavior
 * through IconButton; links and incompatible hosts fall back to the owned
 * native button.
 */
export type CopyButtonAsChildProps = Omit<CopyButtonRetargetedProps, 'onCopy'> &
  Pick<CopyButtonOwnProps, 'onCopy' | 'value'>;

/** Props accepted by CopyButton's owned or delegated button host. */
export type CopyButtonProps = CopyButtonDefaultProps | CopyButtonAsChildProps;

/** Ref-forwarding public component signature for CopyButton. */
export type CopyButtonComponent = PolymorphicAsChildComponent<
  CopyButtonDefaultProps,
  CopyButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
