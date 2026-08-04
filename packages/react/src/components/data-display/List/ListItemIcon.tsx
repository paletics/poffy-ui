'use client';

import { Slot } from '@radix-ui/react-slot';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { cx } from '@/styled-system/css';
import { ElementType, forwardRef } from 'react';
import type { ListItemIconComponent, ListItemIconProps } from './List.types';
import { useListContext } from './ListContext';
import { isListIconAsChildHost } from './List.utils';

const ListItemIconImpl = forwardRef<Element, ListItemIconProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes } = useListContext();
  const canUseAsChild = Boolean(asChild && isListIconAsChildHost(children));
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.icon, className)} {...rest}>
      {getSafeInteractiveContent(children, { preserveOpaque: true })}
    </Component>
  );
});

ListItemIconImpl.displayName = 'List.Icon';

/**
 * Renders the leading visual region of a list item.
 *
 * Content is sanitized to avoid nested interactive controls. `asChild`
 * delegates only to a supported icon host; otherwise this component renders a
 * `div`. Decorative icons should remain hidden from assistive technology.
 */

export const ListItemIcon = ListItemIconImpl as ListItemIconComponent;
