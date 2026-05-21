'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { Children, forwardRef, isValidElement, useMemo } from 'react';
import type { ReactNode } from 'react';
import { InputGroupContext } from './InputGroupContext';
import { INPUT_GROUP_SLOT, type InputGroupSlotComponent } from './InputGroupSlot';
import type { InputGroupProps } from './InputGroup.types';

const getSlot = (child: unknown) =>
  isValidElement(child) ? (child.type as InputGroupSlotComponent)[INPUT_GROUP_SLOT] : undefined;

const partitionChildren = (children: ReactNode) => {
  const slots: {
    leftAddon?: ReactNode;
    rightAddon?: ReactNode;
    leftElement?: ReactNode;
    rightElement?: ReactNode;
    fieldChildren: ReactNode[];
  } = { fieldChildren: [] };

  Children.forEach(children, (child) => {
    const slot = getSlot(child);

    if (slot === 'leftAddon') {
      slots.leftAddon = child;
      return;
    }

    if (slot === 'rightAddon') {
      slots.rightAddon = child;
      return;
    }

    if (slot === 'leftElement') {
      slots.leftElement = child;
      return;
    }

    if (slot === 'rightElement') {
      slots.rightElement = child;
      return;
    }

    slots.fieldChildren.push(child);
  });

  return slots;
};

/**
 * Layout wrapper that connects an input field with prefix/suffix addons and inline elements.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`inputGroup` slot recipe), React context, marker-based slot parsing
 * - **Props**: PrimitiveProps<'div'>
 *
 * ### Design Tokens
 * - **spacing**: input padding, addon padding, and inline element width use size-based recipe tokens
 * - **color**: input/addon borders and decoration text use semantic input tokens
 *
 * ### Variant Logic
 * - **size="sm"**: Compact search bars or dense filters.
 * - **size="md"**: Default form fields and settings pages.
 * - **size="lg"**: Prominent fields with larger hit targets.
 *
 * ### Accessibility
 * - **Role**: generic `div`; the nested `InputGroup.Input` provides textbox semantics.
 * - **Pattern**: Grouped form field with visual decorations.
 * - **Keyboard**: Focus moves to the inner input; addons/elements do not add keyboard stops.
 * - **Required**: Provide `aria-label`, `aria-labelledby`, or a `FormLabel` for the inner input.
 *
 * ### AI Usage
 * - **DO**: Use for single fields with static prefixes, suffixes, or decorative icons.
 * - **DON'T**: Do not use to group unrelated form controls or action buttons.
 *
 * @example Addon composition
 * ```tsx
 * <InputGroup>
 *   <InputGroup.LeftAddon>https://</InputGroup.LeftAddon>
 *   <InputGroup.Input aria-label="Website" />
 * </InputGroup>
 * ```
 *
 * @example Inline icon composition
 * ```tsx
 * <InputGroup size="sm">
 *   <InputGroup.LeftElement aria-hidden="true"><SearchIcon /></InputGroup.LeftElement>
 *   <InputGroup.Input aria-label="Search" />
 * </InputGroup>
 * ```
 */
export const InputGroupRoot = forwardRef<HTMLDivElement, InputGroupProps>(
  ({ size = 'md', className, children, ...props }, ref) => {
    const childArray = Children.toArray(children);

    const hasLeftAddon = childArray.some((c) => getSlot(c) === 'leftAddon');
    const hasRightAddon = childArray.some((c) => getSlot(c) === 'rightAddon');
    const hasLeftElement = childArray.some((c) => getSlot(c) === 'leftElement');
    const hasRightElement = childArray.some((c) => getSlot(c) === 'rightElement');
    const { leftAddon, rightAddon, leftElement, rightElement, fieldChildren } =
      partitionChildren(children);

    const styles = inputGroup({ size });
    const contextValue = useMemo(
      () => ({ size, hasLeftAddon, hasRightAddon, hasLeftElement, hasRightElement }),
      [size, hasLeftAddon, hasRightAddon, hasLeftElement, hasRightElement],
    );

    return (
      <InputGroupContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cx(styles.root, className)}
          data-has-left-addon={hasLeftAddon ? '' : undefined}
          data-has-right-addon={hasRightAddon ? '' : undefined}
          data-has-left-element={hasLeftElement ? '' : undefined}
          data-has-right-element={hasRightElement ? '' : undefined}
          {...props}
        >
          {leftAddon}
          <div className={styles.field}>
            {leftElement}
            {fieldChildren}
            {rightElement}
          </div>
          {rightAddon}
        </div>
      </InputGroupContext.Provider>
    );
  },
);

InputGroupRoot.displayName = 'InputGroup';
