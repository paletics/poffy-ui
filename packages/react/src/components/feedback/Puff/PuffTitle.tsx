'use client';

import { cx } from '@/styled-system/css';
import { usePuffStyleContext } from './Puff';
import { PuffTitleProps } from './Puff.types';

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
          <div aria-live="off">{action}</div>
        </>
      )}
    </div>
  );
};
