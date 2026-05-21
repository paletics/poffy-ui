import type { ToggleButtonVariantProps } from '@/styled-system/recipes';
import { PrimitiveProps } from '@poffy-ui/types';
import { ReactNode } from 'react';

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

/**
 * Variants for the ToggleButton component based on Panda CSS recipe.
 */
export interface ToggleButtonVariants extends Omit<
  ToggleButtonVariantProps,
  'intent' | 'appearance'
> {
  intent?: ToggleButtonIntent;
  appearance?: ToggleButtonAppearance;
  shape?: ToggleButtonShape;
}

/**
 * Properties for the ToggleButton component.
 * Represents a button that can be toggled between two states (pressed or not).
 *
 * ### Notes
 * `pressed` is controlled and should be paired with `onPressedChange`; use
 * `defaultPressed` for uncontrolled initial state. Icon-only toggle buttons
 * must provide `aria-label`. The component maps state to `aria-pressed`.
 *
 * Do: use ToggleButton for independent on/off preferences.
 * Don't: use it for mutually exclusive choices; use RadioGroup instead.
 *
 * @example
 * ```tsx
 * import { ToggleButton } from '@poffy-ui/react/inputs';
 *
 * <ToggleButton pressed={favorite} onPressedChange={setFavorite}>
 *   Favorite
 * </ToggleButton>
 * ```
 *
 * Related: RadioGroupProps for exclusive option sets.
 * Related: ButtonProps for non-toggle actions.
 */
export interface ToggleButtonProps
  extends Omit<PrimitiveProps<'button'>, 'children'>, Omit<ToggleButtonVariants, 'pressed'> {
  /**
   * The content to display inside the button.
   */
  children: ReactNode;

  /**
   * Whether the button is currently in a pressed state (controlled).
   */
  pressed?: boolean;

  /**
   * The initial pressed state for uncontrolled usage.
   * @defaultValue `false`
   */
  defaultPressed?: boolean;

  /**
   * Callback fired when the pressed state changes.
   * @param pressed The new pressed state.
   */
  onPressedChange?: (pressed: boolean) => void;

  /**
   * Optional icon to display before the children.
   */
  leftIcon?: ReactNode;

  /**
   * Optional icon to display after the children.
   */
  rightIcon?: ReactNode;

  /**
   * Whether the button is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;
}
