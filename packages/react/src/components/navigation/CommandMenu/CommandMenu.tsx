'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { Backdrop } from '@/components/overlay/Backdrop';
import { FloatingTreeBoundary } from '@/components/overlay/shared/FloatingTreeBoundary';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import { cx } from '@/styled-system/css';
import { commandMenu } from '@/styled-system/recipes';
import { registerCommandMenuShortcut } from '@poffy-ui/behavior/command-menu';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  FloatingFocusManager,
  FloatingNode,
  useDismiss,
  useFloating,
  useFloatingNodeId,
  useInteractions,
} from '@floating-ui/react';
import { forwardRef, useCallback, useId, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { CommandMenuList } from './CommandMenuList';
import type { CommandMenuProps } from './CommandMenu.types';
import { useCommandMenu } from './useCommandMenu';
import { FloatingPortalScope } from '@/components/overlay/Portal/FloatingPortalScope';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import type { PortalOwnerDocument } from '@/components/overlay/Portal/Portal.types';

const resolveOwnerDocument = (source: PortalOwnerDocument | undefined) =>
  typeof source === 'function' ? source() : source;


const CommandMenuRoot = forwardRef<HTMLDivElement, CommandMenuProps>((props, ref) => {
  const {
    open: controlledOpen,
    defaultOpen = false,
    onOpenChange,
    query: controlledQuery,
    defaultQuery = '',
    onQueryChange,
    items,
    label: labelProp,
    placeholder: placeholderProp,
    emptyMessage: emptyMessageProp,
    locale,
    messages: messageOverrides,
    closeOnSelect = true,
    globalShortcut = false,
    globalShortcutPriority = 0,
    globalShortcutTarget,
    disabled = false,
    size,
    brand: propBrand,
    theme: propTheme,
    className,
    id: propId,
    portalContainer,
    ownerDocument,
    ...dialogProps
  } = props;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [inputRoot, setInputRoot] = useState<Document | ShadowRoot | null>(null);
  const setInputNode = useCallback((node: HTMLInputElement | null) => {
    inputRef.current = node;
    const root = node?.getRootNode();
    setInputRoot(
      root?.nodeType === 9 || root?.nodeType === 11 ? (root as Document | ShadowRoot) : null,
    );
  }, []);
  const providerLocale = useOptionalLocale()?.locale;
  const resolvedLocale = locale ?? providerLocale;
  const commonMessages = getCommonMessages(resolvedLocale);
  const label = labelProp ?? messageOverrides?.label ?? commonMessages.commandMenu;
  const placeholder =
    placeholderProp ?? messageOverrides?.placeholder ?? commonMessages.commandPlaceholder;
  const emptyMessage =
    emptyMessageProp ?? messageOverrides?.emptyMessage ?? commonMessages.noCommands;
  const resultsLabel = (messageOverrides?.resultsLabel ?? commonMessages.commandResults)(label);
  const currentBrand = useOptionalBrand()?.brand;
  const resolvedColorMode = useOptionalColorMode()?.resolvedColorMode;
  const dialogId = useId();
  const classes = useMemo(() => commandMenu({ size }), [size]);
  const commandMenuState = useCommandMenu({
    closeOnSelect,
    controlledOpen,
    controlledQuery,
    defaultOpen,
    defaultQuery,
    disabled,
    items,
    locale: resolvedLocale,
    onOpenChange,
    onQueryChange,
  });
  const {
    activeDescendant,
    filteredItems,
    handleInputChange,
    handleKeyDown,
    highlightedIndex,
    listId,
    open,
    optionIdPrefix,
    optionRefs,
    query,
    selectItem,
    registerOption,
    setHighlightedIndex,
    setOpen,
  } = commandMenuState;

  const nodeId = useFloatingNodeId();
  const { refs, context } = useFloating({
    open,
    onOpenChange: setOpen,
    nodeId,
  });
  const mergedFloatingRef = useMergeRefs(refs.setFloating, ref);
  const dismiss = useDismiss(context, { outsidePressEvent: 'mousedown', bubbles: false });
  const { getFloatingProps } = useInteractions([dismiss]);

  const shortcutTokenRef = useRef<object>({});
  const shortcutRegistrationRef = useRef({
    enabled: globalShortcut && !disabled,
    priority: globalShortcutPriority,
    requestOpen: () => setOpen(true),
  });
  useLayoutEffect(() => {
    shortcutRegistrationRef.current = {
      enabled: globalShortcut && !disabled,
      priority: globalShortcutPriority,
      requestOpen: () => setOpen(true),
    };
  }, [disabled, globalShortcut, globalShortcutPriority, setOpen]);
  const isShortcutTargetResolver = typeof globalShortcutTarget === 'function';
  const configuredShortcutTarget = isShortcutTargetResolver
    ? globalShortcutTarget()
    : globalShortcutTarget;
  // A resolver is commonly backed by a ref owned by a separately mounted scope. Avoid falling
  // back to document while that explicit target is not available yet.
  const shortcutTarget =
    isShortcutTargetResolver && configuredShortcutTarget === null
      ? null
      : (configuredShortcutTarget ??
        inputRoot ??
        (typeof document === 'undefined' ? null : document));
  useLayoutEffect(() => {
    if (!globalShortcut || !shortcutTarget) return;
    return registerCommandMenuShortcut(shortcutTarget, shortcutTokenRef.current, () => {
      return shortcutRegistrationRef.current;
    });
  }, [globalShortcut, shortcutTarget]);

  const floatingProps = getFloatingProps(dialogProps);
  const resolvedOwnerDocument = resolveOwnerDocument(ownerDocument);

  return (
    <FloatingNode id={nodeId}>
      <FloatingPortalScope portalContainer={portalContainer} ownerDocument={resolvedOwnerDocument}>
        <OverlayTransition
          isVisible={open}
          animationType="fade"
          keepMounted
          customData={{ duration: 0.3 }}
        >
          <Backdrop className={classes.overlay} data-command-menu-overlay lockScroll={open}>
            <FloatingFocusManager
              context={context}
              disabled={!open}
              initialFocus={inputRef}
              visuallyHiddenDismiss={commonMessages.close}
            >
              <OverlayTransition
                {...floatingProps}
                ref={mergedFloatingRef}
                id={propId ?? dialogId}
                isVisible={open}
                animationType="modal"
                role="dialog"
                aria-modal="true"
                aria-label={label}
                className={cx(classes.content, className)}
                data-brand={propBrand ?? currentBrand ?? 'blue'}
                data-theme={propTheme ?? resolvedColorMode ?? 'light'}
                data-state={open ? 'open' : 'closed'}
              >
                <input
                  ref={setInputNode}
                  role="combobox"
                  aria-label={label}
                  aria-expanded={open}
                  aria-controls={listId}
                  aria-autocomplete="list"
                  aria-activedescendant={activeDescendant}
                  value={query}
                  placeholder={placeholder}
                  className={classes.search}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                />
                <CommandMenuList
                  classes={classes}
                  emptyMessage={emptyMessage}
                  filteredItems={filteredItems}
                  highlightedIndex={highlightedIndex}
                  resultsLabel={resultsLabel}
                  listId={listId}
                  optionIdPrefix={optionIdPrefix}
                  optionRefs={optionRefs}
                  registerOption={registerOption}
                  selectItem={selectItem}
                  setHighlightedIndex={setHighlightedIndex}
                />
              </OverlayTransition>
            </FloatingFocusManager>
          </Backdrop>
        </OverlayTransition>
      </FloatingPortalScope>
    </FloatingNode>
  );
});

CommandMenuRoot.displayName = 'CommandMenuRoot';

/** Command palette root that also coordinates nested overlay dismissal. */
export const CommandMenu = forwardRef<HTMLDivElement, CommandMenuProps>((props, ref) => (
  <FloatingTreeBoundary>
    <CommandMenuRoot {...props} ref={ref} />
  </FloatingTreeBoundary>
));

CommandMenu.displayName = 'CommandMenu';
