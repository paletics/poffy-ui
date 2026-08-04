'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { AlertTitleProps } from '@/components/feedback/Alert/Alert.types';
import { useAlertContext } from '@/components/feedback/Alert/AlertContext';

/** Title content slot for an `Alert` root; choose a semantic heading inside it when needed. */
export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>((props, ref) => {
  const { className, ...rest } = props;
  const context = useAlertContext();

  return <div ref={ref} className={cx(context.classes.title, className)} {...rest} />;
});

AlertTitle.displayName = 'AlertTitle';
