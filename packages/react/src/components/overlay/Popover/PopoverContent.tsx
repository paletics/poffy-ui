'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { cx } from '@/styled-system/css';
import { popover } from '@/styled-system/recipes';
import { FloatingArrow, FloatingFocusManager, useMergeRefs } from '@floating-ui/react';
import {
  forwardRef,
  isValidElement,
  type KeyboardEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
} from 'react';
import type { PopoverContentComponent, PopoverContentProps } from './Popover.types';
import { usePopoverContext } from './PopoverContext';
import { resolveOverlayAria } from '../shared/factories/resolveOverlayAria';
import { FloatingPortalScope } from '../Portal/FloatingPortalScope';
import { handleCancellableEscapeKeyDown } from '../shared/handleCancellableEscapeKeyDown';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getDeepActiveElement, getDOMTreeRoot } from '@poffy-ui/behavior/hooks';
import { useOverlayPartOwner } from '../shared/useOverlayPartOwnership';

const popoverContentAsChildElements = new Set(['article', 'div', 'section']);

const isSafePopoverContentAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  popoverContentAsChildElements.has(children.type);

const useIsomorphicLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;


const PopoverContentImpl = forwardRef<HTMLElement, PopoverContentProps>((props, ref) => {
  const popoverContext = usePopoverContext();
  const {
    className,
    children,
    asChild,
    surface = 'default',
    focusManagement = true,
    focusGuards = true,
    returnFocus = true,
    role: _role,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    'aria-labelledby': ariaLabelledBy,
    id: idProp,
    style: userStyle,
    portalContainer,
    onKeyDown: consumerKeyDown,
    ...rest
  } = props as PopoverContentProps & { role?: unknown };
  const {
    context,
    floatingStyles,
    getFloatingProps,
    open,
    refs,
    setArrowElement,
    classes: rawClasses,
    showArrow,
    popupRole,
    brand,
    theme,
    registeredTitleId,
    registeredDescriptionId,
    registerContentId,
  } = popoverContext;
  const ownership = useOverlayPartOwner(popoverContext, 'content');
  const classes = rawClasses as Record<'content' | 'arrow', string>;
  const contentClassName = popover({ surface }).content;
  const hostRef = useRef<HTMLElement | null>(null);
  const setOwnedFloating = useCallback(
    (node: HTMLElement | null) => {
      if (ownership.isOwner) refs.setFloating(node);
    },
    [ownership.isOwner, refs],
  );
  const mergedRef = useMergeRefs([hostRef, setOwnedFloating, ref]);
  useIsomorphicLayoutEffect(() => {
    if (!ownership.isOwner) return;
    refs.setFloating(hostRef.current);
    return () => refs.setFloating(null);
  }, [ownership.activeId, ownership.isOwner, refs]);
  const messages = getCommonMessages(useOptionalLocale()?.locale);
  const warnedMissingTitleRef = useRef(false);
  const wasOpenRef = useRef(false);
  const isSlotChild = asChild && isSafePopoverContentAsChildHost(children);
  const generatedContentId = useId();
  const childId =
    isSlotChild && isValidElement<{ id?: string }>(children) ? children.props.id : undefined;
  const contentId = idProp ?? childId ?? context.floatingId ?? generatedContentId;
  const { onKeyDown: floatingKeyDown, ...floatingProps } = getFloatingProps(rest);
  const aria = resolveOverlayAria({
    ariaDescribedBy,
    ariaLabel,
    ariaLabelledBy,
    autoDescribedBy: popupRole === 'dialog' ? registeredDescriptionId : undefined,
    autoLabelledBy: popupRole === 'dialog' ? registeredTitleId : undefined,
    fallbackLabel: popupRole === 'dialog' ? messages.popover : undefined,
  });

  useEffect(() => {
    if (
      !open ||
      popupRole !== 'dialog' ||
      warnedMissingTitleRef.current ||
      ariaLabel?.trim() ||
      ariaLabelledBy?.trim()
    ) {
      return;
    }
    let active = true;
    queueMicrotask(() => {
      if (!active || warnedMissingTitleRef.current) return;
      const node = refs.floating.current as HTMLElement | null;
      if (node?.getAttribute('aria-labelledby')) return;
      const nodeEnv = (globalThis as { process?: { env?: { NODE_ENV?: string } } }).process?.env
        ?.NODE_ENV;
      if (nodeEnv === 'production') return;
      warnedMissingTitleRef.current = true;
      console.warn('[PopoverContent] Add PopoverTitle or provide aria-label/aria-labelledby.');
    });
    return () => {
      active = false;
    };
  }, [ariaLabel, ariaLabelledBy, open, popupRole, refs.floating]);

  useEffect(() => {
    if (open) {
      wasOpenRef.current = true;
      return;
    }
    if (!wasOpenRef.current) return;
    wasOpenRef.current = false;
    if (focusManagement || !returnFocus) return;

    const floating = refs.floating.current as HTMLElement | null;
    const reference = refs.reference.current as HTMLElement | null;
    if (!floating || !reference) return;
    const activeElement = getDeepActiveElement(getDOMTreeRoot(floating));
    if (!floating.contains(activeElement)) return;
    queueMicrotask(() => reference.focus());
  }, [focusManagement, open, refs.floating, refs.reference, returnFocus]);

  useIsomorphicLayoutEffect(() => registerContentId(contentId), [contentId, registerContentId]);

  const contentNode = (
    <OverlayTransition
      isVisible={open}
      animationType="popover"
      asChild={isSlotChild}
      ref={mergedRef}
      // Floating UI computes runtime position styles for the controlled element.
      style={{ ...userStyle, ...floatingStyles }}
      aria-label={aria.ariaLabel}
      aria-labelledby={aria.ariaLabelledBy}
      aria-describedby={aria.ariaDescribedBy}
      className={cx(contentClassName, className)}
      data-brand={brand}
      data-theme={theme}
      data-surface={surface}
      data-state={open ? 'open' : 'closed'}
      {...floatingProps}
      onKeyDown={(event) =>
        handleCancellableEscapeKeyDown(event as React.KeyboardEvent<HTMLElement>, {
          onKeyDown: consumerKeyDown as KeyboardEventHandler<HTMLElement> | undefined,
          onFloatingKeyDown: floatingKeyDown as KeyboardEventHandler<HTMLElement>,
        })
      }
      id={contentId}
      role={popupRole}
    >
      {isSlotChild ? (
        children
      ) : (
        <>
          {surface === 'default' && showArrow && (
            <FloatingArrow
              ref={setArrowElement}
              context={context}
              className={classes.arrow}
              width={18}
              height={9}
              tipRadius={2}
              strokeWidth={1}
            />
          )}
          {children}
        </>
      )}
    </OverlayTransition>
  );

  if (!ownership.isOwner) return null;

  return (
    <FloatingPortalScope portalContainer={portalContainer} referenceRef={refs.reference}>
      <FloatingFocusManager
        context={context}
        disabled={[!focusManagement, !open].some(Boolean)}
        modal={false}
        guards={focusGuards}
        returnFocus={returnFocus}
      >
        {contentNode}
      </FloatingFocusManager>
    </FloatingPortalScope>
  );
});

PopoverContentImpl.displayName = 'PopoverContent';

/**
 * Positions and renders the owning Popover’s non-modal panel.
 *
 * The first mounted content owns the floating node; duplicate parts render
 * nothing. It portals the surface, manages Escape dismissal, title/description
 * ARIA relationships, and optional FloatingFocusManager guards. Dialog-role
 * content without a title or explicit label warns in development. `asChild`
 * accepts article, div, or section; `surface="none"` transfers visual framing
 * responsibility to that child.
 */

export const PopoverContent = PopoverContentImpl as unknown as PopoverContentComponent;
