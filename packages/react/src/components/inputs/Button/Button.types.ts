import { ActionMotionType } from '@/components/animations/ActionMotion';
import { ButtonVariantProps } from '@/styled-system/recipes';
import {
  type ActionAppearance,
  type ActionIntent,
  type ActionShape,
  PrimitiveProps,
} from '@poffy-ui/types';
import { ReactNode } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';

export interface ButtonBaseProps extends Omit<
  ButtonVariantProps,
  'intent' | 'appearance' | 'shape'
> {
  /** Minimum hit-target and label size. @defaultValue `'md'` */
  size?: ButtonVariantProps['size'];

  /** Semantic purpose used to select the action color treatment. @defaultValue `'primary'` */
  intent?: ActionIntent;

  /**
   * Visual treatment for the action; it also selects the default press-motion preset.
   * @defaultValue `'solid'`
   */
  appearance?: ActionAppearance;

  /** Outer geometry of the button. @defaultValue `'rounded'` */
  shape?: ActionShape;
  /** Allows the button to grow within an eligible flex layout. @defaultValue `false` */
  isGrow?: ButtonVariantProps['isGrow'];
  /**
   * Puts the button into a loading state.
   * Renders a spinner, sets `aria-busy="true"` and `aria-disabled="true"`,
   * and suppresses all physics-based interaction feedback.
   * @defaultValue `false`
   */
  loading?: boolean;

  /**
   * Custom element rendered as the loading indicator when `loading` is `true`.
   * When omitted, the default `Spinner` component is used.
   *
   * @example Custom skeleton dot pulse
   * ```tsx
   * <Button loading loadingIcon={<MyDotPulse />}>Saving...</Button>
   * ```
   */
  loadingIcon?: ReactNode;

  /**
   * Icon element rendered at the logical inline start of the label text.
   * Hidden automatically while `loading` is active to avoid layout collision with the spinner.
   */
  startIcon?: ReactNode;

  /**
   * Icon element rendered at the logical inline end of the label text.
   * Hidden automatically while `loading` is active to avoid layout collision with the spinner.
   */
  endIcon?: ReactNode;

  /**
   * Physics preset applied via `ActionMotion` on press/hover.
   * When omitted, the preset is auto-selected based on `appearance`:
   * - `neo` / `solid` -> `'physical'`
   * - inside a connected `ButtonGroup` -> `'subtle'`
   * - all other appearances -> `'bouncy'`
   */
  animationType?: ActionMotionType;

  /**
   * Applies a pulsing radial glow animation around the button.
   * Use sparingly; intended for hero or primary-action emphasis only.
   * @defaultValue `false`
   */
  glow?: boolean;

  /**
   * State marker used by the Button recipe when `disabled` is true.
   * The component owns this value while disabled.
   */
  'data-disabled'?: string;

  /**
   * State marker used by the Button recipe while `loading` is true.
   * The component owns this value while loading.
   */
  'data-loading'?: string;
}

/** Native-button props used when `asChild` is omitted or cannot accept the supplied child. */
type ButtonNativeProps = PrimitiveProps<'button', ButtonBaseProps>;
/** Props for Button's owned native button, including form `type` and submit/reset attributes. */
export type ButtonDefaultProps = DefaultHostProps<ButtonNativeProps>;

/** Removes attributes that apply only to a native `<button>` from delegated hosts. */
type ButtonDelegatedBaseProps = DelegatedButtonHostProps<ButtonNativeProps>;

/**
 * Props for Button delegated with `asChild`.
 *
 * Native button-only form attributes are omitted. A passive compatible host receives button role,
 * focusability, and Enter/Space activation; invalid hosts fall back to the owned native button.
 */
export type ButtonAsChildProps = RetargetedAsChildHostProps<ButtonDelegatedBaseProps, HTMLElement>;

/** Props accepted by Button's owned or delegated host. */
export type ButtonProps = ButtonDefaultProps | ButtonAsChildProps;
/** Ref-forwarding public component signature for Button. */
export type ButtonComponent = PolymorphicAsChildComponent<
  ButtonDefaultProps,
  ButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
