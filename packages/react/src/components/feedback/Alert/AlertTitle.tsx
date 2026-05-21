'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { AlertTitleProps } from './Alert.types';
import { useAlertContext } from './AlertContext';

/**
 * AlertTitle component displays the title of an alert.
 * It should be used within the `Alert` component.
 */
export const AlertTitle = forwardRef<HTMLDivElement, AlertTitleProps>((props, ref) => {
  const { className, ...rest } = props;
  const context = useAlertContext();

  return <div ref={ref} className={cx(context.classes.title, className)} {...rest} />;
});

AlertTitle.displayName = 'AlertTitle';
