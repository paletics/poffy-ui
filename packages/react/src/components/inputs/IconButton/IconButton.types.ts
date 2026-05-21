import { ActionMotionType } from '@/components/animations/ActionMotion';
import type { IconButtonVariantProps } from '@/styled-system/recipes';
import {
  type ActionAppearance,
  type ActionIntent,
  type ActionShape,
  PrimitiveProps,
} from '@poffy-ui/types';
import { ReactElement } from 'react';

/**
 * Full props for the `IconButton` component.
 * Requires an `icon` element and a mandatory `aria-label` for accessibility.
 *
 * ### Formula
 * - Silver Ratio (1:1.414) governs all `size` token values (width/height) in the `iconButton` recipe.
 * ### AI Usage
 * - Use this type when typing `IconButton` or any icon-only button wrapper that requires accessible labelling.
 */
export interface IconButtonProps
  extends
    PrimitiveProps<'button'>,
    Omit<IconButtonVariantProps, 'intent' | 'appearance' | 'shape'> {
  intent?: ActionIntent;
  appearance?: ActionAppearance;
  shape?: ActionShape;
  /**
   * The icon element to display inside the button.
   * Cloned internally to inject `aria-hidden="true"` and `focusable="false"`.
   * Typically an SVG icon component.
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
   * @defaultValue false
   */
  loading?: boolean;

  /**
   * Physics preset applied via `ActionMotion` on press/hover.
   * @defaultValue 'bouncy'
   */
  animationType?: ActionMotionType;
}
