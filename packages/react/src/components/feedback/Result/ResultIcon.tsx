'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { useResultContext } from '@/components/feedback/Result/ResultContext';
import type { ResultIconProps } from '@/components/feedback/Result/Result.types';

/**
 * Icon slot for a `Result` root.
 *
 * It is decorative and inert by default. To expose a meaningful icon, explicitly set
 * `aria-hidden={false}` and supply `aria-label` or `aria-labelledby`; the slot then receives
 * `role="img"`.
 */
export const ResultIcon = forwardRef<HTMLDivElement, ResultIconProps>(
  (
    {
      className,
      children,
      role,
      'aria-hidden': ariaHidden,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    },
    ref,
  ) => {
    const { classes } = useResultContext();
    const hasName = [ariaLabel, ariaLabelledBy].some((value) => Boolean(value?.trim()));
    const isExplicitlyVisible = ariaHidden === false ? true : ariaHidden === 'false';
    const isMeaningful = isExplicitlyVisible && hasName;

    return (
      <div
        ref={ref}
        className={cx(classes.icon, className)}
        {...rest}
        role={isMeaningful ? 'img' : role}
        aria-hidden={isMeaningful ? false : true}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        inert={isMeaningful ? undefined : true}
      >
        {children}
      </div>
    );
  },
);

ResultIcon.displayName = 'ResultIcon';
