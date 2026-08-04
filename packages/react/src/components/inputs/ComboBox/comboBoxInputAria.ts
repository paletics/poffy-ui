import type { InputHTMLAttributes } from 'react';

const normalizeAriaText = (value: unknown) =>
  typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined;

const mergeAriaTokens = (...values: unknown[]) => {
  const tokens = values.flatMap((value) => normalizeAriaText(value)?.split(/\s+/) ?? []);
  const merged = [...new Set(tokens)].join(' ');
  return merged === '' ? undefined : merged;
};

interface ResolveComboBoxInputAriaOptions {
  childProps: InputHTMLAttributes<HTMLInputElement>;
  context: {
    ariaDescribedBy?: string;
    ariaErrorMessage?: string;
    ariaInvalid?: boolean | 'true' | 'false';
    ariaLabel?: string;
    ariaLabelledBy?: string;
    error?: boolean;
  };
  wrapperProps: InputHTMLAttributes<HTMLInputElement>;
}

/** Resolves wrapper, delegated-child, and root ARIA ownership in priority order. */
export const resolveComboBoxInputAria = ({
  childProps,
  context,
  wrapperProps,
}: ResolveComboBoxInputAriaOptions) => {
  const wrapperAriaLabel = normalizeAriaText(wrapperProps['aria-label']);
  const wrapperAriaLabelledBy = normalizeAriaText(wrapperProps['aria-labelledby']);
  const childAriaLabel = normalizeAriaText(childProps['aria-label']);
  const childAriaLabelledBy = normalizeAriaText(childProps['aria-labelledby']);
  const contextAriaLabel = normalizeAriaText(context.ariaLabel);
  const contextAriaLabelledBy = normalizeAriaText(context.ariaLabelledBy);
  const ariaLabelledBy =
    wrapperAriaLabelledBy ??
    (wrapperAriaLabel === undefined
      ? (childAriaLabelledBy ?? (childAriaLabel === undefined ? contextAriaLabelledBy : undefined))
      : undefined);

  return {
    ariaLabel:
      ariaLabelledBy === undefined
        ? (wrapperAriaLabel ?? childAriaLabel ?? contextAriaLabel)
        : undefined,
    ariaLabelledBy,
    ariaDescribedBy: mergeAriaTokens(
      context.ariaDescribedBy,
      childProps['aria-describedby'],
      wrapperProps['aria-describedby'],
    ),
    ariaErrorMessage:
      normalizeAriaText(wrapperProps['aria-errormessage']) ??
      normalizeAriaText(childProps['aria-errormessage']) ??
      normalizeAriaText(context.ariaErrorMessage),
    ariaInvalid: context.error
      ? true
      : (wrapperProps['aria-invalid'] ?? childProps['aria-invalid'] ?? context.ariaInvalid),
  };
};
