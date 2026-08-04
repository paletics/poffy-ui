import { resolveAccessibleLabel } from '@/components/shared/resolveAccessibleLabel';

export interface ResolveOverlayAriaOptions {
  ariaDescribedBy?: string;
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autoDescribedBy?: string;
  autoLabelledBy?: string;
  fallbackLabel?: string;
}

/**
 * Resolves overlay labelling with explicit attributes taking precedence over
 * generated title and description IDs. Empty labels are treated as absent;
 * an explicitly empty aria-describedby remains an intentional override.
 */
export const resolveOverlayAria = ({
  ariaDescribedBy,
  ariaLabel,
  ariaLabelledBy,
  autoDescribedBy,
  autoLabelledBy,
  fallbackLabel,
}: ResolveOverlayAriaOptions) => {
  const label = resolveAccessibleLabel({
    ariaLabel,
    ariaLabelledBy,
    autoLabelledBy,
    fallbackLabel,
  });

  return {
    ...label,
    ariaDescribedBy: ariaDescribedBy ?? autoDescribedBy,
  };
};
