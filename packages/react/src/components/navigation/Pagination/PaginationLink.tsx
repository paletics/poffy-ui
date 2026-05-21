'use client';

import { LayoutTransition } from '@/components/animations/LayoutTransition';
import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { KeyboardEvent } from 'react';
import type { PaginationLinkProps } from './Pagination.types';
import { usePagination } from './PaginationContext';

/**
 * An interactive link within a PaginationItem.
 * It automatically handles styling and accessibility attributes based on its active or disabled state.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: LayoutTransition active indicator, PaginationContext
 * - **Props**: PaginationLinkProps
 *
 * ### Accessibility
 * - **Role**: link.
 * - **Keyboard**: Enter / Space dispatches click behavior when the link is enabled.
 * - **State**: `aria-current="page"` marks the current page; `aria-disabled`
 *   marks unavailable previous or next links.
 *
 * ### AI Usage
 * - **DO**: Render inside `PaginationItem` within `Pagination`.
 * - **DO**: Provide page numbers or short labels as children.
 * - **DON'T**: Use without an `onClick` or navigation handler unless an outer
 *   pagination controller handles the event.
 *
 * @example Page link
 * ```tsx
 * import { Pagination, PaginationItem, PaginationLink } from '@poffy-ui/react/navigation';
 *
 * <Pagination aria-label="Results pages">
 *   <PaginationItem>
 *     <PaginationLink isActive onClick={() => setPage(1)}>1</PaginationLink>
 *   </PaginationItem>
 * </Pagination>
 * ```
 *
 * @example Disabled previous link
 * ```tsx
 * import { PaginationItem, PaginationLink } from '@poffy-ui/react/navigation';
 *
 * <PaginationItem>
 *   <PaginationLink disabled onClick={goToPrevious}>Previous</PaginationLink>
 * </PaginationItem>
 * ```
 */
export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>((props, ref) => {
  const { className, isActive, disabled, onClick, onKeyDown, tabIndex, children, ...rest } = props;
  const { classes, indicatorId, indicatorAnimation } = usePagination();

  const handleKeyDown = (e: KeyboardEvent<HTMLAnchorElement>) => {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      e.currentTarget.click();
    }
    onKeyDown?.(e);
  };

  return (
    <a
      ref={ref}
      role="link"
      aria-current={isActive ? 'page' : undefined}
      data-current={isActive ? '' : undefined}
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      {...rest}
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      onClick={disabled ? undefined : onClick}
      onKeyDown={handleKeyDown}
      className={cx(classes.link, className)}
    >
      {isActive && (
        <LayoutTransition
          aria-hidden="true"
          className={classes.activeIndicator}
          layoutId={indicatorId}
          animationType={indicatorAnimation}
          customData={indicatorAnimation === 'stable' ? { stiffness: 520, damping: 42 } : undefined}
        />
      )}
      <span className={classes.linkLabel}>{children}</span>
    </a>
  );
});

PaginationLink.displayName = 'PaginationLink';
