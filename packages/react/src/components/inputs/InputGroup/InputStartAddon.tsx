'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ElementType } from 'react';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import type { InputAddonComponent, InputAddonProps } from './InputGroup.types';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';

const InputStartAddonImpl = forwardRef<Element, InputAddonProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const classes = useInputGroup()?.classes ?? inputGroup({ size: 'md' });
    const Component = (asChild && isNonVoidAsChildHost(children) ? Slot : 'div') as ElementType;

    return (
      <Component
        ref={ref}
        data-placement="start"
        className={cx(classes.addon, className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

InputStartAddonImpl.displayName = 'InputStartAddon';

/**
 * Inline-start addon that extends the field border with prefix content.
 *
 * Use it for a fixed prefix or suffix-style action that belongs to the field boundary, rather than
 * for an overlaid decoration. `asChild` delegates to one non-void child host.
 */
export const InputStartAddon = Object.assign(InputStartAddonImpl as InputAddonComponent, {
  [INPUT_GROUP_SLOT]: 'startAddon' as const,
});
