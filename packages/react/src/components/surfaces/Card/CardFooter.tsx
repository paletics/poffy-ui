'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { CardFooterProps } from './Card.types';
import { useCardContext } from './CardContext';

/** Groups secondary information or follow-up actions at the bottom of a Card. */
export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  ({ children, className, ...rest }, ref) => {
    const { classes } = useCardContext();

    return (
      <div ref={ref} className={cx(classes.footer, className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardFooter.displayName = 'CardFooter';
