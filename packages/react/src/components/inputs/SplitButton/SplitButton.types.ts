import type { SplitButtonVariantProps } from '@/styled-system/recipes';
import { ComponentPropsWithoutRef, MouseEvent, ReactNode } from 'react';

/**
 * Semantic accent color for SplitButton.
 */
export type SplitButtonIntent =
  | 'primary'
  | 'secondary'
  | 'info'
  | 'success'
  | 'warning'
  | 'danger'
  | 'light'
  | 'dark';

/**
 * Public surface treatment for SplitButton.
 */
export type SplitButtonAppearance = 'solid' | 'soft' | 'outline' | 'ghost' | 'minimal';

/**
 * Public geometry control for SplitButton.
 */
export type SplitButtonShape = 'rounded' | 'pill' | 'square';

/**
 * Variants for the SplitButton component based on Panda CSS recipe.
 */
export interface SplitButtonVariants extends Omit<SplitButtonVariantProps, 'variant' | 'isOpen'> {
  /**
   * Semantic color intent shared by the primary action and menu trigger.
   *
   * @defaultValue `'primary'`
   */
  intent?: SplitButtonIntent;
  /**
   * Visual treatment shared by both button segments.
   *
   * @defaultValue `'solid'`
   */
  appearance?: SplitButtonAppearance;
  /**
   * Corner geometry for the connected split button.
   *
   * @defaultValue `'rounded'`
   */
  shape?: SplitButtonShape;
}

/**
 * Represents a single item within the SplitButton's dropdown menu.
 *
 * ### Notes
 * Each item should have a stable `id` for React rendering and a short `label`
 * suitable for menu text and assistive technology.
 */
export interface SplitButtonMenuItem {
  /**
   * Unique identifier for the menu item.
   */
  id: string;

  /**
   * Display text for the menu item.
   */
  label: string;

  /**
   * Optional icon to display alongside the label.
   */
  icon?: ReactNode;

  /**
   * Whether this specific menu item is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;

  /**
   * Callback fired when this menu item is selected.
   */
  onClick?: () => void;
}

/**
 * Properties for the SplitButton component.
 * Combines a primary action button with a secondary dropdown menu for related actions.
 *
 * ### Notes
 * The root renders two coordinated buttons: the primary action uses `children`
 * and `onClick`, while the secondary trigger opens the `items` menu. Provide
 * related secondary actions only; unrelated navigation belongs in a menu or
 * toolbar. Disabled menu items are skipped by pointer and keyboard activation.
 *
 * Do: keep the primary action safe to trigger without opening the menu.
 * Don't: put destructive actions in the default primary slot unless clearly
 * labeled.
 *
 * @example
 * ```tsx
 * import { SplitButton } from '@poffy-ui/react/inputs';
 *
 * <SplitButton
 *   items={[{ id: 'draft', label: 'Save draft', onClick: saveDraft }]}
 *   onClick={publish}
 * >
 *   Publish
 * </SplitButton>
 * ```
 *
 * Related: ButtonProps for a single action button.
 */
export interface SplitButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'>, SplitButtonVariants {
  /**
   * Content for the main primary action button.
   */
  children: ReactNode;

  /**
   * List of items to display in the secondary dropdown menu.
   */
  items: SplitButtonMenuItem[];

  /**
   * Callback fired when the main primary action button is clicked.
   */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /**
   * Optional icon to display in the main primary action button.
   */
  icon?: ReactNode;

  /**
   * Whether the entire split button group is disabled.
   * @defaultValue `false`
   */
  disabled?: boolean;
}
