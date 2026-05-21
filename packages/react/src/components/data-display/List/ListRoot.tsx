'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { list } from '@/styled-system/recipes';
import { ElementType, forwardRef, useMemo } from 'react';
import { ListProps } from './List.types';
import { ListContext } from './ListContext';

/**
 * The root container for the List component, rendering as `ul` or `ol` based on variant.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: list), React Context, Radix Slot
 * ### Design Tokens
 * - gap/padding: silver-ratio tokens
 * ### Variant Logic
 * - plain: Unstyled flexible list. ordered: Numbered items. unordered: Bulleted items.
 * ### Notes
 * Switches between `ul` and `ol` elements based on the `variant` prop.
 * ### Accessibility
 * - Ensures semantic list structure. Do not skip ListItem when nesting.
 * @example Composition pattern
 * ```tsx
 * import { List } from '@poffy-ui/react/data-display';
 * import { HomeIcon } from '@poffy-ui/react/media';
 *
 * <List.Root variant="unordered">
 *   <List.Item>
 *     <List.Icon><HomeIcon /></List.Icon>
 *     <List.Text primary="Home" secondary="Go to home page" />
 *   </List.Item>
 * </List.Root>
 * ```
 */
export const ListRoot = forwardRef<HTMLUListElement, ListProps>((props, ref) => {
  const { asChild, variant = 'plain', children, className, ...rest } = props;
  const classes = list({ variant });
  const Component = asChild ? Slot : ((variant === 'ordered' ? 'ol' : 'ul') as ElementType);

  const contextValue = useMemo(() => ({ variant }), [variant]);

  return (
    <ListContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        <Slottable>{children}</Slottable>
      </Component>
    </ListContext.Provider>
  );
});

ListRoot.displayName = 'List.Root';
