'use client';

import { OverlayTransition } from '@/components/animations';
import { overlayVariants } from '@/components/animations/OverlayTransition/OverlayTransition.presets';
import { resolveLiveRegionProps } from '@/components/shared/resolveLiveRegionProps';
import { useOptionalAnimation } from '@/providers/AnimationProvider';
import { cx } from '@/styled-system/css';
import { puff } from '@/styled-system/recipes';
import { sanitizeControlledMotionProps } from '@/types/motion';
import {
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type FocusEventHandler,
  type MouseEventHandler,
} from 'react';
import { PuffProps } from './Puff.types';
import { PuffContent } from './PuffContent';
import { PuffTitle } from './PuffTitle';
import { useMergeRefs } from '@poffy-ui/behavior/hooks';

type PuffStyleContextValue = {
  classes: ReturnType<typeof puff>;
} | null;

const PuffStyleContext = createContext<PuffStyleContextValue>(null);
const puffAsChildElementNames = new Set(['div']);

interface ManagedPuffLifecycle {
  isVisible: boolean;
  onExitComplete: (puffId: string) => void;
  puffId: string;
  removePuff: (puffId: string) => void;
}

type PuffRuntimeProps = PuffProps & {
  managedLifecycle?: ManagedPuffLifecycle;
};

/**
 * Hook to access the current puff's internal styling context.
 * Used by PuffTitle and PuffContent to access generated class names.
 * Internal-only; not exported from index.ts.
 */
export const usePuffStyleContext = () => useContext(PuffStyleContext);

const PuffRuntime = forwardRef<HTMLDivElement, PuffRuntimeProps>(
  (
    {
      point = 'top-right',
      icon,
      title,
      children,
      intent = 'primary',
      appearance = 'solid',
      size = 'md',
      duration,
      action,
      onClose,
      animationType = 'puff',
      className,
      isSimple,
      asChild,
      render,
      live,
      announcement,
      role,
      'aria-live': ariaLive,
      managedLifecycle,
      ...props
    },
    ref,
  ) => {
    const { isAnimating } = useOptionalAnimation();
    const isProviderManaged = managedLifecycle !== undefined;
    const isVisible = managedLifecycle?.isVisible ?? true;
    const puffId = managedLifecycle?.puffId;
    const [isFocusWithin, setIsFocusWithin] = useState(false);
    const [isPointerWithin, setIsPointerWithin] = useState(false);
    const isInteracting = [isFocusWithin, isPointerWithin].some(Boolean);
    const resolvedAnimationType =
      typeof animationType === 'string' && Object.hasOwn(overlayVariants, animationType)
        ? animationType
        : 'puff';
    const resolvedDuration =
      typeof duration === 'number' && Number.isFinite(duration) && duration > 0
        ? duration
        : undefined;
    // Keep timer dependencies stable while still calling the latest callbacks.
    const onCloseRef = useRef(onClose);
    const removePuffRef = useRef(managedLifecycle?.removePuff);
    const completedExitIdRef = useRef<string | undefined>(undefined);
    const hasBeenVisibleRef = useRef(isVisible);
    const remainingDurationRef = useRef<number | undefined>(resolvedDuration);
    const timerStartedAtRef = useRef<number | undefined>(undefined);
    const rootRef = useRef<HTMLDivElement>(null);
    const mergedRef = useMergeRefs(rootRef, ref);
    useLayoutEffect(() => {
      onCloseRef.current = onClose;
      removePuffRef.current = managedLifecycle?.removePuff;
    });

    useEffect(() => {
      if (isVisible) remainingDurationRef.current = resolvedDuration;
      timerStartedAtRef.current = undefined;
    }, [puffId, isVisible, resolvedDuration]);

    useEffect(() => {
      if (!isVisible || !resolvedDuration || isInteracting) return;
      const remainingDuration = remainingDurationRef.current ?? resolvedDuration;
      if (remainingDuration <= 0) return;
      const ownerWindow = rootRef.current?.ownerDocument.defaultView;
      timerStartedAtRef.current = Date.now();
      const onTimer = () => {
        remainingDurationRef.current = 0;
        timerStartedAtRef.current = undefined;
        onCloseRef.current?.();
        if (puffId) removePuffRef.current?.(puffId);
      };
      const timerId = ownerWindow
        ? ownerWindow.setTimeout(onTimer, remainingDuration)
        : setTimeout(onTimer, remainingDuration);
      return () => {
        if (ownerWindow) ownerWindow.clearTimeout(timerId);
        else clearTimeout(timerId);
        if (timerStartedAtRef.current !== undefined) {
          remainingDurationRef.current = Math.max(
            0,
            (remainingDurationRef.current ?? resolvedDuration) -
              (Date.now() - timerStartedAtRef.current),
          );
          timerStartedAtRef.current = undefined;
        }
      };
    }, [puffId, isInteracting, isVisible, resolvedDuration]);

    const completeExit = useCallback(() => {
      if (!puffId || completedExitIdRef.current === puffId) return;

      completedExitIdRef.current = puffId;
      managedLifecycle?.onExitComplete(puffId);
    }, [managedLifecycle, puffId]);

    useEffect(() => {
      if (isVisible) {
        hasBeenVisibleRef.current = true;
        completedExitIdRef.current = undefined;
        return;
      }

      if (!hasBeenVisibleRef.current || !isAnimating) completeExit();
    }, [completeExit, isAnimating, isVisible]);

    const classes = puff({ intent, appearance, point, size });
    const { onAnimationComplete: userOnAnimationComplete, ...restProps } = props as typeof props & {
      onAnimationComplete?: (definition: string) => void;
    };
    const safeProps = sanitizeControlledMotionProps(restProps);
    const standaloneLiveRegion = resolveLiveRegionProps({
      live,
      defaultLive: 'polite',
      role,
      ariaLive,
    });
    const resolvedRole = isProviderManaged ? undefined : standaloneLiveRegion.role;
    const resolvedAriaLive = isProviderManaged ? undefined : standaloneLiveRegion.ariaLive;
    const {
      onBlur: userOnBlur,
      onFocus: userOnFocus,
      onMouseEnter: userOnMouseEnter,
      onMouseLeave: userOnMouseLeave,
      ...motionProps
    } = safeProps;
    const delegatedOnBlur = userOnBlur as FocusEventHandler<HTMLElement> | undefined;
    const delegatedOnFocus = userOnFocus as FocusEventHandler<HTMLElement> | undefined;
    const delegatedOnMouseEnter = userOnMouseEnter as MouseEventHandler<HTMLElement> | undefined;
    const delegatedOnMouseLeave = userOnMouseLeave as MouseEventHandler<HTMLElement> | undefined;

    const content = render ? (
      render({
        point,
        icon,
        title,
        children,
        intent,
        appearance,
        size,
        duration,
        action,
        onClose,
        animationType: resolvedAnimationType,
        isSimple,
        live,
        announcement,
      })
    ) : isSimple ? (
      <>
        {icon}
        {children}
        {action && (
          <>
            <span className={classes.spacer}></span>
            <div aria-live="off">{action}</div>
          </>
        )}
      </>
    ) : (
      <>
        <PuffTitle icon={icon} title={title} action={action} />
        <PuffContent>{children}</PuffContent>
      </>
    );

    const shouldUseAsChild =
      asChild &&
      isValidElement(content) &&
      typeof content.type === 'string' &&
      puffAsChildElementNames.has(content.type);
    const renderedContent =
      shouldUseAsChild && isValidElement<{ role?: string; 'aria-live'?: string }>(content)
        ? cloneElement(content, { role: resolvedRole, 'aria-live': resolvedAriaLive })
        : content;

    return (
      <PuffStyleContext.Provider value={{ classes }}>
        <OverlayTransition
          asChild={shouldUseAsChild}
          ref={mergedRef}
          isVisible={isVisible}
          animationType={resolvedAnimationType}
          layout
          className={cx(isSimple ? classes.simple : classes.root, className)}
          role={resolvedRole}
          aria-live={resolvedAriaLive}
          {...motionProps}
          onFocus={(event) => {
            setIsFocusWithin(true);
            delegatedOnFocus?.(event as React.FocusEvent<HTMLElement>);
          }}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsFocusWithin(false);
            delegatedOnBlur?.(event as React.FocusEvent<HTMLElement>);
          }}
          onMouseEnter={(event) => {
            setIsPointerWithin(true);
            delegatedOnMouseEnter?.(event as React.MouseEvent<HTMLElement>);
          }}
          onMouseLeave={(event) => {
            setIsPointerWithin(false);
            delegatedOnMouseLeave?.(event as React.MouseEvent<HTMLElement>);
          }}
          onAnimationComplete={(definition) => {
            if (definition === 'exit' && !isVisible) completeExit();
            userOnAnimationComplete?.(definition);
          }}
        >
          {renderedContent}
        </OverlayTransition>
      </PuffStyleContext.Provider>
    );
  },
);

PuffRuntime.displayName = 'PuffRuntime';

/**
 * Renders one transient notification outside the provider-managed queue.
 *
 * Standalone puffs announce according to `live` (polite by default) and pause an auto-close timer
 * while hovered or focused. Expiry calls `onClose` but does not unmount the component; the parent
 * owns that state. Use `PuffProvider` and `usePuff` when expiry or removal should animate and
 * unmount automatically. `asChild` works only when `render` returns one native `<div>`.
 */
export const Puff = forwardRef<HTMLDivElement, PuffProps>((publicProps, ref) => {
  const { managedLifecycle: _managedLifecycle, ...props } = publicProps as PuffProps & {
    managedLifecycle?: unknown;
  };
  return <PuffRuntime ref={ref} {...props} />;
});

Puff.displayName = 'Puff';

type ManagedPuffProps = PuffProps & ManagedPuffLifecycle;

/** Provider adapter kept private to the Puff feature barrel. */
export const ManagedPuff = forwardRef<HTMLDivElement, ManagedPuffProps>(
  ({ isVisible, onExitComplete, puffId, removePuff, ...props }, ref) => (
    <PuffRuntime
      ref={ref}
      {...props}
      managedLifecycle={{ isVisible, onExitComplete, puffId, removePuff }}
    />
  ),
);

ManagedPuff.displayName = 'ManagedPuff';
