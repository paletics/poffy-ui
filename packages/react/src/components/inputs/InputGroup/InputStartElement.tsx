'use client';

import { css, cx } from '@/styled-system/css';
import { inputGroup } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ElementType } from 'react';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import type { InputElementComponent, InputElementProps } from './InputGroup.types';
import { useInputGroup } from './InputGroupContext';
import { INPUT_GROUP_SLOT } from './InputGroupSlot';

const InputStartElementImpl = forwardRef<Element, InputElementProps>(
  ({ className, children, asChild, interactive = false, ...props }, ref) => {
    const classes = useInputGroup()?.classes ?? inputGroup({ size: 'md' });
    const Component = (asChild && isNonVoidAsChildHost(children) ? Slot : 'div') as ElementType;

    return (
      <Component
        ref={ref}
        data-input-group-element=""
        data-placement="start"
        data-interactive={interactive ? '' : undefined}
        className={cx(classes.element, interactive && css({ pointerEvents: 'auto' }), className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

InputStartElementImpl.displayName = 'InputStartElement';

/**
 * Inline-start element positioned inside the field.
 *
 * It is pointer-inert by default so decorative icons do not block input focus. Set `interactive`
 * only for an independently labelled control, such as an icon button. `asChild` delegates to one
 * non-void child host.
 */
export const InputStartElement = Object.assign(InputStartElementImpl as InputElementComponent, {
  [INPUT_GROUP_SLOT]: 'startElement' as const,
});
