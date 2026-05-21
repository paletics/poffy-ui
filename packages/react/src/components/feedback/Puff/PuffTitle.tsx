'use client';

import { cx } from '@/styled-system/css';
import { usePuffStyleContext } from './Puff';
import { PuffTitleProps } from './Puff.types';

/**
 * ### AI Context & Architecture
 * Component for displaying the title area of a puff.
 * It consumes the internal PuffContext to apply consistent styling via Panda CSS recipes.
 */
export const PuffTitle = ({ icon, title, action, className, ...props }: PuffTitleProps) => {
  const context = usePuffStyleContext();
  const classes = context?.classes;

  if (!icon && !title && !action) return null;

  return (
    <div {...props} className={cx(classes?.title, className)}>
      {icon}
      {title}
      {action && (
        <>
          <span className={classes?.spacer}></span>
          {action}
        </>
      )}
    </div>
  );
};
