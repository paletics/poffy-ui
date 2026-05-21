'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';
import type { InputElementProps } from './InputGroup.types';

const InputLeftElementBase = forwardRef<HTMLDivElement, InputElementProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useInputGroup();
    const styles = inputGroup({ size: ctx?.size ?? 'md' });

    return (
      <div ref={ref} data-placement="left" className={cx(styles.element, className)} {...props}>
        {children}
      </div>
    );
  },
);

InputLeftElementBase.displayName = 'InputLeftElement';

/**
 * Left-side inline element positioned inside an InputGroup field.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`inputGroup` slot recipe), InputGroup context
 * - **Props**: PrimitiveProps<'div'>
 *
 * ### Design Tokens
 * - **spacing**: reserved input padding and element width inherit from the InputGroup size recipe
 * - **color**: icon/text color uses semantic input decoration tokens from the recipe
 *
 * ### Variant Logic
 * - **size**: Inherited from the nearest `InputGroup`; falls back to `md` when rendered alone.
 *
 * ### Accessibility
 * - **Role**: generic `div`; mark decorative icons `aria-hidden="true"`.
 * - **Required**: Keep focus on the input; use addons or external buttons for interactive controls.
 *
 * ### AI Usage
 * - **DO**: Use for non-interactive search, mail, or currency icons.
 * - **DON'T**: Do not use as a button container.
 *
 * @example Standard usage
 * ```tsx
 * <InputGroup>
 *   <InputGroup.LeftElement aria-hidden="true"><SearchIcon /></InputGroup.LeftElement>
 *   <InputGroup.Input aria-label="Search" />
 * </InputGroup>
 * ```
 *
 * @example Text prefix
 * ```tsx
 * <InputGroup>
 *   <InputLeftElement aria-hidden="true">@</InputLeftElement>
 *   <InputGroup.Input aria-label="Username" />
 * </InputGroup>
 * ```
 */
export const InputLeftElement = Object.assign(InputLeftElementBase, {
  [INPUT_GROUP_SLOT]: 'leftElement' as const,
});

InputLeftElement.displayName = 'InputLeftElement';
