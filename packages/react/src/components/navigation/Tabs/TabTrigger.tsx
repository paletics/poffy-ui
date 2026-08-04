'use client';

import { LayoutTransition } from '@/components/animations/LayoutTransition';
import {
  getFallbackChildrenForNativeButton,
  isButtonCompatibleAsChildHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';
import { cx } from '@/styled-system/css';
import { Slot, Slottable } from '@radix-ui/react-slot';
import { guardDisabledActivationHandlers } from '@poffy-ui/behavior/activation';
import { useButtonKeyboardActivation } from '@poffy-ui/behavior/activation';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useState,
} from 'react';
import type { DOMAttributes } from 'react';
import type { TabTriggerProps } from './Tabs.types';
import type { TabTriggerComponent } from './Tabs.types';
import { useTabs } from './TabsContext';
import { isTabTriggerAsChildHost } from './TabTrigger.utils';

type TabTriggerRuntimeProps = Omit<TabTriggerProps, keyof DOMAttributes<Element>> &
  DOMAttributes<HTMLElement>;

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;


const TabTriggerImpl = forwardRef<HTMLElement, TabTriggerProps>((props, ref) => {
  const {
    children,
    value,
    className,
    onClick,
    onAuxClick,
    asChild,
    tabIndex: _tabIndex,
    disabled = false,
    onKeyDown,
    onKeyUp,
    onBlur,
    'aria-controls': _ariaControls,
    'aria-disabled': _ariaDisabled,
    'aria-selected': _ariaSelected,
    id: _id,
    role: _role,
    type: _type,
    ...rest
  } = props as TabTriggerRuntimeProps & {
    'aria-controls'?: unknown;
    'aria-disabled'?: unknown;
    'aria-selected'?: unknown;
    id?: unknown;
    role?: unknown;
    tabIndex?: number;
    type?: unknown;
  };
  const {
    value: selectedValue,
    setValue,
    classes,
    variant,
    indicatorId,
    indicatorAnimation,
    lazyMount,
    registerTrigger,
    getTabAssociation,
  } = useTabs();
  const triggerId = useId();
  const [triggerNode, setTriggerNode] = useState<HTMLElement | null>(null);
  const association = getTabAssociation(value);
  const resolvedTriggerId = association.triggerId ?? triggerId;
  const isDisabled = disabled || association.invalid;
  const isSelected = !association.invalid && selectedValue === value;
  const shouldRenderIndicator = isSelected && Boolean(variant);
  const asChildElement = asChild && isTabTriggerAsChildHost(children) ? children : null;
  const canUseAsChild = Boolean(asChildElement);
  const isNativeAsChildButton = asChildElement?.type === 'button';
  const isNativeAsChildAnchor = asChildElement?.type === 'a';
  const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
  const hostProps = asChild ? omitNativeButtonOnlyProps(rest) : rest;
  const fallbackChildren =
    asChild && !canUseAsChild ? getFallbackChildrenForNativeButton(children) : children;

  const handleClick = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      if (e.defaultPrevented) return;
      onClick?.(e);
      if (e.defaultPrevented) return;
      if (canUseAsChild && e.currentTarget.tagName !== 'BUTTON') e.preventDefault();
      if (isSelected) return;
      setValue(value);
    },
    [canUseAsChild, isDisabled, isSelected, setValue, value, onClick],
  );
  const handleAuxClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (event.defaultPrevented) return;
      onAuxClick?.(event);
      if (event.currentTarget.tagName === 'A' && !event.defaultPrevented) event.preventDefault();
    },
    [onAuxClick],
  );

  const setRefs = useMergeRefs<HTMLElement>(setTriggerNode, ref);

  useIsomorphicLayoutEffect(() => {
    if (!triggerNode) return;
    return registerTrigger({
      registrationKey: triggerId,
      domId: resolvedTriggerId,
      value,
      disabled,
      node: triggerNode,
    });
  }, [disabled, registerTrigger, resolvedTriggerId, triggerId, triggerNode, value]);

  const Component = canUseAsChild ? Slot : 'button';
  const guardedChildren = guardDisabledActivationHandlers(
    fallbackChildren,
    Boolean(canUseAsChild && isDisabled),
  );
  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: canUseAsChild && !isNativeAsChildButton && !isDisabled,
    onBlur,
    onKeyDown,
    onKeyUp,
  });
  const renderedChildren =
    canUseAsChild && isValidElement<Record<string, unknown>>(guardedChildren)
      ? cloneElement(guardedChildren, {
          role: 'tab',
          'aria-selected': isSelected,
          id: resolvedTriggerId,
          'aria-controls': [lazyMount && !isSelected, !association.hasMatchingPanel].some(Boolean)
            ? undefined
            : association.panelId,
          'aria-disabled': isDisabled ? true : undefined,
          tabIndex: isSelected ? 0 : -1,
          'data-selected': isSelected ? '' : undefined,
          'data-disabled': isDisabled ? '' : undefined,
          ...(isNativeAsChildAnchor ? { href: undefined } : {}),
          ...(isButtonCompatibleHost ? { disabled: isDisabled, type: 'button' } : {}),
        })
      : guardedChildren;

  return (
    <Component
      ref={setRefs}
      {...hostProps}
      role="tab"
      aria-selected={isSelected}
      id={resolvedTriggerId}
      aria-controls={
        [lazyMount && !isSelected, !association.hasMatchingPanel].some(Boolean)
          ? undefined
          : association.panelId
      }
      type={canUseAsChild ? undefined : 'button'}
      disabled={canUseAsChild ? undefined : isDisabled}
      aria-disabled={isDisabled ? true : undefined}
      tabIndex={isSelected ? 0 : -1}
      className={cx(classes.trigger, className)}
      data-selected={isSelected ? '' : undefined}
      data-disabled={isDisabled ? '' : undefined}
      onClick={handleClick}
      onAuxClick={handleAuxClick}
      onBlur={keyboardActivation.onBlur}
      onKeyDown={keyboardActivation.onKeyDown}
      onKeyUp={keyboardActivation.onKeyUp}
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
      {canUseAsChild ? <Slottable>{renderedChildren}</Slottable> : renderedChildren}
    </Component>
  );
});

TabTriggerImpl.displayName = 'TabTrigger';

/** Selects its associated Tabs panel and exposes the selected state with tab semantics. */

export const TabTrigger = TabTriggerImpl as TabTriggerComponent;
