'use client';

import { cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ElementType } from 'react';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import type { InputAddonComponent, InputAddonProps } from './InputGroup.types';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';

const InputEndAddonImpl = forwardRef<Element, InputAddonProps>(
  ({ className, children, asChild, ...props }, ref) => {
    const classes = useInputGroup()?.classes ?? inputGroup({ size: 'md' });
    const Component = (asChild && isNonVoidAsChildHost(children) ? Slot : 'div') as ElementType;

    return (
      <Component ref={ref} data-placement="end" className={cx(classes.addon, className)} {...props}>
        {children}
      </Component>
    );
  },
);

InputEndAddonImpl.displayName = 'InputEndAddon';

/**
 * Inline-end addon that extends the field border with suffix content.
 *
 * Use it for a fixed suffix or boundary action, rather than an overlaid decoration. `asChild`
 * delegates to one non-void child host.
 */
export const InputEndAddon = Object.assign(InputEndAddonImpl as InputAddonComponent, {
  [INPUT_GROUP_SLOT]: 'endAddon' as const,
});
