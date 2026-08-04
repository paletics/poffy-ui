export interface ResolveAccessibleLabelOptions {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  autoLabelledBy?: string;
  fallbackLabel?: string;
}

/** Resolves a single accessible name while preserving explicit-source precedence. */
export const resolveAccessibleLabel = ({
  ariaLabel,
  ariaLabelledBy,
  autoLabelledBy,
  fallbackLabel,
}: ResolveAccessibleLabelOptions) => {
  const explicitLabel = ariaLabel?.trim() || undefined;
  const explicitLabelledBy = ariaLabelledBy?.trim() || undefined;
  const labelledBy = explicitLabelledBy ?? (explicitLabel ? undefined : autoLabelledBy);

  return {
    ariaLabel: labelledBy ? undefined : (explicitLabel ?? fallbackLabel),
    ariaLabelledBy: labelledBy,
  };
};
