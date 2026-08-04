'use client';

import { cx } from '@/styled-system/css';
import { forwardRef, useCallback } from 'react';
import type { TabListProps } from './Tabs.types';
import { useTabs } from './TabsContext';

/**
 * Groups TabTrigger components with the `tablist` role.
 *
 * Arrow keys follow the root orientation and document direction; Home and End move to the first
 * and last enabled trigger. These keys move focus only, leaving selection to trigger activation.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>((props, ref) => {
  const {
    children,
    className,
    onKeyDown,
    asChild: _unsupportedAsChild,
    'aria-orientation': _ariaOrientation,
    role: _role,
    ...rest
  } = props as TabListProps & {
    asChild?: boolean;
    'aria-orientation'?: unknown;
    role?: unknown;
  };
  const { classes, orientation } = useTabs();
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const target = e.target as HTMLElement;
      const tabTriggers = Array.from(
        e.currentTarget.querySelectorAll(
          '[role="tab"]:not([disabled]):not([aria-disabled="true"])',
        ),
      ) as HTMLElement[];
      const index = tabTriggers.indexOf(target);

      if (index === -1) return;

      let nextIndex = -1;
      if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabTriggers.length - 1;
      } else if (orientation === 'vertical') {
        if (e.key === 'ArrowDown') nextIndex = (index + 1) % tabTriggers.length;
        else if (e.key === 'ArrowUp') {
          nextIndex = (index - 1 + tabTriggers.length) % tabTriggers.length;
        }
      } else {
        const isRtl =
          e.currentTarget.ownerDocument.defaultView?.getComputedStyle(e.currentTarget).direction ===
          'rtl';
        if (e.key === (isRtl ? 'ArrowLeft' : 'ArrowRight')) {
          nextIndex = (index + 1) % tabTriggers.length;
        } else if (e.key === (isRtl ? 'ArrowRight' : 'ArrowLeft')) {
          nextIndex = (index - 1 + tabTriggers.length) % tabTriggers.length;
        }
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        const nextTrigger = tabTriggers[nextIndex];
        nextTrigger?.focus();

        nextTrigger?.scrollIntoView?.({ block: 'nearest', inline: 'nearest' });
      }
    },
    [onKeyDown, orientation],
  );

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- WAI-ARIA roving tabindex pattern: tablist container is intentionally not focusable; individual tab elements manage their own tabIndex per APG specification.
    <div
      ref={ref}
      {...rest}
      role="tablist"
      aria-orientation={orientation}
      data-orientation={orientation}
      className={cx(classes.list, className)}
      onKeyDown={handleKeyDown}
    >
      {children}
    </div>
  );
});

TabList.displayName = 'TabList';
