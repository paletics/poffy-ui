'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { Children, ElementType, forwardRef } from 'react';
import type { ListItemTextComponent, ListItemTextProps } from './List.types';
import { useListContext } from './ListContext';
import { isAsChildHost } from '@/components/shared/asChild';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const listItemTextAsChildHosts = new Set(['a', 'label', 'p', 'span']);

const ListItemTextImpl = forwardRef<Element, ListItemTextProps>((props, ref) => {
  const { asChild, children, primary, secondary, className, ...rest } = props;
  const { classes } = useListContext();
  const childArray = Children.toArray(materializeReactNodeTree(children));
  const [anchor, ...remainingChildren] = childArray;
  const canUseAsChild = Boolean(
    asChild && isAsChildHost(anchor, listItemTextAsChildHosts) && remainingChildren.length === 0,
  );
  const Component = (canUseAsChild ? Slot : 'div') as ElementType;
  const TextSlotElement = canUseAsChild ? 'span' : 'div';

  return (
    <Component ref={ref} className={cx(classes.text, className)} {...rest}>
      {canUseAsChild ? <Slottable>{anchor}</Slottable> : null}
      {primary != null && (
        <TextSlotElement className={cx(classes.primary)}>{primary}</TextSlotElement>
      )}
      {secondary != null && (
        <TextSlotElement className={cx(classes.secondary)}>{secondary}</TextSlotElement>
      )}
      {canUseAsChild ? null : childArray}
    </Component>
  );
});

ListItemTextImpl.displayName = 'List.Text';

/**
 * Renders primary and secondary text slots for a list item.
 *
 * `primary` and `secondary` are emitted in separate styled elements. With
 * `asChild`, exactly one supported text host is delegated and those slots use
 * inline wrappers; otherwise children and slots are placed in a `div`.
 */

export const ListItemText = ListItemTextImpl as ListItemTextComponent;
