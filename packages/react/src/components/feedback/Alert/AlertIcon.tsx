'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { AlertStatusIcon } from './AlertStatusIcon';
import { AlertIconProps } from './Alert.types';
import { useAlertContext } from './AlertContext';

/**
 * AlertIcon component displays a status-based icon for the alert.
 * It defaults to a status-based icon (Info, Success, Warning, Error) if no children are provided.
 */
export const AlertIcon = forwardRef<HTMLDivElement, AlertIconProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const context = useAlertContext();

  return (
    <div ref={ref} aria-hidden="true" className={cx(context.classes.icon, className)} {...rest}>
      {children ?? <AlertStatusIcon status={context.status} />}
    </div>
  );
});

AlertIcon.displayName = 'AlertIcon';
