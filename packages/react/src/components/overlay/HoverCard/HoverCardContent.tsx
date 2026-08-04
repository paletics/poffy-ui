'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { cx } from '@/styled-system/css';
import { FloatingArrow, FloatingFocusManager, useMergeRefs } from '@floating-ui/react';
import {
  forwardRef,
  type KeyboardEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { resolveOverlayAria } from '../shared/factories/resolveOverlayAria';
import { useHoverCardContext } from './HoverCardContext';
import type { HoverCardContentProps } from './HoverCard.types';
import { FloatingPortalScope } from '../Portal/FloatingPortalScope';
import { handleCancellableEscapeKeyDown } from '../shared/handleCancellableEscapeKeyDown';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { useOverlayPartOwner } from '../shared/useOverlayPartOwnership';

/**
 * Positions the non-modal dialog panel for its owning HoverCard.
 *
 * It portals one owning content surface, connects title/description ARIA
 * parts, and warns when no accessible title or label exists. Focus management
 * is deliberately off by default so focus stays on the trigger; enable it only
 * when the panel contains richer interactive content. Escape remains
 * cancellable through the supplied key handler.
 */


export const HoverCardContent = forwardRef<HTMLDivElement, HoverCardContentProps>(
  (
    {
      children,
      className,
      focusManagement = false,
      'aria-label': ariaLabel,
      'aria-describedby': ariaDescribedBy,
      'aria-labelledby': ariaLabelledBy,
      portalContainer,
      onKeyDown: consumerKeyDown,
      style: userStyle,
      ...props
    },
    ref,
  ) => {
    const hoverCardContext = useHoverCardContext();
    const {
      classes,
      contentId,
      context,
      registeredDescriptionId,
      floatingStyles,
      getFloatingProps,
      open,
      refs,
      setArrowElement,
      showArrow,
      registeredTitleId,
      brand,
      theme,
    } = hoverCardContext;
    const ownership = useOverlayPartOwner(hoverCardContext, 'content');
    const hostRef = useRef<HTMLDivElement | null>(null);
    const setOwnedFloating = useCallback(
      (node: HTMLDivElement | null) => {
        if (ownership.isOwner) refs.setFloating(node);
      },
      [ownership.isOwner, refs],
    );
    const mergedRef = useMergeRefs([hostRef, setOwnedFloating, ref]);
    useLayoutEffect(() => {
      if (!ownership.isOwner) return;
      refs.setFloating(hostRef.current);
      return () => refs.setFloating(null);
    }, [ownership.activeId, ownership.isOwner, refs]);
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const warnedMissingTitleRef = useRef(false);
    const { onKeyDown: floatingKeyDown, ...floatingProps } = getFloatingProps(props);
    const aria = resolveOverlayAria({
      ariaDescribedBy,
      ariaLabel,
      ariaLabelledBy,
      autoDescribedBy: registeredDescriptionId,
      autoLabelledBy: registeredTitleId,
      fallbackLabel: messages.hoverCard,
    });

    useEffect(() => {
      if (!open || warnedMissingTitleRef.current || ariaLabel?.trim() || ariaLabelledBy?.trim()) {
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
        console.warn(
          '[HoverCardContent] Add HoverCardTitle or provide aria-label/aria-labelledby.',
        );
      });
      return () => {
        active = false;
      };
    }, [ariaLabel, ariaLabelledBy, open, refs.floating]);

    const contentNode = (
      <OverlayTransition
        {...floatingProps}
        isVisible={open}
        animationType="popover"
        ref={mergedRef}
        id={contentId}
        style={{ ...userStyle, ...floatingStyles }}
        role="dialog"
        aria-label={aria.ariaLabel}
        aria-labelledby={aria.ariaLabelledBy}
        aria-describedby={aria.ariaDescribedBy}
        className={cx(classes.content, className)}
        data-brand={brand}
        data-theme={theme}
        data-state={open ? 'open' : 'closed'}
        onKeyDown={(event) =>
          handleCancellableEscapeKeyDown(event, {
            onKeyDown: consumerKeyDown,
            onFloatingKeyDown: floatingKeyDown as KeyboardEventHandler<HTMLDivElement>,
          })
        }
      >
        <>
          {showArrow && (
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
      </OverlayTransition>
    );

    if (!ownership.isOwner) return null;

    return (
      <FloatingPortalScope portalContainer={portalContainer} referenceRef={refs.reference}>
        {focusManagement ? (
          <FloatingFocusManager context={context} disabled={!open} modal={false} initialFocus={-1}>
            {contentNode}
          </FloatingFocusManager>
        ) : (
          contentNode
        )}
      </FloatingPortalScope>
    );
  },
);

HoverCardContent.displayName = 'HoverCardContent';
