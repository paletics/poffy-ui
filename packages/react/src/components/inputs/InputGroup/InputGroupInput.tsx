'use client';

import { css, cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { Input } from '../Input';
import type { InputProps } from '../Input/Input.types';
import { useInputGroup } from './InputGroupContext';
import type { InputGroupProps } from './InputGroup.types';

const getElementPaddingClass = (
  size: InputGroupProps['size'],
  hasLeftElement: boolean,
  hasRightElement: boolean,
) =>
  css({
    pl: hasLeftElement ? (size === 'lg' ? '3xl' : size === 'md' ? '2xl' : 'xl') : undefined,
    pr: hasRightElement ? (size === 'lg' ? '3xl' : size === 'md' ? '2xl' : 'xl') : undefined,
  });

const getAddonRadiusClass = (hasLeftAddon: boolean, hasRightAddon: boolean) =>
  css({
    borderTopLeftRadius: hasLeftAddon ? 'none' : undefined,
    borderBottomLeftRadius: hasLeftAddon ? 'none' : undefined,
    borderTopRightRadius: hasRightAddon ? 'none' : undefined,
    borderBottomRightRadius: hasRightAddon ? 'none' : undefined,
  });

/**
 * Input field that adapts its padding and border radius to surrounding InputGroup slots.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`inputGroup` slot recipe), `Input`, InputGroup context
 * - **Props**: `InputProps`
 *
 * ### Design Tokens
 * - **spacing**: left/right padding expands when inline elements are present
 * - **color**: delegates field border, background, focus, and error styling to `Input`
 *
 * ### Variant Logic
 * - **size**: Inherited from the nearest `InputGroup`; explicit `size` is ignored inside a group.
 *
 * ### Accessibility
 * - **Role**: textbox or native input role from the underlying `Input`.
 * - **Pattern**: Single form field with visual decorations.
 * - **Keyboard**: Native input keyboard behavior.
 * - **Required**: Provide `aria-label`, `aria-labelledby`, or a `FormLabel`.
 *
 * ### AI Usage
 * - **DO**: Use this instead of bare `Input` inside `InputGroup`.
 * - **DON'T**: Do not rely on this component outside `InputGroup` for grouped border behavior.
 *
 * @example With addon
 * ```tsx
 * <InputGroup>
 *   <InputGroup.LeftAddon>$</InputGroup.LeftAddon>
 *   <InputGroup.Input aria-label="Amount" />
 * </InputGroup>
 * ```
 *
 * @example With icon element
 * ```tsx
 * <InputGroup size="lg">
 *   <InputGroup.LeftElement aria-hidden="true"><SearchIcon /></InputGroup.LeftElement>
 *   <InputGroup.Input aria-label="Search" />
 * </InputGroup>
 * ```
 */
export const InputGroupInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const ctx = useInputGroup();
  if (!ctx) return <Input ref={ref} {...props} />;

  const { className, size: _size, ...rest } = props;
  const styles = inputGroup({ size: ctx.size });
  const elementPaddingClass = getElementPaddingClass(
    ctx.size,
    ctx.hasLeftElement,
    ctx.hasRightElement,
  );
  const addonRadiusClass = getAddonRadiusClass(ctx.hasLeftAddon, ctx.hasRightAddon);

  return (
    <Input
      ref={ref}
      size={ctx.size as InputProps['size']}
      {...rest}
      className={cx(styles.input, elementPaddingClass, addonRadiusClass, className)}
      data-has-left-addon={ctx.hasLeftAddon ? '' : undefined}
      data-has-right-addon={ctx.hasRightAddon ? '' : undefined}
      data-has-left-element={ctx.hasLeftElement ? '' : undefined}
      data-has-right-element={ctx.hasRightElement ? '' : undefined}
    />
  );
});

InputGroupInput.displayName = 'InputGroupInput';
