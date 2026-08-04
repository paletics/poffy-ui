'use client';

import { LayoutTransition } from '@/components/animations/LayoutTransition';
import { resolveSafeLinkRel } from '@/components/shared/linkTarget';
import { cx } from '@/styled-system/css';
import { useButtonKeyboardActivation } from '@poffy-ui/behavior/activation';
import { forwardRef } from 'react';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { PaginationLinkProps } from './Pagination.types';
import { usePagination } from './PaginationContext';

/**
 * Renders a page, previous, or next control with current-page and disabled semantics. Use inside a
 * PaginationItem within PaginationRoot.
 */
export const PaginationLink = forwardRef<HTMLAnchorElement, PaginationLinkProps>((props, ref) => {
  const {
    className,
    isActive,
    disabled,
    onClick,
    onClickCapture,
    onBlur,
    onKeyDown,
    onKeyDownCapture,
    onKeyUp,
    onKeyUpCapture,
    tabIndex,
    children,
    href,
    target,
    rel,
    ...rest
  } = props;
  const { classes, indicatorId, indicatorAnimation } = usePagination();
  const hasLinkIntent = href !== undefined && href !== null;
  const safeRel = resolveSafeLinkRel(target, rel);
  const keyboardActivation = useButtonKeyboardActivation<HTMLAnchorElement>({
    enabled: !hasLinkIntent && !disabled,
    onBlur,
    onKeyDown,
    onKeyUp,
  });
  const preventDisabledClick = (event: {
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const preventDisabledKeyActivation = (event: {
    code?: string;
    key: string;
    preventDefault: () => void;
    stopPropagation: () => void;
  }) => {
    if (event.key === 'Enter' || event.key === ' ' || event.code === 'Space') {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  const handleDisabledClickCapture = (event: MouseEvent<HTMLAnchorElement>) => {
    onClickCapture?.(event);
    preventDisabledClick(event);
  };
  const handleDisabledKeyDownCapture = (event: KeyboardEvent<HTMLAnchorElement>) => {
    onKeyDownCapture?.(event);
    preventDisabledKeyActivation(event);
  };
  const handleDisabledKeyUpCapture = (event: KeyboardEvent<HTMLAnchorElement>) => {
    onKeyUpCapture?.(event);
    preventDisabledKeyActivation(event);
  };

  return (
    // `role` is intentional: href-less anchors implement state-button semantics while disabled
    // URL controls omit href but retain their original link intent.
    <a
      ref={ref}
      role={hasLinkIntent ? 'link' : 'button'}
      {...rest}
      href={disabled ? undefined : href}
      target={target}
      rel={safeRel}
      aria-current={isActive ? 'page' : undefined}
      data-current={isActive ? '' : undefined}
      aria-disabled={disabled ? true : undefined}
      data-disabled={disabled ? '' : undefined}
      tabIndex={disabled ? -1 : (tabIndex ?? 0)}
      onClick={disabled ? undefined : onClick}
      onBlur={keyboardActivation.onBlur}
      onKeyDown={keyboardActivation.onKeyDown}
      onClickCapture={disabled ? handleDisabledClickCapture : onClickCapture}
      onKeyDownCapture={disabled ? handleDisabledKeyDownCapture : onKeyDownCapture}
      onKeyUp={keyboardActivation.onKeyUp}
      onKeyUpCapture={disabled ? handleDisabledKeyUpCapture : onKeyUpCapture}
      className={cx(classes.link, className)}
    >
      {isActive && (
        <LayoutTransition
          aria-hidden="true"
          className={classes.activeIndicator}
          layoutId={indicatorId}
          animationType={indicatorAnimation}
          customData={indicatorAnimation === 'stable' ? { stiffness: 520, damping: 42 } : undefined}
        />
      )}
      <span className={classes.linkLabel} data-pagination-label>
        {children}
      </span>
    </a>
  );
});

PaginationLink.displayName = 'PaginationLink';
