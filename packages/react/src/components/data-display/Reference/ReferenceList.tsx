import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { reference } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { Reference } from './Reference';
import type { ReferenceListProps } from './Reference.types';

/**
 * Navigation container for a compact list of references.
 */
export const ReferenceList = forwardRef<HTMLElement, ReferenceListProps>(
  (
    { asChild, references, children, className, 'aria-label': ariaLabel = 'References', ...rest },
    ref,
  ) => {
    const classes = reference();
    const Component = asChild ? Slot : 'nav';

    return (
      <Component ref={ref} className={cx(classes.list, className)} aria-label={ariaLabel} {...rest}>
        {references?.map((item, itemIndex) => (
          <Reference
            key={item.id ?? item.href ?? itemIndex}
            index={item.index ?? itemIndex + 1}
            label={item.label}
            href={item.href}
            external={item.external}
            description={item.description}
          />
        ))}
        {children}
      </Component>
    );
  },
);

ReferenceList.displayName = 'ReferenceList';
