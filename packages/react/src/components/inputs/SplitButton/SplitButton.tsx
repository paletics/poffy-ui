'use client';

import { useSplitButton } from '@poffy-ui/behavior/split-button';
import { focusAdjacentTabStop, getDeepActiveElement, useMergeRefs } from '@poffy-ui/behavior/hooks';
import type { ReferenceType } from '@floating-ui/react';
import { cx } from '@/styled-system/css';
import { splitButton } from '@/styled-system/recipes';
import { forwardRef, useEffect, useId, useRef } from 'react';
import { ButtonPrimitive } from '@/components/inputs/ButtonPrimitive';
import { DisclosureIconButton } from '@/components/inputs/DisclosureIconButton';
import { FloatingPortalScope } from '@/components/overlay/Portal/FloatingPortalScope';
import { useAnchorPosition } from '@/hooks/overlay/useFloating';
import type { SplitButtonProps } from './SplitButton.types';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getSplitButtonLabels } from './SplitButton.locales';

/**
 * Paired primary action and menu of related secondary actions.
 *
 * The primary segment invokes `onClick`; the disclosure segment opens the menu and supports
 * Arrow Down/Up to focus the first/last enabled item. If no enabled items exist, that segment is
 * disabled. The portalled menu manages roving focus, restores trigger focus after menu actions or
 * Escape, and moves Tab/Shift+Tab to the trigger's adjacent document tab stop rather than trapping
 * focus in the portal.
 */
export const SplitButton = forwardRef<HTMLDivElement, SplitButtonProps>(
  (
    {
      children,
      items,
      onClick,
      icon,
      size = 'md',
      intent = 'primary',
      appearance = 'solid',
      shape = 'rounded',
      className,
      disabled = false,
      portalContainer,
      locale,
      labels,
      ...props
    },
    ref,
  ) => {
    const providerLocale = useOptionalLocale()?.locale;
    const resolvedLabels = getSplitButtonLabels(locale ?? providerLocale ?? 'en-US', labels);
    const firstEnabledIndex = items.findIndex((item) => !item.disabled);
    const lastEnabledIndex = items.reduce(
      (enabledIndex, item, index) => (item.disabled ? enabledIndex : index),
      -1,
    );
    const isMenuUnavailable = firstEnabledIndex < 0;
    const {
      closeMenu,
      focusedIndex,
      isOpen,
      menuRef,
      onMenuItemClick,
      onMenuKeyDown,
      rootRef,
      setFocusedIndex,
      toggleMenu,
    } = useSplitButton({
      disabled: disabled === true ? true : isMenuUnavailable,
      items,
    });
    const { refs, floatingStyles } = useAnchorPosition<ReferenceType>({
      open: isOpen,
      onOpenChange: (nextOpen) => {
        if (!nextOpen) closeMenu();
      },
      placement: 'bottom-start',
      offset: 4,
      strategy: 'fixed',
    });
    const mergedRef = useMergeRefs(rootRef, refs.setReference, ref);
    const mergedMenuRef = useMergeRefs(menuRef, refs.setFloating);
    const mainButtonRef = useRef<HTMLButtonElement | null>(null);
    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);
    const restoreFocusOnCloseRef = useRef(false);
    const previousIsOpenRef = useRef(isOpen);
    const menuId = useId();
    const triggerId = useId();

    useEffect(() => {
      if (!isOpen) return;
      if (focusedIndex >= 0 && !items[focusedIndex]?.disabled) {
        itemRefs.current[focusedIndex]?.focus();
        return;
      }
      if (firstEnabledIndex >= 0) {
        setFocusedIndex(firstEnabledIndex);
        return;
      }
      menuRef.current?.focus();
    }, [firstEnabledIndex, focusedIndex, isOpen, items, menuRef, setFocusedIndex]);

    useEffect(() => {
      const closedSinceLastCommit = previousIsOpenRef.current && !isOpen;
      previousIsOpenRef.current = isOpen;
      if (!closedSinceLastCommit) return;
      if (isMenuUnavailable) {
        restoreFocusOnCloseRef.current = false;
        mainButtonRef.current?.focus();
        return;
      }
      if (!restoreFocusOnCloseRef.current) return;
      restoreFocusOnCloseRef.current = false;
      const trigger = triggerRef.current;
      if (!trigger) return;
      const activeElement = getDeepActiveElement(trigger.ownerDocument);
      if (
        activeElement === trigger.ownerDocument.body ||
        activeElement === trigger ||
        (activeElement !== null && menuRef.current?.contains(activeElement))
      ) {
        trigger.focus();
      }
    }, [isMenuUnavailable, isOpen, menuRef]);

    const classes = splitButton({ size, intent, variant: appearance, shape, isOpen });
    const openMenuAt = (index: number) => {
      if (disabled || isMenuUnavailable || isOpen) return;
      toggleMenu();
      setFocusedIndex(index);
    };

    const handleTriggerClick = () => {
      if (isOpen) {
        toggleMenu();
        return;
      }
      openMenuAt(firstEnabledIndex);
    };

    return (
      <div ref={mergedRef} className={cx(classes.root, className)} {...props}>
        <ButtonPrimitive
          ref={mainButtonRef}
          className={classes.mainButton}
          onClick={onClick}
          disabled={disabled}
        >
          {icon && <span className={classes.icon}>{icon}</span>}
          {children}
        </ButtonPrimitive>

        <DisclosureIconButton
          ref={triggerRef}
          id={triggerId}
          className={classes.dropdownButton}
          size={size}
          intent={intent}
          appearance={appearance === 'soft' ? 'soft' : appearance}
          shape="square"
          open={isOpen}
          onClick={handleTriggerClick}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') {
              event.preventDefault();
              openMenuAt(firstEnabledIndex);
            } else if (event.key === 'ArrowUp') {
              event.preventDefault();
              openMenuAt(lastEnabledIndex);
            }
          }}
          disabled={disabled === true ? true : isMenuUnavailable}
          aria-haspopup="menu"
          aria-controls={isMenuUnavailable ? undefined : menuId}
          aria-label={resolvedLabels.moreOptions}
        />

        <FloatingPortalScope portalContainer={portalContainer} referenceRef={refs.reference}>
          {isOpen && (
            <ul
              ref={mergedMenuRef}
              id={menuId}
              className={classes.menu}
              style={floatingStyles}
              role="menu"
              aria-labelledby={triggerId}
              tabIndex={-1}
              onKeyDown={(event) => {
                if (event.key === 'Tab') {
                  // The menu is portalled, so its DOM position is unrelated to
                  // the trigger's tab order. Resolve the adjacent tab stop from
                  // the trigger rather than from the portalled menu item.
                  if (triggerRef.current) {
                    const moved = focusAdjacentTabStop({
                      origin: triggerRef.current,
                      reverse: event.shiftKey,
                      excludeRoot: menuRef.current,
                    });
                    if (moved) event.preventDefault();
                    else triggerRef.current.focus();
                  }
                  restoreFocusOnCloseRef.current = false;
                  closeMenu();
                  return;
                }
                if (
                  event.key === 'Escape' ||
                  ((event.key === 'Enter' || event.key === ' ') && focusedIndex >= 0)
                ) {
                  restoreFocusOnCloseRef.current = true;
                }
                onMenuKeyDown(event);
              }}
            >
              {items.map((item, index) => (
                <li key={item.id} role="none">
                  <ButtonPrimitive
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    className={classes.menuItem}
                    role="menuitem"
                    tabIndex={-1}
                    disabled={disabled === true ? true : item.disabled}
                    onClick={() => {
                      restoreFocusOnCloseRef.current = true;
                      onMenuItemClick(index);
                    }}
                    onFocus={() => setFocusedIndex(index)}
                    onMouseEnter={() => setFocusedIndex(index)}
                    data-highlighted={index === focusedIndex ? '' : undefined}
                  >
                    {item.icon && <span className={classes.icon}>{item.icon}</span>}
                    {item.label}
                  </ButtonPrimitive>
                </li>
              ))}
            </ul>
          )}
        </FloatingPortalScope>
      </div>
    );
  },
);

SplitButton.displayName = 'SplitButton';
