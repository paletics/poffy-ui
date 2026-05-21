'use client';

import { LayoutTransition } from '@/components/animations/LayoutTransition';
import { cx } from '@/styled-system/css';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { ElementType, forwardRef, useCallback } from 'react';
import type { TabTriggerProps } from './Tabs.types';
import { useTabs } from './TabsContext';

/**
 * An interactive button used to activate a specific tab.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: ActionMotion, Radix Slot, Recipe: tabs
 * ### Design Tokens
 * - colors: text.secondary -> brand.main (selected)
 * ### Variant Logic
 * - Default: Tab list item. Selected: Highlighted with brand.main indicator.
 * ### Accessibility
 * - Must be placed within a TabList. Handles role="tab" and aria-selected automatically.
 * - `value` must match exactly one `TabContent` value.
 * ### AI Usage
 * - **DO**: Use a stable, unique `value` string for each trigger.
 * - **DO**: Keep trigger text short enough for horizontal tab lists.
 * - **DON'T**: Use `TabTrigger` for links that navigate to new pages; use
 *   tabs for switching panels within the same context.
 *
 * @example Matching tab trigger and content
 * ```tsx
 * import { TabContent, TabList, TabTrigger, Tabs } from '@poffy-ui/react/navigation';
 *
 * <Tabs defaultValue="overview">
 *   <TabList>
 *     <TabTrigger value="overview">Overview</TabTrigger>
 *   </TabList>
 *   <TabContent value="overview">Overview content</TabContent>
 * </Tabs>
 * ```
 *
 * @example Custom trigger child
 * ```tsx
 * import { TabList, TabTrigger, Tabs } from '@poffy-ui/react/navigation';
 *
 * <Tabs defaultValue="activity">
 *   <TabList>
 *     <TabTrigger value="activity" asChild>
 *       <button type="button">Activity</button>
 *     </TabTrigger>
 *   </TabList>
 * </Tabs>
 * ```
 */
export const TabTrigger = forwardRef<HTMLButtonElement, TabTriggerProps>((props, ref) => {
  const { children, value, className, onClick, asChild, tabIndex, ...rest } = props;
  const {
    value: selectedValue,
    setValue,
    classes,
    variant,
    indicatorId,
    indicatorAnimation,
  } = useTabs();
  const isSelected = selectedValue === value;
  const shouldRenderIndicator = isSelected && Boolean(variant);

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      setValue(value);
      onClick?.(e);
    },
    [setValue, value, onClick],
  );

  const Component = (asChild ? Slot : 'button') as ElementType;

  return (
    <Component
      ref={ref}
      role="tab"
      aria-selected={isSelected}
      id={`tab-${value}`}
      aria-controls={`tabpanel-${value}`}
      type={asChild ? undefined : 'button'}
      tabIndex={isSelected ? (tabIndex ?? 0) : -1}
      className={cx(classes.trigger, className)}
      data-selected={isSelected ? '' : undefined}
      onClick={handleClick}
      {...rest}
    >
      {shouldRenderIndicator ? (
        <LayoutTransition
          asChild
          animationType={indicatorAnimation}
          layoutId={indicatorId}
          customData={indicatorAnimation === 'stable' ? { stiffness: 520, damping: 42 } : undefined}
        >
          <span aria-hidden="true" className={classes.indicator} />
        </LayoutTransition>
      ) : null}
      <Slottable>{children}</Slottable>
    </Component>
  );
});

TabTrigger.displayName = 'TabTrigger';
