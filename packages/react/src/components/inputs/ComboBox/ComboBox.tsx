'use client';

import { forwardRef } from 'react';
import { ComboBoxProps } from './ComboBox.types';
import { ComboBoxRoot } from './ComboBoxRoot';
import { ComboBoxInput } from './ComboBoxInput';
import { ComboBoxList } from './ComboBoxList';
import { ComboBoxItem } from './ComboBoxItem';

const ComboBoxBase = forwardRef<HTMLInputElement, ComboBoxProps>((props, ref) => {
  const { label, placeholder, options = [], ...rest } = props;

  return (
    <ComboBoxRoot options={options} {...rest}>
      <ComboBoxInput ref={ref} label={label} placeholder={placeholder} />
      <ComboBoxList>
        {options.map((option) => (
          <ComboBoxItem
            key={option.value}
            value={option.value}
            label={option.label}
            disabled={option.disabled}
          />
        ))}
      </ComboBoxList>
    </ComboBoxRoot>
  );
});

ComboBoxBase.displayName = 'ComboBox';

/**
 * A convenience facade over the composable `ComboBox.*` sub-components.
 * Renders `ComboBoxRoot > ComboBoxInput > ComboBoxList > ComboBoxItem[]` from a flat `options` prop.
 * For advanced layouts, use the sub-components directly (`ComboBox.Root`, `ComboBox.Input`, etc.).
 *
 * ### AI Context & Architecture
 * - **Tier**: Molecules
 * - **Stack**: Panda CSS (via `ComboBoxRoot`), `ComboBoxInput`, `ComboBoxList`, `ComboBoxItem`
 * - **Sub-components re-exported**: `Root`, `Input`, `List`, `Item`
 *
 * ### Design Tokens
 * - All tokens delegated to sub-components (input: `silver.{sm|md|lg}` padding; list: `neutral.surface` bg)
 *
 * ### Variant Logic
 * - No standalone variants - controlled by sub-component recipes.
 *
 * ### Accessibility
 * - **Role**: `combobox` (on `ComboBoxInput`) + `listbox` (on `ComboBoxList`)
 * - **`aria-controls`** / **`aria-expanded`** managed by `ComboBoxRoot` context.
 * - **Keyboard**: Type to filter | Arrow Down/Up: navigate | Enter: select | Escape: close
 *
 * ### AI Usage
 * - **DO**: Use the shorthand form for common searchable selects.
 * - **DO**: Use subcomponents when custom option rendering or layout is required.
 *
 * @example Simple usage
 * ```tsx
 * <ComboBox
 *   label="Country"
 *   placeholder="Search..."
 *   options={[{ label: 'Japan', value: 'jp' }, { label: 'US', value: 'us' }]}
 * />
 * ```
 *
 * @example Composable (advanced)
 * ```tsx
 * <ComboBox.Root>
 *   <ComboBox.Input label="Framework" />
 *   <ComboBox.List>
 *     <ComboBox.Item value="react" label="React" />
 *   </ComboBox.List>
 * </ComboBox.Root>
 * ```
 */
export const ComboBox = Object.assign(ComboBoxBase, {
  Root: ComboBoxRoot,
  Input: ComboBoxInput,
  List: ComboBoxList,
  Item: ComboBoxItem,
});
