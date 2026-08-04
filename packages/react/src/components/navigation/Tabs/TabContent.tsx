'use client';

import { ContentTransition } from '@/components/animations/ContentTransition';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { cx } from '@/styled-system/css';
import { forwardRef, useEffect, useId, useLayoutEffect, useState } from 'react';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import type { TabContentProps } from './Tabs.types';
import { useTabs } from './TabsContext';

type TabContentRuntimeProps = TabContentProps & {
  asChild?: boolean;
};

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/**
 * A content panel associated with a specific tab trigger.
 *
 * Unselected panels remain mounted and hidden by default so their state persists. With `lazyMount`,
 * a panel is not mounted until first selected, then remains mounted while inactive. A panel without
 * a matching trigger receives a fallback accessible name from its value unless the caller supplies
 * `aria-label`.
 */
export const TabContent = forwardRef<HTMLDivElement, TabContentProps>((props, ref) => {
  const {
    children,
    value,
    className,
    tabIndex,
    asChild: _unsupportedAsChild,
    'aria-label': ariaLabel,
    ...rest
  } = props as TabContentRuntimeProps;
  const {
    value: selectedValue,
    classes,
    lazyMount,
    registerContent,
    getTabAssociation,
  } = useTabs();
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const panelId = useId();
  const [panelNode, setPanelNode] = useState<HTMLDivElement | null>(null);
  const mergedRef = useMergeRefs(setPanelNode, ref);
  const association = getTabAssociation(value);
  const resolvedPanelId = association.panelId ?? panelId;
  const isSelected = !association.invalid && selectedValue === value;
  const [hasBeenSelected, setHasBeenSelected] = useState(isSelected);

  if (isSelected && !hasBeenSelected) setHasBeenSelected(true);

  useIsomorphicLayoutEffect(() => {
    if (!panelNode) return;
    return registerContent({
      registrationKey: panelId,
      domId: resolvedPanelId,
      value,
      node: panelNode,
    });
  }, [panelId, panelNode, registerContent, resolvedPanelId, value]);

  if (!isSelected && lazyMount && !hasBeenSelected) return null;

  const panel = (
    <div
      ref={mergedRef}
      {...rest}
      role="tabpanel"
      id={resolvedPanelId}
      aria-label={
        !association.hasMatchingTrigger
          ? ariaLabel?.trim()
            ? ariaLabel
            : messages.tabPanel(value)
          : ariaLabel
      }
      aria-labelledby={association.hasMatchingTrigger ? association.triggerId : undefined}
      hidden={!isSelected}
      className={cx(classes.content, className)}
      data-state={isSelected ? 'active' : 'inactive'}
      tabIndex={isSelected ? (tabIndex ?? 0) : -1}
    >
      {children}
    </div>
  );

  if (!isSelected || lazyMount) return panel;

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
