'use client';

import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { avatar } from '@/styled-system/recipes';
import {
  ElementType,
  Children,
  cloneElement,
  forwardRef,
  Fragment,
  isValidElement,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AvatarContextValue, type AvatarRootComponent, AvatarRootProps } from './Avatar.types';
import { AvatarContext } from './AvatarContext';
import { AvatarImage } from './AvatarImage';
import {
  getAvatarRootFallbackContent,
  isAvatarRootAsChildHost,
  isPotentiallyInteractiveAvatarRootHost,
} from './Avatar.utils';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const hasAvatarImage = (children: ReactNode): boolean =>
  Children.toArray(children).some((child) => {
    if (!isValidElement<{ children?: ReactNode; src?: string }>(child)) return false;
    if (child.type === AvatarImage && Boolean(child.props.src)) return true;
    const isTransparentWrapper = child.type === Fragment ? true : typeof child.type === 'string';
    return (
      isTransparentWrapper &&
      child.props.children !== undefined &&
      hasAvatarImage(child.props.children)
    );
  });

const AvatarRootImpl = forwardRef<HTMLElement, AvatarRootProps>((props, ref) => {
  const {
    asChild,
    children,
    className,
    size = 'md',
    shape = 'rounded',
    decorative = false,
    onStatusChange,
    'aria-hidden': ariaHidden,
    'data-status': _dataStatus,
    ...rest
  } = props as AvatarRootProps & {
    'aria-hidden'?: boolean | 'true' | 'false';
    'data-status'?: unknown;
  };
  const [imageStatuses, setImageStatuses] = useState<
    Record<string, 'loading' | 'loaded' | 'error'>
  >({});
  const onStatusChangeRef = useRef(onStatusChange);
  const previousStatusRef = useRef<'loading' | 'loaded' | 'error'>('loading');

  const classes = useMemo(() => avatar({ size, shape }), [size, shape]);
  const materializedChildren = materializeReactNodeTree(children);
  const asChildHost =
    asChild && isAvatarRootAsChildHost(materializedChildren) ? materializedChildren : null;
  const rejectedDecorativeHost = Boolean(
    decorative && asChildHost && isPotentiallyInteractiveAvatarRootHost(asChildHost),
  );
  const canUseAsChild = Boolean(asChildHost && !rejectedDecorativeHost);
  const contentChildren = asChildHost
    ? getAvatarRootFallbackContent(asChildHost)
    : materializedChildren;
  const hasImage = hasAvatarImage(contentChildren);
  const Component = (canUseAsChild ? Slot : 'span') as ElementType;

  const imageStatusValues = Object.values(imageStatuses);
  const hasLoadedImage = imageStatusValues.includes('loaded');
  const hasLoadingImage = imageStatusValues.includes('loading');
  const status: AvatarContextValue['status'] = hasLoadedImage
    ? 'loaded'
    : hasLoadingImage
      ? 'loading'
      : imageStatusValues.length
        ? 'error'
        : 'loading';

  useEffect(() => {
    onStatusChangeRef.current = onStatusChange;
  }, [onStatusChange]);

  useEffect(() => {
    if (previousStatusRef.current === status) return;
    previousStatusRef.current = status;
    onStatusChangeRef.current?.(status);
  }, [status]);

  const registerImage = useCallback((id: string) => {
    setImageStatuses((previous) =>
      previous[id] === 'loading' ? previous : { ...previous, [id]: 'loading' },
    );
  }, []);

  const unregisterImage = useCallback((id: string) => {
    setImageStatuses((previous) => {
      if (!(id in previous)) return previous;
      const { [id]: _removed, ...remaining } = previous;
      return remaining;
    });
  }, []);

  const setImageStatus = useCallback((id: string, next: 'loading' | 'loaded' | 'error') => {
    setImageStatuses((previous) => {
      if (!(id in previous) || previous[id] === next) return previous;
      return { ...previous, [id]: next };
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      size,
      shape,
      classes,
      status,
      hasLoadingImage,
      hasImage,
      decorative,
      registerImage,
      unregisterImage,
      setImageStatus,
    }),
    [
      size,
      shape,
      classes,
      status,
      hasLoadingImage,
      hasImage,
      decorative,
      registerImage,
      unregisterImage,
      setImageStatus,
    ],
  );
  const managedAriaHidden = decorative ? true : ariaHidden;
  const renderedChildren =
    canUseAsChild &&
    isValidElement<{ 'aria-hidden'?: boolean | 'true' | 'false'; 'data-status'?: string }>(
      asChildHost,
    )
      ? cloneElement(asChildHost, {
          'aria-hidden': managedAriaHidden,
          'data-status': status,
        })
      : rejectedDecorativeHost
        ? contentChildren
        : materializedChildren;

  return (
    <AvatarContext.Provider value={contextValue}>
      <Component
        ref={ref}
        className={cx(classes.root, className)}
        data-status={status}
        aria-hidden={managedAriaHidden}
        {...rest}
      >
        {renderedChildren}
      </Component>
    </AvatarContext.Provider>
  );
});

AvatarRootImpl.displayName = 'Avatar.Root';

/**
 * Contains `Avatar.Image` and `Avatar.Fallback` and coordinates their loading state.
 *
 * It renders a `span` by default, exposes the aggregate state as
 * `data-status`, and calls `onStatusChange` only when that state changes.
 * When several images are composed, one loaded image makes the root loaded;
 * otherwise it reports loading until all registered images fail. `decorative`
 * forces `aria-hidden`; `asChild` accepts only supported non-interactive hosts.
 */

export const AvatarRoot = AvatarRootImpl as AvatarRootComponent;
