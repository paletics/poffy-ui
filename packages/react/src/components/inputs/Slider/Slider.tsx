'use client';

import { cx } from '@/styled-system/css';
import { slider } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { SliderProps } from './Slider.types';

/**
 * A range input for selecting a numeric value by dragging a thumb along a track.
 * Wraps a native `<input type="range">` in a `<label>` for an accessible click target.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: Panda CSS (`slider` SlotRecipe: `root` + `control` + `label`)
 * - **Props**: `SliderProps` (extends `<input type="range">`)
 *
 * ### Design Tokens
 * - **sizing**: thumb diameter and track height → Silver Ratio tokens per `size` variant
 * - **color**: track fill → `brand.main`; thumb → `neutral.surface`
 *
 * ### Variant Logic
 * - **size="sm"**: Compact presentations (media player controls).
 * - **size="md"**: Default. Settings pages and general-purpose sliders.
 * - **size="lg"**: High-emphasis controls requiring a large hit target.
 *
 * ### Accessibility
 * - **Role**: `slider` (implicit via `<input type="range">`)
 * - **Keyboard**: Tab: focus | Arrow keys: increment/decrement
 * - **Required**: `children` renders as a visible `<span>` label. Provide `aria-label` for icon-only usage.
 *
 * @example Basic
 * ```tsx
 * <Slider min={0} max={100} defaultValue={50}>Volume</Slider>
 * ```
 *
 * @example Without label (icon-only context)
 * ```tsx
 * <Slider min={0} max={100} aria-label="Brightness" />
 * ```
 */
export const Slider = forwardRef<HTMLInputElement, SliderProps>((props, ref) => {
  const { size, intent, children, className, ...rest } = props;
  const classes = slider({ size, intent });

  return (
    <label className={cx(classes.root, className)}>
      <input type="range" className={classes.control} ref={ref} {...rest} />
      {children && <span className={classes.label}>{children}</span>}
    </label>
  );
});

Slider.displayName = 'Slider';
