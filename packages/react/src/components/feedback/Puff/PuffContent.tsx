'use client';

import { cx } from '@/styled-system/css';
import { usePuffStyleContext } from './Puff';
import { PuffContentProps } from './Puff.types';

/**
 * ### AI Context & Architecture
 * Component for displaying the content area of a puff.
 * It consumes the internal PuffContext to apply consistent styling via Panda CSS recipes.
 */
export const PuffContent = ({ children, className, ...props }: PuffContentProps) => {
  const context = usePuffStyleContext();
  const classes = context?.classes;

  return (
    <div {...props} className={cx(classes?.content, className)}>
      {children}
    </div>
  );
};
