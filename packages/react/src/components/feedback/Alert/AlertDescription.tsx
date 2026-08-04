'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { AlertDescriptionProps } from '@/components/feedback/Alert/Alert.types';
import { useAlertContext } from '@/components/feedback/Alert/AlertContext';

/** Body content slot for an `Alert` root. */
export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>((props, ref) => {
  const { className, ...rest } = props;
  const context = useAlertContext();

  return <div ref={ref} className={cx(context.classes.description, className)} {...rest} />;
});

AlertDescription.displayName = 'AlertDescription';
