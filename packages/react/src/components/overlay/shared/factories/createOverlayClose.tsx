'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { ReferenceType } from '@floating-ui/react';
import { CrossIcon } from '@/components/media/Icon/icons';
import { OverlayDismissControl } from '../OverlayDismissControl';
import type { OverlayCloseComponent, OverlayContext, OverlaySubComponentProps } from './types';
import { getCommonMessages } from '@/components/shared/common.locales';
import { useOptionalLocale } from '@/providers/LocaleProvider';

const getCloseIconSize = (iconSize: number) => (iconSize <= 16 ? 'sm' : 'md');

/**
 * Creates an overlay close control wired to the supplied overlay context.
 *
 * The generated button calls `onOpenChange(false)`, preserves consumer dismiss behavior through
 * `OverlayDismissControl`, and supplies a localized accessible name and cross icon when omitted.
 * `iconSize` controls only that fallback icon.
 */
export const createOverlayClose = <T extends ReferenceType, TContext extends OverlayContext<T>>(
  useContext: () => TContext,
  displayName: string,
  iconSize = 24,
) => {
  const Component = forwardRef<HTMLElement, OverlaySubComponentProps<'button'>>((props, ref) => {
    const { className, 'aria-label': ariaLabel, ...rest } = props;
    const messages = getCommonMessages(useOptionalLocale()?.locale);
    const { classes: rawClasses, ...ctx } = useContext();
    const classes = rawClasses as Record<'close', string>;

    return (
      <OverlayDismissControl
        ref={ref}
        {...rest}
        className={cx(classes.close, className)}
        aria-label={ariaLabel?.trim() || messages.close}
        defaultContent={<CrossIcon size={getCloseIconSize(iconSize)} />}
        onDismiss={() => ctx.onOpenChange?.(false)}
      />
    );
  });

  Component.displayName = displayName;
  return Component as unknown as OverlayCloseComponent;
};
