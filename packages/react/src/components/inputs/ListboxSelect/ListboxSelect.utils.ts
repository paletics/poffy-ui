import { Children, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { ListboxSelectProps } from './ListboxSelect.types';

/**
 * Normalized option metadata used for ListboxSelect text lookup and disabled checks.
 */
export interface ListboxSelectOptionRecord {
  disabled: boolean;
  id: string;
  label: string;
  value: string;
}

const isOptionElement = (
  child: unknown,
): child is ReactElement<{
  children?: ReactNode;
  disabled?: boolean;
  value?: string;
}> => isValidElement(child) && typeof child.type === 'string' && child.type === 'option';

const isOptgroupElement = (
  child: unknown,
): child is ReactElement<{ children?: ReactNode; disabled?: boolean }> =>
  isValidElement(child) && typeof child.type === 'string' && child.type === 'optgroup';

const getOptionLabel = (children: ReactNode): string =>
  Children.toArray(children)
    .map((child) => {
      if (typeof child === 'string' || typeof child === 'number') return String(child);
      if (isValidElement<{ children?: ReactNode }>(child))
        return getOptionLabel(child.props.children);
      return '';
    })
    .join('');

/**
 * Flattens native `<option>` and `<optgroup>` children into custom listbox records.
 */
export const flattenListboxSelectOptions = (
  children: ListboxSelectProps['children'],
  parentDisabled = false,
  path: string[] = [],
): ListboxSelectOptionRecord[] =>
  Children.toArray(children).flatMap((child, index) => {
    const optionPath = [...path, String(index)];
    if (isOptionElement(child)) {
      const label = getOptionLabel(child.props.children);
      return [
        {
          disabled: [parentDisabled, child.props.disabled].some(Boolean),
          id: optionPath.join('-'),
          label,
          value: String(child.props.value ?? label),
        },
      ];
    }
    if (isOptgroupElement(child)) {
      return flattenListboxSelectOptions(
        child.props.children,
        [parentDisabled, child.props.disabled].some(Boolean),
        optionPath,
      );
    }
    return [];
  });

/**
 * Resolves the initial ListboxSelect value from controlled props, default props, or options.
 */
export const getInitialListboxSelectValue = (
  props: ListboxSelectProps,
  options: ListboxSelectOptionRecord[],
) => {
  if (props.value !== undefined) return String(props.value);
  if (props.defaultValue !== undefined) return String(props.defaultValue);
  return options[0]?.value ?? '';
};

/**
 * Returns the index of the option matching the current ListboxSelect value.
 */
export const getListboxSelectSelectedIndex = (
  options: ListboxSelectOptionRecord[],
  value: string,
) => options.findIndex((option) => option.value === value);

/**
 * Builds the DOM id for a ListboxSelect option.
 */
export const getListboxSelectOptionId = (listId: string, option: ListboxSelectOptionRecord) =>
  `${listId}-option-${option.id}`;
