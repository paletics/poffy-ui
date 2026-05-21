import { ChevronRightIcon } from '@/components/media/Icon/icons';
import type { DirectionalButtonProps } from './DirectionalButton.types';

/**
 * Renders the decorative icon used by DirectionalButton variants.
 */
export const DirectionalIcon = ({
  className,
  icon,
}: {
  className: string;
  icon?: DirectionalButtonProps['icon'];
}) => (
  <span aria-hidden="true" className={className}>
    {icon ?? <ChevronRightIcon />}
  </span>
);
