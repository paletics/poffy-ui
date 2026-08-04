import type { SplitButtonVariantProps } from '@/styled-system/recipes';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
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

/** Localizable accessible labels used by SplitButton. */
export interface SplitButtonLabels {
  /** Accessible name for the secondary menu trigger. */
  moreOptions: string;
}

/** Visual options shared by SplitButton's primary and disclosure segments. */
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

/** One secondary menu action. Its `id` must remain stable across renders. */
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

/** Props for paired primary and secondary actions. */
export interface SplitButtonProps
  extends Omit<ComponentPropsWithoutRef<'div'>, 'onClick'>, SplitButtonVariants, PortalTargetProps {
  /**
   * Content for the main primary action button.
   */
  children: ReactNode;

  /**
   * List of related secondary actions. The trigger is disabled when none are enabled.
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

  /** BCP 47 locale used for built-in accessible labels. */
  locale?: string;

  /** Overrides for built-in accessible labels. */
  labels?: Partial<SplitButtonLabels>;
}
