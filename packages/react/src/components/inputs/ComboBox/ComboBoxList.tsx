'use client';

import { forwardRef, type ReactNode, useEffect, useRef } from 'react';
import { ListboxPopoverContent } from '@/components/overlay/ListboxPopover';
import { css, cx } from '@/styled-system/css';
import { getTreeElementById } from '@poffy-ui/behavior/hooks';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import { useComboBoxContext } from './ComboBoxContext';

/**
 * Props for the popover listbox that contains ComboBox items.
 */
export interface ComboBoxListProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  'aria-labelledby' | 'id' | 'role'
> {
  /** Content shown while the root is waiting for remote options. */
  loadingContent?: ReactNode;
  /** Content shown when filtering produces no options. */
  emptyContent?: ReactNode;
}

const statusClass = css({ px: 'md', py: 'sm', color: 'text.secondary' });

/**
 * Popup listbox for `ComboBox.Item` children.
 *
 * It scrolls the active option into view, replaces items with a polite loading status while the
 * root is loading, and renders empty content when filtering leaves no options.
 */
export const ComboBoxList = forwardRef<HTMLDivElement, ComboBoxListProps>((props, ref) => {
  const {
    children,
    className,
    loadingContent = 'Loading options…',
    emptyContent = 'No options found.',
    id: _id,
    role: _role,
    'aria-labelledby': _ariaLabelledBy,
    ...rest
  } = props as ComboBoxListProps & {
    id?: unknown;
    role?: unknown;
    'aria-labelledby'?: unknown;
  };
  const { classes, listId, inputId, filteredOptions, highlightedIndex, options, isLoading } =
    useComboBoxContext();
  const listRef = useRef<HTMLDivElement>(null);
  const mergedRef = useMergeRefs(listRef, ref);
  const activeOption = highlightedIndex >= 0 ? filteredOptions[highlightedIndex] : undefined;
  const activeOptionIndex = activeOption ? options.indexOf(activeOption) : -1;

  useEffect(() => {
    if (activeOptionIndex < 0) return;
    const option = listRef.current
      ? getTreeElementById(listRef.current, `${listId}-option-${activeOptionIndex}`)
      : null;
    if (option && listRef.current?.contains(option)) {
      option.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
    }
  }, [activeOptionIndex, listId]);

  return (
    <ListboxPopoverContent
      {...rest}
      ref={mergedRef}
      id={listId}
      aria-labelledby={inputId}
      className={cx(classes.content, className)}
    >
      {isLoading ? (
        <div className={statusClass} role="status" aria-live="polite">
          {loadingContent}
        </div>
      ) : filteredOptions.length === 0 ? (
        <div className={statusClass} role="status">
          {emptyContent}
        </div>
      ) : (
        <ul role="presentation">{children}</ul>
      )}
    </ListboxPopoverContent>
  );
});

ComboBoxList.displayName = 'ComboBoxList';
