'use client';

import { cx } from '@/styled-system/css';
import { backdrop } from '@/styled-system/recipes';
import { FloatingOverlay, useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, isValidElement, type ReactNode, useRef } from 'react';
import type { BackdropComponent, BackdropProps } from './Backdrop.types';
import { useDocumentScrollLock } from './useDocumentScrollLock';

const backdropAsChildElementNames = new Set(['article', 'aside', 'div', 'section']);

const isSafeBackdropAsChildHost = (children: ReactNode) =>
  isValidElement(children) &&
  typeof children.type === 'string' &&
  backdropAsChildElementNames.has(children.type);


const BackdropImpl = forwardRef<HTMLElement, BackdropProps>((props, ref) => {
  const { lockScroll = true, children, className, asChild, ...rest } = props;
  const canUseAsChild = asChild && !lockScroll && isSafeBackdropAsChildHost(children);
  const Component = canUseAsChild ? Slot : FloatingOverlay;
  const overlayRef = useRef<HTMLElement | null>(null);
  const mergedRef = useMergeRefs([ref, overlayRef]);
  useDocumentScrollLock(overlayRef, lockScroll);

  return (
    <Component
      ref={mergedRef}
      {...(canUseAsChild ? {} : { lockScroll: false })}
      className={cx(backdrop(), className)}
      {...rest}
    >
      {children}
    </Component>
  );
});

BackdropImpl.displayName = 'Backdrop';

/** Provides the visual and pointer-interaction layer behind a modal or other blocking overlay. */

export const Backdrop = BackdropImpl as BackdropComponent;
