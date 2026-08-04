'use client';

import { useOverflowFocusability } from '@/components/shared/useOverflowFocusability';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import { useMergeRefs } from '@floating-ui/react';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import { useDrawerContext } from './DrawerContext';
import type { DrawerBodyProps } from './Drawer.types';

/** Main content body for the Drawer. */
export const DrawerBody = forwardRef<HTMLDivElement, DrawerBodyProps>(
  ({ asChild, children, className, tabIndex, ...rest }, ref) => {
    const { classes } = useDrawerContext();
    const [overflowRef, overflowTabIndex] = useOverflowFocusability<HTMLDivElement>({
      axis: 'vertical',
      explicitTabIndex: tabIndex,
    });
    const mergedRef = useMergeRefs([overflowRef, ref]);
    const canUseAsChild = Boolean(asChild && isNonVoidAsChildHost(children));
    const SectionElement = canUseAsChild ? Slot : 'div';

    return (
      <SectionElement
        ref={mergedRef}
        className={cx(classes.body, className)}
        tabIndex={overflowTabIndex}
        {...rest}
      >
        {children}
      </SectionElement>
    );
  },
);

DrawerBody.displayName = 'DrawerBody';
