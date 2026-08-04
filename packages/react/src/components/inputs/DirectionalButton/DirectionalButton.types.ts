import type { PrimitiveProps } from '@poffy-ui/types';
import type { ComponentPropsWithoutRef, ReactElement, ReactNode } from 'react';
import type {
  DefaultHostProps,
  PolymorphicAsChildComponent,
  RetargetedAsChildHostProps,
} from '@/components/shared/polymorphicAsChild.types';
import type { DelegatedButtonHostProps } from '@/components/shared/buttonDelegation';

/**
 * Direction represented by the button icon and fallback accessibility text.
 */
export type Direction = 'up' | 'down' | 'left' | 'right';

/**
 * Public size for DirectionalButton.
 */
export type DirectionalButtonSize = 'sm' | 'md' | 'lg';

/**
 * Public surface treatment for DirectionalButton.
 */
export type DirectionalButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'neo';

/**
 * Semantic accent color for DirectionalButton.
 */
export type DirectionalButtonIntent = 'primary' | 'secondary' | 'info' | 'light' | 'dark';

/**
 * Public geometry control for DirectionalButton.
 */
export type DirectionalButtonShape = 'rounded' | 'pill' | 'square';

/**
 * Own props for a single DirectionalButton.
 */
export interface DirectionalButtonOwnProps {
  /**
   * Direction rendered by the default icon and locale fallback label.
   *
   * @defaultValue `'right'`
   */
  direction?: Direction;
  /** Custom icon overriding the default directional icon. */
  icon?: ReactNode;
  /**
   * Button size.
   *
   * @defaultValue `'md'`
   */
  size?: DirectionalButtonSize;
  /**
   * Surface treatment.
   *
   * @defaultValue `'soft'`
   */
  appearance?: DirectionalButtonAppearance;
  /**
   * Semantic accent color.
   *
   * @defaultValue `'primary'`
   */
  intent?: DirectionalButtonIntent;
  /**
   * Button geometry.
   *
   * @defaultValue `'rounded'`
   */
  shape?: DirectionalButtonShape;
  /**
   * Accessible action label. Defaults to a direction-only label such as "Move right".
   * Visible children or an `asChild` host name the action when this prop is omitted.
   * Override either source with a concrete action, for example "Next month".
   */
  'aria-label'?: string;
}

/**
 * Props for a single DirectionalButton. Unlike exclusive action buttons,
 * delegated navigation links are preserved.
 */
type DirectionalButtonNativeProps = Omit<
  PrimitiveProps<'button', DirectionalButtonOwnProps>,
  'type'
>;

/** Props for DirectionalButton rendered with its default host. */
export type DirectionalButtonDefaultProps = DefaultHostProps<DirectionalButtonNativeProps>;

type DirectionalButtonDelegatedBaseProps = DelegatedButtonHostProps<DirectionalButtonNativeProps>;

/** Props for DirectionalButton delegated to an asChild host. */
export type DirectionalButtonAsChildProps = RetargetedAsChildHostProps<
  DirectionalButtonDelegatedBaseProps,
  HTMLElement
>;

/** Public props for DirectionalButton. */
export type DirectionalButtonProps = DirectionalButtonDefaultProps | DirectionalButtonAsChildProps;

/** Polymorphic component call signatures for DirectionalButton. */
export type DirectionalButtonComponent = PolymorphicAsChildComponent<
  DirectionalButtonDefaultProps,
  DirectionalButtonAsChildProps,
  HTMLButtonElement,
  HTMLElement
>;

/**
 * Item props used by a connected DirectionalButton group.
 */
export type DirectionalButtonGroupItem = DirectionalButtonProps extends infer Props
  ? Props extends DirectionalButtonProps
    ? Omit<Props, 'size' | 'appearance' | 'intent' | 'shape'>
    : never
  : never;

/**
 * Props for a paired DirectionalButton group.
 */
export interface DirectionalButtonGroupOwnProps {
  /** Layout orientation for the button pair. */
  orientation?: 'horizontal' | 'vertical';
  /** Shared size for both buttons. */
  size?: DirectionalButtonSize;
  /** Shared surface treatment for both buttons. */
  appearance?: DirectionalButtonAppearance;
  /** Shared semantic accent color for both buttons. */
  intent?: DirectionalButtonIntent;
  /** Shared geometry for both buttons. */
  shape?: DirectionalButtonShape;
  /** Whether the pair should render as a connected control. */
  connected?: boolean;
  /** Leading directional button config. */
  startButton: DirectionalButtonGroupItem;
  /** Trailing directional button config. */
  endButton: DirectionalButtonGroupItem;
  /** Additional CSS class names applied to each child button. */
  buttonClassName?: string;
}

type DirectionalButtonGroupNativeProps = Omit<
  PrimitiveProps<'div', DirectionalButtonGroupOwnProps>,
  'role'
>;
type DirectionalButtonGroupAsChildElement =
  | ReactElement<ComponentPropsWithoutRef<'article'>, 'article'>
  | ReactElement<ComponentPropsWithoutRef<'div'>, 'div'>
  | ReactElement<ComponentPropsWithoutRef<'section'>, 'section'>;

/** Props for DirectionalButtonGroup rendered with its default host. */
export type DirectionalButtonGroupDefaultProps =
  DefaultHostProps<DirectionalButtonGroupNativeProps>;
/** Props for DirectionalButtonGroup delegated to an asChild host. */
export type DirectionalButtonGroupAsChildProps = RetargetedAsChildHostProps<
  DirectionalButtonGroupNativeProps,
  HTMLElement,
  DirectionalButtonGroupAsChildElement
>;
/** Public props for DirectionalButtonGroup. */
export type DirectionalButtonGroupProps =
  | DirectionalButtonGroupDefaultProps
  | DirectionalButtonGroupAsChildProps;
/** Polymorphic component call signatures for DirectionalButtonGroup. */
export type DirectionalButtonGroupComponent = PolymorphicAsChildComponent<
  DirectionalButtonGroupDefaultProps,
  DirectionalButtonGroupAsChildProps,
  HTMLDivElement,
  HTMLElement
>;
