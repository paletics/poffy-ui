'use client';

import { ActionMotion } from '@/components/animations/ActionMotion';
import { cx } from '@/styled-system/css';
import {
  createDisabledActivationHandlers,
  guardDisabledActivationHandlers,
  useButtonKeyboardActivation,
} from '@poffy-ui/behavior/activation';
import { getTreeElementById, useMergeRefs } from '@poffy-ui/behavior/hooks';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { FocusEvent, HTMLProps, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { useDropdownCollectionItem } from './DropdownCollection';
import type { DropdownItemProps } from './Dropdown.types';
import type { DropdownItemComponent } from './Dropdown.types';
import { useDropdownContext } from './DropdownContext';
import { isDropdownItemAsChildHost } from './Dropdown.asChild';
import { getSafeDropdownItemContent } from './getSafeDropdownItemContent';
import {
  hasAsChildLinkDestination,
  isButtonCompatibleAsChildHost,
} from '@/components/shared/asChild';
import { omitNativeButtonOnlyProps } from '@/components/shared/buttonDelegation';


const DropdownItemImpl = forwardRef<HTMLElement, DropdownItemProps>((rawProps, propRef) => {
  const {
    asChild,
    className,
    disabled = false,
    textValue,
    onSelect,
    closeOnSelect = true,
    onAuxClick,
    onAuxClickCapture,
    onClick,
    onClickCapture,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture,
    onBlur,
    onFocusCapture,
    onPointerDown,
    onPointerDownCapture,
    onPointerUp,
    onPointerUpCapture,
    children,
    'aria-disabled': ariaDisabled,
    id: _id,
    role: _role,
    tabIndex: _tabIndex,
    type: _type,
    ...props
  } = rawProps as DropdownItemProps & {
    'aria-disabled'?: boolean | 'true' | 'false';
    id?: unknown;
    role?: unknown;
    tabIndex?: unknown;
    type?: unknown;
  };
  const { getItemProps, activeIndex, onOpenChange, classes } = useDropdownContext();
  const isDisabled = [disabled, ariaDisabled === true, ariaDisabled === 'true'].some(Boolean);

  const itemId = useId();
  const [itemNode, setItemNode] = useState<HTMLElement | null>(null);
  const mergedRef = useMergeRefs(setItemNode, propRef);
  const index = useDropdownCollectionItem({
    id: itemId,
    node: itemNode,
    disabled: isDisabled,
    textValue,
  });

  const isActive = !isDisabled && activeIndex === index && index >= 0;
  const wasFocusedRef = useRef(false);

  useLayoutEffect(() => {
    if (isDisabled && wasFocusedRef.current) {
      const menu = itemNode?.closest<HTMLElement>('[role="menu"]');
      const nextEnabledItem = menu?.querySelector<HTMLElement>(
        '[role="menuitem"]:not([aria-disabled="true"]):not([disabled])',
      );
      if (nextEnabledItem) {
        nextEnabledItem.focus();
      } else {
        const triggerId = menu?.getAttribute('aria-labelledby');
        if (triggerId && itemNode) {
          getTreeElementById<HTMLElement>(itemNode, triggerId)?.focus();
        }
      }
    }
    if (isDisabled) wasFocusedRef.current = false;
  }, [isDisabled, itemNode]);

  const handleClick = (e: MouseEvent<HTMLElement>) => {
    if (isDisabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    onClick?.(e as unknown as MouseEvent<HTMLButtonElement>);
    if (e.defaultPrevented) return;
    onSelect?.();
    if (closeOnSelect) onOpenChange(false);
  };

  const asChildCandidate = asChild && isDropdownItemAsChildHost(children) ? children : null;
  const shouldFallbackDisabledCustomLink = Boolean(
    isDisabled &&
    asChildCandidate &&
    typeof asChildCandidate.type !== 'string' &&
    hasAsChildLinkDestination(asChildCandidate),
  );
  const asChildElement = shouldFallbackDisabledCustomLink ? null : asChildCandidate;
  const canUseAsChild = Boolean(asChildElement);
  const isButtonCompatibleHost = isButtonCompatibleAsChildHost(asChildElement);
  const keyboardActivation = useButtonKeyboardActivation<HTMLElement>({
    enabled: canUseAsChild && !isDisabled,
    onBlur: (event) => onBlur?.(event as unknown as FocusEvent<HTMLButtonElement>),
    onKeyDown: (event) => onKeyDown?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
    onKeyUp: (event) => onKeyUp?.(event as unknown as KeyboardEvent<HTMLButtonElement>),
  });
  const Component = canUseAsChild ? Slot : 'button';
  const hostProps = asChild ? omitNativeButtonOnlyProps(props) : props;
  const fallbackChildren = getSafeDropdownItemContent(children);
  const guardedChildren = guardDisabledActivationHandlers(
    canUseAsChild ? children : fallbackChildren,
    Boolean(canUseAsChild && isDisabled),
  );
  const activationHandlers = createDisabledActivationHandlers(
    Boolean(canUseAsChild && isDisabled),
    {
      onAuxClick,
      onAuxClickCapture,
      onClick: handleClick,
      onClickCapture,
      onKeyDown: keyboardActivation.onKeyDown,
      onKeyDownCapture,
      onKeyUp: keyboardActivation.onKeyUp,
      onKeyUpCapture,
      onPointerDown,
      onPointerDownCapture,
      onPointerUp,
      onPointerUpCapture,
    },
  );
  const renderedChildren =
    canUseAsChild &&
    isValidElement<Record<string, unknown> & { children?: ReactNode }>(guardedChildren)
      ? cloneElement(guardedChildren, {
          children: getSafeDropdownItemContent(guardedChildren.props.children),
          id: itemId,
          role: 'menuitem',
          tabIndex: isActive ? 0 : -1,
          'aria-disabled': isDisabled ? true : undefined,
          ...(asChildElement?.type === 'li' ? { contentEditable: undefined } : {}),
          ...(asChildElement?.type === 'a' && isDisabled ? { href: undefined } : {}),
          ...(isButtonCompatibleHost ? { disabled: isDisabled, type: 'button' } : {}),
        })
      : getSafeDropdownItemContent(guardedChildren);

  return (
    <ActionMotion asChild animationType="press" disabled={isDisabled}>
      <Component
        ref={mergedRef}
        className={cx(classes.item, className)}
        {...getItemProps({
          ...(hostProps as HTMLProps<HTMLElement>),
          ...activationHandlers,
        })}
        id={itemId}
        type={canUseAsChild ? undefined : 'button'}
        role="menuitem"
        disabled={canUseAsChild ? undefined : isDisabled}
        tabIndex={isActive ? 0 : -1}
        aria-disabled={isDisabled ? true : ariaDisabled}
        onFocusCapture={(event) => {
          wasFocusedRef.current = true;
          onFocusCapture?.(event as unknown as FocusEvent<HTMLButtonElement>);
        }}
        onBlur={(event) => {
          wasFocusedRef.current = false;
          keyboardActivation.onBlur(event);
        }}
      >
        {renderedChildren}
      </Component>
    </ActionMotion>
  );
});

DropdownItemImpl.displayName = 'Dropdown.Item';

/** Performs one selectable dropdown action and participates in the menu's keyboard navigation. */


export const DropdownItem = DropdownItemImpl as DropdownItemComponent;
