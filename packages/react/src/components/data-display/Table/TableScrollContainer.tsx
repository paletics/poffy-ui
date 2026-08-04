'use client';

import { getCommonMessages } from '@/components/shared/common.locales';
import { cx } from '@/styled-system/css';
import { tableScrollContainer } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { TableScrollContainerProps } from './Table.types';
import { handleHorizontalOverflowKeyDown } from '@/components/shared/handleHorizontalOverflowKeyDown';
import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';

/**
 * An optional native horizontal scroll owner for tables wider than their container.
 *
 * ### Notes
 * This component deliberately renders a fixed `<div>` outside `Table`. It does not
 * alter the table's semantic DOM, forwarded ref, server markup, or `asChild` behavior.
 * It enters the tab order only while it overflows, so keyboard users can reach a wide
 * table even when it has no focusable descendants. Supply an accessible name to replace
 * the localized default when the table needs more specific context.
 *
 * @example
 * ```tsx
 * <Table.ScrollContainer aria-label="Quarterly results">
 *   <Table>...</Table>
 * </Table.ScrollContainer>
 * ```
 */
export const TableScrollContainer = forwardRef<HTMLDivElement, TableScrollContainerProps>(
  (
    {
      className,
      children,
      onKeyDown,
      tabIndex,
      role,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const [overflowRef, overflowTabIndex] = useOverflowFocusability<HTMLDivElement>({
      axis: 'horizontal',
      explicitTabIndex: tabIndex,
    });
    const mergedRef = useMergeRefs(ref, overflowRef);
    const hasScrollableRegionRole = overflowTabIndex !== undefined;
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(event);
      handleHorizontalOverflowKeyDown(event);
    };

    return (
      <div
        ref={mergedRef}
        className={cx(tableScrollContainer(), className)}
        onKeyDown={handleKeyDown}
        tabIndex={overflowTabIndex}
        role={role ?? (hasScrollableRegionRole ? 'region' : undefined)}
        aria-label={
          ariaLabel ??
          (ariaLabelledBy
            ? undefined
            : hasScrollableRegionRole
              ? messages.scrollableTable
              : undefined)
        }
        aria-labelledby={ariaLabelledBy}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

TableScrollContainer.displayName = 'Table.ScrollContainer';
