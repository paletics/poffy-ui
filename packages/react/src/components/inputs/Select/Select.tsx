import { ChevronDownIcon } from '@/components/media/Icon/icons';
import { cx } from '@/styled-system/css';
import { select } from '@/styled-system/recipes';
import { forwardRef } from 'react';
import { SelectProps } from './Select.types';

/**
 * Native select for form-safe single choice input.
 * Uses the platform picker while matching the shared input shell and variants.
 *
 * ### AI Context & Architecture
 * - **Tier**: Atoms
 * - **Stack**: native `<select>`, Panda CSS (`select` recipe), decorative chevron icon
 * - **Props**: `SelectProps`
 *
 * ### Design Tokens
 * - **spacing**: field height, padding, and icon offset come from the `select` recipe
 * - **color**: semantic field, disabled, placeholder, and error tokens only
 *
 * ### Variant Logic
 * - **appearance="outline"**: Default form field treatment.
 * - **appearance="soft"**: Lower emphasis field surface, mapped to the filled recipe variant.
 * - **appearance="neo"**: Raised field treatment for high-contrast UI.
 * - **error**: Sets invalid styling and `aria-invalid` on the native select.
 *
 * ### Accessibility
 * - **Role**: native select / combobox semantics from the browser.
 * - **Keyboard**: Browser-native select keyboard behavior.
 * - **Required**: Provide a visible `<label>`, `aria-label`, or `aria-labelledby`.
 *
 * ### AI Usage
 * - **DO**: Use for simple single-choice forms where native mobile pickers are preferred.
 * - **DON'T**: Use for searchable or custom-rendered options; choose `ListboxSelect` or `ComboBox`.
 *
 * @example Native select
 * ```tsx
 * import { Select } from '@poffy-ui/react/inputs';
 *
 * <Select name="status" aria-label="Status" defaultValue="active">
 *   <option value="active">Active</option>
 *   <option value="paused">Paused</option>
 * </Select>
 * ```
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  const {
    size,
    appearance = 'outline',
    variant,
    error = false,
    className,
    children,
    disabled,
    'aria-invalid': ariaInvalid,
    ...rest
  } = props;

  const resolvedVariant =
    variant ?? (appearance === 'soft' ? 'filled' : appearance === 'neo' ? 'neo' : 'outline');
  const classes = select({ size, variant: resolvedVariant, error });

  return (
    <div className={cx(classes.root, className)} data-disabled={disabled ? '' : undefined}>
      <select
        {...rest}
        ref={ref}
        className={classes.field}
        disabled={disabled}
        aria-invalid={error ? true : ariaInvalid}
      >
        {children}
      </select>
      <span className={classes.icon} data-disabled={disabled ? '' : undefined} aria-hidden="true">
        <ChevronDownIcon />
      </span>
    </div>
  );
});

Select.displayName = 'Select';
