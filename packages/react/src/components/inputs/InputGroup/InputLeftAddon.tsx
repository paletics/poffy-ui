'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';
import type { InputAddonProps } from './InputGroup.types';

const InputLeftAddonBase = forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useInputGroup();
    const styles = inputGroup({ size: ctx?.size ?? 'md' });

    return (
      <div ref={ref} data-placement="left" className={cx(styles.addon, className)} {...props}>
        {children}
      </div>
    );
  },
);

InputLeftAddonBase.displayName = 'InputLeftAddon';

/**
 * Left-side addon that visually extends an InputGroup field border with prefix content.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`inputGroup` slot recipe), InputGroup context
 * - **Props**: PrimitiveProps<'div'>
 *
 * ### Design Tokens
 * - **spacing**: horizontal padding and height inherit from the InputGroup size recipe
 * - **color**: background, text, and border use semantic input tokens from the recipe
 *
 * ### Variant Logic
 * - **size**: Inherited from the nearest `InputGroup`; falls back to `md` when rendered alone.
 *
 * ### Accessibility
 * - **Role**: generic `div`; decorative prefix content should not replace the input's label.
 * - **Required**: Provide a label or accessible name on the grouped input.
 *
 * ### AI Usage
 * - **DO**: Use for stable prefixes such as protocol, currency, or units.
 * - **DON'T**: Do not place interactive controls inside addons.
 *
 * @example Standard usage
 * ```tsx
 * <InputGroup>
 *   <InputGroup.LeftAddon>https://</InputGroup.LeftAddon>
 *   <InputGroup.Input aria-label="Website" />
 * </InputGroup>
 * ```
 *
 * @example Named export
 * ```tsx
 * <InputGroup>
 *   <InputLeftAddon>$</InputLeftAddon>
 *   <InputGroup.Input aria-label="Amount" />
 * </InputGroup>
 * ```
 */
export const InputLeftAddon = Object.assign(InputLeftAddonBase, {
  [INPUT_GROUP_SLOT]: 'leftAddon' as const,
});

InputLeftAddon.displayName = 'InputLeftAddon';
