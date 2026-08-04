'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import type { CardBodyProps } from './Card.types';
import { useCardContext } from './CardContext';

/** Groups a Card's primary readable or interactive content with its body spacing. */
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  ({ children, className, ...rest }, ref) => {
    const { classes } = useCardContext();

    return (
      <div ref={ref} className={cx(classes.body, className)} {...rest}>
        {children}
      </div>
    );
  },
);

CardBody.displayName = 'CardBody';
