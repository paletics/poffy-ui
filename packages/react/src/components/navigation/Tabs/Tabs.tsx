'use client';

import { cx } from '@/styled-system/css';
import { tabs } from '@/styled-system/recipes';
import { LayoutGroup } from 'motion/react';
import { forwardRef, useCallback, useId, useMemo, useState } from 'react';
import type { TabsProps } from './Tabs.types';
import { TabsContext } from './TabsContext';

/**
 * Organizes content into distinct views, each accessible via a tab trigger.
 *
 * @example
 * ```tsx
 * import { Tabs, TabContent, TabList, TabTrigger } from '@poffy-ui/react/navigation';
 *
 * <Tabs defaultValue="overview">
 *   <TabList>
 *     <TabTrigger value="overview">Overview</TabTrigger>
 *   </TabList>
 *   <TabContent value="overview">Summary content</TabContent>
 * </Tabs>
 * ```
 *
 * ### Notes
 * Required structure: each `TabTrigger` value must have a matching `TabContent`
 * value. Use controlled `value` with `onValueChange` when routing or URL state owns selection.
 *
 * ### AI Context & Architecture
 * - Tier: Organisms, Stack: Panda CSS (Recipe: tabs), TabsContext
 * ### Design Tokens
 * - gap/padding: silver-ratio tokens
 * ### Variant Logic
 * - variant: line=underline indicator, solid=filled active tab, pill=rounded active tab.
 * ### Notes
 * Supports controlled (`value` + `onValueChange`) and uncontrolled (`defaultValue`) modes.
 * ### Accessibility
 * - Follows WAI-ARIA Tabs pattern. TabList must use `role="tablist"`. Each TabTrigger must have `role="tab"` and `aria-selected`.
 * ### AI Usage
 * - Use when page content is categorized into 2-7 thematic sections.
 * - Enable `lazyMount` to defer mounting inactive panels for performance.
 * - Do not use Tabs for step-by-step workflows; use Stepper.
 *
 * Related: `TabsProps`
 */
export const Tabs = forwardRef<HTMLDivElement, TabsProps>((props, ref) => {
  const {
    children,
    defaultValue,
    value: controlledValue,
    onValueChange,
    appearance = 'ghost',
    variant,
    size,
    lazyMount,
    indicatorAnimation = 'stable',
    className,
    ...rest
  } = props;

  const [uncontrolledValue, setUncontrolledValue] = useState(defaultValue ?? '');
  const value = controlledValue ?? uncontrolledValue;
  const indicatorId = useId();
  const resolvedVariant =
    variant ?? (appearance === 'soft' ? 'pill' : appearance === 'outline' ? 'enclosed' : 'line');

  const setValue = useCallback(
    (newValue: string) => {
      if (controlledValue === undefined) {
        setUncontrolledValue(newValue);
      }
      onValueChange?.(newValue);
    },
    [controlledValue, onValueChange],
  );

  const classes = useMemo(() => tabs({ variant: resolvedVariant, size }), [resolvedVariant, size]);

  const contextValue = useMemo(
    () => ({
      value,
      setValue,
      classes,
      lazyMount,
      variant: resolvedVariant,
      indicatorId,
      indicatorAnimation,
    }),
    [value, classes, lazyMount, setValue, resolvedVariant, indicatorId, indicatorAnimation],
  );

  return (
    <TabsContext.Provider value={contextValue}>
      <LayoutGroup id={indicatorId}>
        <div ref={ref} className={cx(classes.root, className)} {...rest}>
          {children}
        </div>
      </LayoutGroup>
    </TabsContext.Provider>
  );
});

Tabs.displayName = 'Tabs';
