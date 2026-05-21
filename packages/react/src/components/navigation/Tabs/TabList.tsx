'use client';

import { cx } from '@/styled-system/css';
import { forwardRef, useCallback } from 'react';
import type { TabListProps } from './Tabs.types';
import { useTabs } from './TabsContext';

/**
 * A container for TabTrigger components.
 * Manages accessibility roles and styling for the tab triggers.
 */
export const TabList = forwardRef<HTMLDivElement, TabListProps>((props, ref) => {
  const { children, className, onKeyDown, ...rest } = props;
  const { classes } = useTabs();
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      onKeyDown?.(e);
      if (e.defaultPrevented) return;

      const target = e.target as HTMLElement;
      const tabTriggers = Array.from(
        e.currentTarget.querySelectorAll('[role="tab"]:not([disabled])'),
      ) as HTMLElement[];
      const index = tabTriggers.indexOf(target);

      if (index === -1) return;

      let nextIndex = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % tabTriggers.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + tabTriggers.length) % tabTriggers.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabTriggers.length - 1;
      }

      if (nextIndex !== -1) {
        e.preventDefault();
        tabTriggers[nextIndex]?.focus();
      }
    },
    [onKeyDown],
  );

  return (
    // eslint-disable-next-line jsx-a11y/interactive-supports-focus -- WAI-ARIA roving tabindex pattern: tablist container is intentionally not focusable; individual tab elements manage their own tabIndex per APG specification.
    <div
      ref={ref}
      role="tablist"
      className={cx(classes.list, className)}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {children}
    </div>
  );
});

TabList.displayName = 'TabList';
