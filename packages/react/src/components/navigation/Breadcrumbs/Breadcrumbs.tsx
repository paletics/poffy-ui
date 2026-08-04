'use client';

import { cx } from '@/styled-system/css';
import { breadcrumbs } from '@/styled-system/recipes';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';
import {
  forwardRef,
  Fragment,
  isValidElement,
  type ReactElement,
  useLayoutEffect,
  useMemo,
  useRef,
} from 'react';
import type { BreadcrumbsRootProps } from './Breadcrumbs.types';
import { BreadcrumbsContext } from './BreadcrumbsContext';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { getBreadcrumbNavigationLabel } from './Breadcrumbs.locales';

/**
 * Renders a labelled breadcrumb navigation landmark and ordered list. Separators are injected
 * between items unless `separator={null}` selects manual separator placement.
 *
 * When the list overflows, the root reveals the item marked `aria-current="page"` as content or
 * size changes, but stops repositioning after the user scrolls or uses horizontal navigation.
 * `asChild` is not supported because this component owns the navigation and list structure.
 */
export const BreadcrumbsRoot = forwardRef<HTMLElement, BreadcrumbsRootProps>((props, ref) => {
  const {
    children,
    separator = '/',
    className,
    size,
    variant,
    locale: localeProp,
    asChild: _unsupportedAsChild,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = props as BreadcrumbsRootProps & { asChild?: boolean };
  const providerLocale = useOptionalLocale()?.locale;
  const normalizedAriaLabelledBy = ariaLabelledBy?.trim() || undefined;
  const normalizedAriaLabel = ariaLabel?.trim() || undefined;
  const resolvedAriaLabel = normalizedAriaLabelledBy
    ? undefined
    : (normalizedAriaLabel ?? getBreadcrumbNavigationLabel(localeProp ?? providerLocale));
  const classes = useMemo(() => breadcrumbs({ size, variant }), [size, variant]);
  const contextValue = useMemo(() => ({ classes, separator }), [classes, separator]);
  const rootRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergeRefs(rootRef, ref);

  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const ownerWindow = root.ownerDocument.defaultView;
    if (!ownerWindow) return;
    const ownerView = ownerWindow;

    let frameId: number | undefined;
    let observedCurrent: HTMLElement | null = null;
    let preserveUserPosition = Math.abs(root.scrollLeft) > 1;
    const ResizeObserverConstructor = ownerView.ResizeObserver;
    const resizeObserver =
      typeof ResizeObserverConstructor === 'function'
        ? new ResizeObserverConstructor(() => scheduleReveal())
        : undefined;

    const observeCurrent = (current: HTMLElement | null) => {
      if (current === observedCurrent) return;
      if (observedCurrent) resizeObserver?.unobserve(observedCurrent);
      observedCurrent = current;
      if (observedCurrent) resizeObserver?.observe(observedCurrent);
    };

    const revealCurrent = () => {
      frameId = undefined;
      const current = root.querySelector<HTMLElement>('[aria-current="page"]');
      observeCurrent(current);
      if (!current || preserveUserPosition || root.scrollWidth <= root.clientWidth + 1) return;

      const rootRect = root.getBoundingClientRect();
      if (rootRect.bottom <= 0 || rootRect.top >= ownerView.innerHeight) return;

      const currentRect = current.getBoundingClientRect();
      const inlineDelta =
        currentRect.left < rootRect.left
          ? currentRect.left - rootRect.left
          : currentRect.right > rootRect.right
            ? currentRect.right - rootRect.right
            : 0;
      if (Math.abs(inlineDelta) <= 1) return;

      root.scrollBy?.({ left: inlineDelta, behavior: 'auto' });
    };

    function scheduleReveal() {
      if (frameId !== undefined) return;
      frameId = ownerView.requestAnimationFrame(revealCurrent);
    }

    const preservePosition = () => {
      preserveUserPosition = true;
    };
    const preserveKeyboardPosition = (event: KeyboardEvent) => {
      if (
        ['ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(event.key)
      ) {
        preservePosition();
      }
    };
    root.addEventListener('pointerdown', preservePosition, { passive: true });
    root.addEventListener('touchstart', preservePosition, { passive: true });
    root.addEventListener('wheel', preservePosition, { passive: true });
    root.addEventListener('keydown', preserveKeyboardPosition);

    resizeObserver?.observe(root);
    const list = root.querySelector<HTMLElement>('ol');
    if (list) resizeObserver?.observe(list);

    const MutationObserverConstructor = ownerView.MutationObserver;
    const mutationObserver =
      typeof MutationObserverConstructor === 'function'
        ? new MutationObserverConstructor(() => scheduleReveal())
        : undefined;
    mutationObserver?.observe(root, {
      attributes: true,
      attributeFilter: ['aria-current'],
      childList: true,
      subtree: true,
    });

    // Run synchronously for the initial paint. Later DOM and size changes are
    // coalesced through the owning Window's animation frame.
    revealCurrent();

    return () => {
      if (frameId !== undefined) ownerView.cancelAnimationFrame(frameId);
      mutationObserver?.disconnect();
      resizeObserver?.disconnect();
      root.removeEventListener('pointerdown', preservePosition);
      root.removeEventListener('touchstart', preservePosition);
      root.removeEventListener('wheel', preservePosition);
      root.removeEventListener('keydown', preserveKeyboardPosition);
    };
  }, []);

  const validChildren = flattenFragmentChildren(children).filter((child): child is ReactElement =>
    isValidElement(child),
  );
  const hasVisibleSeparator =
    separator !== null && separator !== false && separator !== true && separator !== '';
  const safeSeparator = getSafeInteractiveContent(separator, { preserveOpaque: true });

  return (
    <BreadcrumbsContext.Provider value={contextValue}>
      <nav
        ref={mergedRef}
        aria-labelledby={normalizedAriaLabelledBy}
        aria-label={resolvedAriaLabel}
        className={cx(classes.root, className)}
        {...rest}
      >
        <ol className={classes.list}>
          {validChildren.map((child, index) => {
            const isLast = index === validChildren.length - 1;
            const item =
              typeof child.type === 'string' && child.type !== 'li' ? (
                <li className={classes.item}>{child}</li>
              ) : (
                child
              );
            return (
              <Fragment key={child.key ?? index}>
                {item}
                {!isLast && hasVisibleSeparator && (
                  <li aria-hidden="true" className={classes.separator}>
                    {safeSeparator}
                  </li>
                )}
              </Fragment>
            );
          })}
        </ol>
      </nav>
    </BreadcrumbsContext.Provider>
  );
});

BreadcrumbsRoot.displayName = 'Breadcrumbs.Root';

/**
 * Public Breadcrumbs root alias.
 */
export const Breadcrumbs = BreadcrumbsRoot;
