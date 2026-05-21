'use client';

import { ContentTransition } from '@/components/animations/ContentTransition';
import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { TabContentProps } from './Tabs.types';
import { useTabs } from './TabsContext';

/**
 * A content panel associated with a specific tab trigger.
 * Displays its children only when its value matches the currently selected tab.
 */
export const TabContent = forwardRef<HTMLDivElement, TabContentProps>((props, ref) => {
  const { children, value, className, ...rest } = props;
  const { value: selectedValue, classes, lazyMount } = useTabs();
  const isSelected = selectedValue === value;

  if (!isSelected && lazyMount) return null;

  const panel = (
    <div
      ref={ref}
      role="tabpanel"
      id={`tabpanel-${value}`}
      aria-labelledby={`tab-${value}`}
      hidden={!isSelected}
      className={cx(classes.content, className)}
      data-state={isSelected ? 'active' : 'inactive'}
      tabIndex={isSelected ? 0 : -1}
      {...rest}
    >
      {children}
    </div>
  );

  if (!isSelected) return panel;

  return (
    <ContentTransition
      asChild
      animationType="fade"
      initial={false}
      mode="wait"
      transitionKey={value}
    >
      {panel}
    </ContentTransition>
  );
});

TabContent.displayName = 'TabContent';
