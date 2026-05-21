'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { AlertDescriptionProps } from './Alert.types';
import { useAlertContext } from './AlertContext';

/**
 * AlertDescription component displays the main content/description of an alert.
 * It should be used within the `Alert` component.
 */
export const AlertDescription = forwardRef<HTMLDivElement, AlertDescriptionProps>((props, ref) => {
  const { className, ...rest } = props;
  const context = useAlertContext();

  return <div ref={ref} className={cx(context.classes.description, className)} {...rest} />;
});

AlertDescription.displayName = 'AlertDescription';
