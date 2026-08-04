'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { CardHeaderProps } from './Card.types';
import { useCardContext } from './CardContext';

/** Groups a Card's heading, identity, or contextual actions. Use a semantic heading for its title. */
export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ children, className, ...rest }, ref) => {
    const { classes } = useCardContext();

    return (
      <div ref={ref} className={cx(classes.header, className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardHeader.displayName = 'CardHeader';
