import { ActionMotionType } from '@/components/animations/ActionMotion';
import { ButtonVariantProps } from '@/styled-system/recipes';
import {
  type ActionAppearance,
  type ActionIntent,
  type ActionShape,
  PrimitiveProps,
} from '@poffy-ui/types';
import { ReactNode } from 'react';

/**
 * Base functional properties for the Button component.
 * Extends the Panda CSS recipe variant props (`intent`, `appearance`, `size`, `shape`, `glow`, `isGrow`)
 * and adds runtime-only props that are not part of the recipe.
 *
 * ### Formula
 * - Silver Ratio (1:1.414) is applied to all padding and gap tokens inside the `button` recipe.
 * ### AI Usage
 * - Internal building block; prefer `ButtonProps` when typing the full component.
 */
export interface ButtonBaseProps extends Omit<
  ButtonVariantProps,
  'intent' | 'appearance' | 'shape'
> {
  intent?: ActionIntent;
  appearance?: ActionAppearance;
  shape?: ActionShape;
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
   * Icon element rendered to the **left** of the label text.
   * Hidden automatically while `loading` is active to avoid layout collision with the spinner.
   */
  leftIcon?: ReactNode;

  /**
   * Icon element rendered to the **right** of the label text.
   * Hidden automatically while `loading` is active to avoid layout collision with the spinner.
   */
  rightIcon?: ReactNode;

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
}

/**
 * Full props for the Button component, supporting polymorphic rendering via `asChild`.
 * Merges `ButtonBaseProps` with standard `<button>` HTML attributes through `PrimitiveProps`.
 *
 * ### Notes
 * Use Button for actions, not navigation-only links unless `asChild` delegates
 * to an anchor. Icon-only buttons must provide `aria-label`. `loading` sets
 * busy/disabled semantics and suppresses interaction.
 *
 * Do: keep button text action-oriented and set `type="submit"` explicitly for
 * form submits.
 * Don't: attach both a visible loading label and unrelated `loadingIcon`
 * semantics; the loading icon should be decorative.
 *
 * @example
 * ```tsx
 * import { Button } from '@poffy-ui/react/inputs';
 *
 * <Button type="submit" loading={saving}>
 *   Save
 * </Button>
 * ```
 *
 * Related: SplitButtonProps for primary action plus related secondary actions.
 */
export type ButtonProps = PrimitiveProps<'button', ButtonBaseProps>;
