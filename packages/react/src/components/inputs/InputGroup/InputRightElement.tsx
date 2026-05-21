'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';
import type { InputElementProps } from './InputGroup.types';

const InputRightElementBase = forwardRef<HTMLDivElement, InputElementProps>(
  ({ className, children, ...props }, ref) => {
    const ctx = useInputGroup();
    const styles = inputGroup({ size: ctx?.size ?? 'md' });

    return (
      <div ref={ref} data-placement="right" className={cx(styles.element, className)} {...props}>
        {children}
      </div>
    );
  },
);

InputRightElementBase.displayName = 'InputRightElement';

/**
 * Right-side inline element positioned inside an InputGroup field.
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
 * - **Required**: Keep focusable actions outside this slot unless the interaction is explicitly designed.
 *
 * ### AI Usage
 * - **DO**: Use for non-interactive status icons, units, or suffix hints.
 * - **DON'T**: Do not hide validation text here; use `FormHelperText` or `FormErrorMessage`.
 *
 * @example Standard usage
 * ```tsx
 * <InputGroup>
 *   <InputGroup.Input aria-label="Email" />
 *   <InputGroup.RightElement aria-hidden="true"><CheckIcon /></InputGroup.RightElement>
 * </InputGroup>
 * ```
 *
 * @example Text suffix
 * ```tsx
 * <InputGroup>
 *   <InputGroup.Input aria-label="Weight" />
 *   <InputRightElement aria-hidden="true">kg</InputRightElement>
 * </InputGroup>
 * ```
 */
export const InputRightElement = Object.assign(InputRightElementBase, {
  [INPUT_GROUP_SLOT]: 'rightElement' as const,
});

InputRightElement.displayName = 'InputRightElement';
