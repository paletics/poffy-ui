'use client';

import { puff } from '@/styled-system/recipes';
import { PuffDisplayContainerProps } from './Puff.types';

/**
 * ### AI Context & Architecture
 * Container component for displaying puff notifications and positioning them on the screen.
 * It uses the 'puff' recipe to determine the container styling based on the 'point' prop.
 */
export const PuffDisplayContainer = ({
  children,
  point = 'top-right',
}: PuffDisplayContainerProps) => {
  const classes = puff({ point });
  return <div className={classes.container}>{children}</div>;
};
