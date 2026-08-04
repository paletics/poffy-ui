'use client';

import { cx } from '@/styled-system/css';
import { forwardRef } from 'react';
import { AlertStatusIcon } from '@/components/feedback/Alert/AlertStatusIcon';
import { AlertIconProps } from '@/components/feedback/Alert/Alert.types';
import { useAlertContext } from '@/components/feedback/Alert/AlertContext';

/**
 * Decorative status icon for an `Alert` root.
 *
 * It selects an icon from the root status unless children override it. The wrapper is always
 * hidden and inert, so status meaning must remain available through alert text.
 */
export const AlertIcon = forwardRef<HTMLDivElement, AlertIconProps>((props, ref) => {
  const { className, children, ...rest } = props;
  const context = useAlertContext();

  return (
    <div
      ref={ref}
      className={cx(context.classes.icon, className)}
      {...rest}
      data-alert-icon=""
      aria-hidden="true"
      inert={true}
    >
      {children ?? <AlertStatusIcon status={context.status} />}
    </div>
  );
});

AlertIcon.displayName = 'AlertIcon';
