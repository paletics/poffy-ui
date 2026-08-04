import type { ActionMotionType } from '@/components/animations/ActionMotion';
import type { IconButtonVariantProps } from '@/styled-system/recipes';
import {
  type ActionAppearance,
  type ActionIntent,
  type ActionShape,
  type PrimitiveProps,
} from '@poffy-ui/types';
import type { ReactElement } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';

/** Component-specific props for IconButton. */
export interface IconButtonOwnProps extends Omit<
  IconButtonVariantProps,
  'intent' | 'appearance' | 'shape'
> {
  /** Semantic purpose used to select the action color treatment. @defaultValue `'primary'` */
  intent?: ActionIntent;

  /** Visual treatment for the action. @defaultValue `'ghost'` */
  appearance?: ActionAppearance;

  /** Outer geometry of the icon hit target. @defaultValue `'pill'` */
  shape?: ActionShape;
  /**
   * The icon element to display inside the button.
   * Cloned internally to inject `aria-hidden="true"` and `focusable="false"`.
   * Must render decorative, non-interactive SVG content; typically an SVG icon component.
   */
  icon: ReactElement;

  /**
   * Accessible label required for screen readers.
   * **Mandatory for all icon-only buttons**; do not rely on tooltip text as a substitute.
   */
  'aria-label': string;

  /**
   * Puts the button into a loading state.
   * Replaces the icon with a spinner, sets `aria-busy="true"` and `aria-disabled="true"`.
   * @defaultValue `false`
   */
  loading?: boolean;

  /**
   * Physics preset applied via `ActionMotion` on press/hover.
   * @defaultValue `'bouncy'`
   */
  animationType?: ActionMotionType;
}

type IconButtonNativeProps = Omit<
  PrimitiveProps<'button', IconButtonOwnProps>,
  'aria-busy' | 'aria-disabled' | 'type'
>;

/** Props for IconButton's owned native `type="button"` host. */
export type IconButtonDefaultProps = DefaultHostProps<IconButtonNativeProps>;

type IconButtonDelegatedBaseProps = Omit<
  IconButtonNativeProps,
  | 'form'
  | 'formAction'
  | 'formEncType'
  | 'formMethod'
  | 'formNoValidate'
  | 'formTarget'
  | 'name'
  | 'value'
>;

/**
 * Props for IconButton delegated with `asChild`.
 *
 * A passive compatible host receives button role and keyboard semantics. A
 * disabled delegated anchor has its destination removed; a disabled custom
 * link-like host falls back to the owned native button.
 */
export type IconButtonAsChildProps = RetargetedAsChildHostProps<
  IconButtonDelegatedBaseProps,
  HTMLElement,
  ReactElement
>;

/** Props accepted by IconButton's owned or delegated button host. */
export type IconButtonProps = IconButtonDefaultProps | IconButtonAsChildProps;

/** Ref-forwarding public component signature for IconButton. */
export type IconButtonComponent = PolymorphicAsChildComponent<
  IconButtonDefaultProps,
  IconButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;
