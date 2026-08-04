'use client';

import { css, cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { Input } from '../Input';
import type { InputProps } from '../Input/Input.types';
import { useInputGroup } from './InputGroupContext';
import type { InputGroupInputProps, InputGroupProps } from './InputGroup.types';

const getElementPaddingClass = (
  size: InputGroupProps['size'],
  hasStartElement: boolean,
  hasEndElement: boolean,
) =>
  css({
    paddingInlineStart: hasStartElement
      ? size === 'lg'
        ? '3xl'
        : size === 'md'
          ? '2xl'
          : 'xl'
      : undefined,
    paddingInlineEnd: hasEndElement
      ? size === 'lg'
        ? '3xl'
        : size === 'md'
          ? '2xl'
          : 'xl'
      : undefined,
  });

const getAddonRadiusClass = (hasStartAddon: boolean, hasEndAddon: boolean) =>
  css({
    borderStartStartRadius: hasStartAddon ? 'none' : undefined,
    borderEndStartRadius: hasStartAddon ? 'none' : undefined,
    borderStartEndRadius: hasEndAddon ? 'none' : undefined,
    borderEndEndRadius: hasEndAddon ? 'none' : undefined,
  });

/**
 * Input field that adapts its padding and border radius to surrounding InputGroup slots.
 *
 * Its size always comes from the nearest InputGroup; a supplied `size` value is ignored at runtime
 * for untyped callers. Outside a group it renders the regular Input with the default Input size.
 */
export const InputGroupInput = forwardRef<HTMLInputElement, InputGroupInputProps>((props, ref) => {
  const { className, size: _size, ...rest } = props as InputProps;
  const ctx = useInputGroup();
  if (!ctx) return <Input ref={ref} className={className} {...rest} />;

  // Keep the runtime boundary defensive for untyped JavaScript consumers while
  // excluding size from the public compound-slot contract.
  const elementPaddingClass = getElementPaddingClass(
    ctx.size,
    ctx.hasStartElement,
    ctx.hasEndElement,
  );
  const addonRadiusClass = getAddonRadiusClass(ctx.hasStartAddon, ctx.hasEndAddon);

  return (
    <Input
      ref={ref}
      size={ctx.size as InputProps['size']}
      {...rest}
      className={cx(ctx.classes.input, elementPaddingClass, addonRadiusClass, className)}
      data-has-start-addon={ctx.hasStartAddon ? '' : undefined}
      data-has-end-addon={ctx.hasEndAddon ? '' : undefined}
      data-has-start-element={ctx.hasStartElement ? '' : undefined}
      data-has-end-element={ctx.hasEndElement ? '' : undefined}
    />
  );
});

InputGroupInput.displayName = 'InputGroupInput';
