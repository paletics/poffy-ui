'use client';

import { forwardRef } from 'react';
import { ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { useComboBoxContext } from './ComboBoxContext';

/**
 * Props for the popover listbox that contains ComboBox items.
 */
export type ComboBoxListProps = React.HTMLAttributes<HTMLDivElement>;

/**
 * Popup listbox container for ComboBox options.
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (`comboBox` slot recipe), `ListboxPopoverContent`
 * - **Props**: native `div` attributes for the popover content wrapper
 *
 * ### Design Tokens
 * - **spacing**: option list padding and gap are controlled by the `comboBox` recipe
 * - **color**: popup background, border, and shadow use semantic surface tokens
 *
 * ### Variant Logic
 * - **size**: Inherited from `ComboBoxRoot`.
 * - **appearance/variant**: Inherited from `ComboBoxRoot`.
 *
 * ### Accessibility
 * - **Role**: `listbox` on the popover content.
 * - **Pattern**: WAI-ARIA listbox owned by `ComboBoxInput`.
 * - **Keyboard**: Active option is managed by `ComboBoxInput` through `aria-activedescendant`.
 * - **Required**: Render `ComboBox.Item` children inside the list.
 *
 * ### AI Usage
 * - **DO**: Use as the only list container for a `ComboBox.Root`.
 * - **DON'T**: Do not put focusable controls inside the listbox.
 *
 * @example Standard usage
 * ```tsx
 * <ComboBox.List>
 *   <ComboBox.Item value="react" label="React" />
 * </ComboBox.List>
 * ```
 *
 * @example Manual items
 * ```tsx
 * <ComboBox.List>
 *   {options.map((option) => <ComboBox.Item key={option.value} {...option} />)}
 * </ComboBox.List>
 * ```
 */
export const ComboBoxList = forwardRef<HTMLUListElement, ComboBoxListProps>((props, ref) => {
  const { children, ...rest } = props;
  const { classes, listId, inputId } = useComboBoxContext();

  return (
    <ListboxPopoverContent
      id={listId}
      role="listbox"
      aria-labelledby={inputId}
      className={classes.content}
      {...rest}
    >
      <ul ref={ref} role="presentation">
        {children}
      </ul>
    </ListboxPopoverContent>
  );
});

ComboBoxList.displayName = 'ComboBoxList';
