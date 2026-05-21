'use client';

import { OverlayTransition } from '@/components/animations';
import { cx } from '@/styled-system/css';
import { puff } from '@/styled-system/recipes';
import { createContext, forwardRef, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { PuffProps } from './Puff.types';
import { PuffContent } from './PuffContent';
import { PuffTitle } from './PuffTitle';

type PuffStyleContextValue = {
  classes: ReturnType<typeof puff>;
} | null;

const PuffStyleContext = createContext<PuffStyleContextValue>(null);

/**
 * Hook to access the current puff's internal styling context.
 * Used by PuffTitle and PuffContent to access generated class names.
 * Internal-only; not exported from index.ts.
 */
export const usePuffStyleContext = () => useContext(PuffStyleContext);

/**
 * ### AI Context & Architecture
 * Puff component for displaying brief messages or notifications (Toasts).
 *
 * It acts as a wrapper around `OverlayTransition` to provide entrance/exit animations.
 * It uses the 'puff' recipe from Panda CSS for styling.
 *
 * Usage:
 * This component is typically rendered automatically by `PuffContainer` when using `usePuff()`,
 * but can also be used standalone if needed.
 *
 * @example Standalone notification
 * ```tsx
 * import { Puff } from '@poffy-ui/react/feedback';
 *
 * <Puff intent="success" title="Saved">
 *   Changes are now live.
 * </Puff>
 * ```
 */
export const Puff = forwardRef<HTMLDivElement, PuffProps>(
  (
    {
      id,
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
      removePuff,
      animationType = 'puff',
      className,
      isSimple,
      isVisible = true,
      onExitComplete,
      asChild,
      render,
      ...props
    },
    ref,
  ) => {
    // Keep timer dependencies stable while still calling the latest callbacks.
    const onCloseRef = useRef(onClose);
    const removePuffRef = useRef(removePuff);
    useLayoutEffect(() => {
      onCloseRef.current = onClose;
      removePuffRef.current = removePuff;
    });

    useEffect(() => {
      if (!duration || duration <= 0) return;
      const timerId = setTimeout(() => {
        onCloseRef.current?.();
        if (id) removePuffRef.current?.(id);
      }, duration);
      return () => clearTimeout(timerId);
    }, [duration, id]);

    const classes = puff({ intent, appearance, point, size });

    const content = render ? (
      render({
        id,
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
        removePuff,
        animationType,
        isSimple,
        isVisible,
        onExitComplete,
      })
    ) : isSimple ? (
      <>
        {icon}
        {children}
        {action && (
          <>
            <span className={classes.spacer}></span>
            {action}
          </>
        )}
      </>
    ) : (
      <>
        <PuffTitle icon={icon} title={title} action={action} />
        <PuffContent>{children}</PuffContent>
      </>
    );

    return (
      <PuffStyleContext.Provider value={{ classes }}>
        <OverlayTransition
          asChild={asChild}
          ref={ref}
          isVisible={isVisible}
          animationType={animationType}
          layout
          className={cx(isSimple ? classes.simple : classes.root, className)}
          onAnimationComplete={(definition) => {
            if (definition === 'exit' && !isVisible && id) {
              onExitComplete?.(id);
            }
          }}
          {...props}
        >
          {content}
        </OverlayTransition>
      </PuffStyleContext.Provider>
    );
  },
);

Puff.displayName = 'Puff';
