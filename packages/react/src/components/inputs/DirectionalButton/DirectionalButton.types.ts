import { PrimitiveProps } from '@poffy-ui/types';
import type { ReactNode } from 'react';

/**
 * Direction represented by the button icon and accessibility text.
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
  /** Direction rendered by the default icon. */
  direction?: Direction;
  /** Custom icon overriding the default directional icon. */
  icon?: ReactNode;
  /** Button size. */
  size?: DirectionalButtonSize;
  /** Surface treatment. */
  appearance?: DirectionalButtonAppearance;
  /** Semantic accent color. */
  intent?: DirectionalButtonIntent;
  /** Button geometry. */
  shape?: DirectionalButtonShape;
}

/**
 * Props for a single DirectionalButton.
 */
export type DirectionalButtonProps = PrimitiveProps<'button', DirectionalButtonOwnProps>;

/**
 * Item props used by a connected DirectionalButton group.
 */
export type DirectionalButtonGroupItem = Omit<
  DirectionalButtonProps,
  'size' | 'appearance' | 'intent' | 'shape'
>;

/**
 * Props for a paired DirectionalButton group.
 */
export interface DirectionalButtonGroupProps extends PrimitiveProps<'div'> {
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
