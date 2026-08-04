'use client';

import { OverlayTransition } from '@/components/animations/OverlayTransition/OverlayTransition';
import { useOptionalBrand } from '@/providers/BrandProvider';
import { useOptionalColorMode } from '@/providers/ColorModeProvider';
import type { PortalTargetProps } from '@/providers/PortalProvider.types';
import { cx } from '@/styled-system/css';
import { FloatingFocusManager, ReferenceType, useMergeRefs } from '@floating-ui/react';
import {
  forwardRef,
  isValidElement,
  type KeyboardEventHandler,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
} from 'react';
import { Backdrop } from '../../Backdrop/Backdrop';
import { FloatingPortalScope } from '../../Portal/FloatingPortalScope';
import { handleCancellableEscapeKeyDown } from '../handleCancellableEscapeKeyDown';
import type { OverlayContentComponent, OverlayContext, OverlaySubComponentProps } from './types';
import { resolveOverlayAria } from './resolveOverlayAria';
import { getCommonMessages, type CommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { useOverlayPartOwner } from '../useOverlayPartOwnership';

const overlayContentAsChildElementNames = new Set(['article', 'aside', 'div', 'section']);

const isSafeOverlayContentAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  overlayContentAsChildElementNames.has(children.type);

/**
 * Creates the modal overlay content part for a supplied state context.
 *
 * Only the first rendered content part owns the floating ref; later duplicates render nothing.
 * The owner portals into the resolved container, locks document scroll while open, manages focus,
 * applies dialog ARIA (including registered title/description IDs), and uses the given fallback
 * label when no explicit label is available. `asChild` is limited to safe structural hosts so the
 * focus-managed dialog cannot be delegated to interactive or opaque components.
 */
export const createOverlayContent = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
  options: { fallbackLabelKey: keyof Pick<CommonMessages, 'alertDialog' | 'dialog' | 'drawer'> },
) => {
  const Component = forwardRef<HTMLElement, OverlaySubComponentProps<'div', PortalTargetProps>>(
    (props, ref) => {
      const overlayContext = useContext();
      const {
        children,
        className,
        asChild,
        'aria-label': ariaLabel,
        'aria-describedby': ariaDescribedBy,
        'aria-labelledby': ariaLabelledBy,
        id: _id,
        portalContainer,
        onKeyDown: consumerKeyDown,
        ...rest
      } = props;
      const {
        context,
        getFloatingProps,
        refs,
        registeredTitleId,
        registeredDescriptionId,
        classes: rawClasses,
        open,
        brand: propBrand,
        theme: propTheme,
        animationType = 'modal',
        role = 'dialog',
        initialFocus,
      } = overlayContext;
      const ownership = useOverlayPartOwner(overlayContext, 'content');

      const currentBrand = useOptionalBrand()?.brand;
      const globalTheme = useOptionalColorMode()?.resolvedColorMode;
      const messages = getCommonMessages(useOptionalLocale()?.locale);
      const classes = rawClasses as Record<'overlay' | 'content', string>;
      const warnedMissingTitleRef = useRef(false);

      const hostRef = useRef<HTMLElement | null>(null);
      const setOwnedFloating = useCallback(
        (node: HTMLElement | null) => {
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
      const { onKeyDown: floatingKeyDown, ...floatingProps } = getFloatingProps(rest);
      const canUseAsChild = asChild && isSafeOverlayContentAsChildHost(children);
      const aria = resolveOverlayAria({
        ariaDescribedBy,
        ariaLabel,
        ariaLabelledBy,
        autoDescribedBy: registeredDescriptionId,
        autoLabelledBy: registeredTitleId,
        fallbackLabel: messages[options.fallbackLabelKey],
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
            `[${displayName}] Add the matching Title component or provide aria-label/aria-labelledby.`,
          );
        });
        return () => {
          active = false;
        };
      }, [ariaLabel, ariaLabelledBy, open, refs.floating]);

      if (!ownership.isOwner) return null;

      return (
        <FloatingPortalScope
          allowUnanchoredFallback
          portalContainer={portalContainer}
          referenceRef={refs.reference}
          viewportOwnerName={displayName}
        >
          {/* Outer: keepMounted fade. DOM is preserved so the inner AnimatePresence receives
            the exit signal. Duration 0.6s > any content animation (~0.3–0.5s) ensures
            the backdrop stays visible until content exit completes. */}
          <OverlayTransition
            isVisible={open}
            animationType="fade"
            keepMounted
            customData={{ duration: 0.6 }}
          >
            <Backdrop className={classes.overlay} lockScroll={open}>
              <FloatingFocusManager context={context} disabled={!open} initialFocus={initialFocus}>
                <OverlayTransition
                  isVisible={open}
                  animationType={animationType}
                  asChild={canUseAsChild}
                  ref={mergedRef}
                  {...floatingProps}
                  role={role}
                  aria-modal="true"
                  aria-label={aria.ariaLabel}
                  aria-labelledby={aria.ariaLabelledBy}
                  aria-describedby={aria.ariaDescribedBy}
                  className={cx(classes.content, className)}
                  data-brand={propBrand ?? currentBrand ?? 'blue'}
                  data-theme={propTheme ?? globalTheme ?? 'light'}
                  data-state={open ? 'open' : 'closed'}
                  onKeyDown={(event) =>
                    handleCancellableEscapeKeyDown(event as React.KeyboardEvent<HTMLElement>, {
                      onKeyDown: consumerKeyDown as KeyboardEventHandler<HTMLElement> | undefined,
                      onFloatingKeyDown: floatingKeyDown as KeyboardEventHandler<HTMLElement>,
                    })
                  }
                >
                  {children}
                </OverlayTransition>
              </FloatingFocusManager>
            </Backdrop>
          </OverlayTransition>
        </FloatingPortalScope>
      );
    },
  );

  Component.displayName = displayName;
  return Component as unknown as OverlayContentComponent;
};
