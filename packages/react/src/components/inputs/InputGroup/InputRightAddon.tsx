'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';
import type { InputAddonProps } from './InputGroup.types';

const InputRightAddonBase = forwardRef<HTMLDivElement, InputAddonProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useInputGroup();
    const styles = inputGroup({ size: ctx?.size ?? 'md' });

    return (
      <div ref={ref} data-placement="right" className={cx(styles.addon, className)} {...props}>
        {children}
      </div>
    );
  },
);

InputRightAddonBase.displayName = 'InputRightAddon';

/**
 * Right-side addon that visually extends an InputGroup field border with suffix content.
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
 * - **Role**: generic `div`; suffix text should supplement, not replace, the input's label.
 * - **Required**: Provide a label or accessible name on the grouped input.
 *
 * ### AI Usage
 * - **DO**: Use for units, domains, or static suffix hints.
 * - **DON'T**: Do not place focusable buttons or menus inside addons.
 *
 * @example Standard usage
 * ```tsx
 * <InputGroup>
 *   <InputGroup.Input aria-label="Amount" />
 *   <InputGroup.RightAddon>USD</InputGroup.RightAddon>
 * </InputGroup>
 * ```
 *
 * @example Named export
 * ```tsx
 * <InputGroup>
 *   <InputGroup.Input aria-label="Domain" />
 *   <InputRightAddon>.com</InputRightAddon>
 * </InputGroup>
 * ```
 */
export const InputRightAddon = Object.assign(InputRightAddonBase, {
  [INPUT_GROUP_SLOT]: 'rightAddon' as const,
});

InputRightAddon.displayName = 'InputRightAddon';
