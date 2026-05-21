import { ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from '@/components/media/Icon/icons';
import type { AlertBaseProps } from './Alert.types';

/**
 * Renders the status icon that matches the Alert status variant.
 */
export const AlertStatusIcon = ({ status }: { status: AlertBaseProps['status'] }) => {
  switch (status) {
    case 'info':
      return <InfoIcon />;
    case 'warning':
      return <WarningIcon />;
    case 'success':
      return <SuccessIcon />;
    case 'error':
      return <ErrorIcon />;
    default:
      return <InfoIcon />;
  }
};
