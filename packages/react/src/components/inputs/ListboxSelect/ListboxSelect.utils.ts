import { cloneElement, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
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
  label?: string;
  value?: string;
}> => isValidElement(child) && typeof child.type === 'string' && child.type === 'option';

const isOptgroupElement = (
  child: unknown,
): child is ReactElement<{ children?: ReactNode; disabled?: boolean }> =>
  isValidElement(child) && typeof child.type === 'string' && child.type === 'optgroup';

export interface NormalizedListboxSelectChildren {
  nativeChildren: ReactNode[];
  options: ListboxSelectOptionRecord[];
}

const normalizeOptionLabelChildren = (
  children: ReactNode,
): { label: string; nativeChildren: ReactNode[] } => {
  let label = '';
  const nativeChildren = flattenFragmentChildren(children).map((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      label += String(child);
      return child;
    }
    if (!isValidElement<{ children?: ReactNode }>(child) || child.props.children === undefined) {
      return child;
    }

    const normalized = normalizeOptionLabelChildren(child.props.children);
    label += normalized.label;
    return cloneElement(child, { children: normalized.nativeChildren });
  });

  return { label, nativeChildren };
};

const normalizeListboxSelectLevel = (
  children: ReactNode,
  parentDisabled: boolean,
  path: string[],
): NormalizedListboxSelectChildren => {
  const options: ListboxSelectOptionRecord[] = [];
  const nativeChildren = flattenFragmentChildren(children).map((child, index) => {
    const optionPath = [...path, String(index)];
    if (isOptionElement(child)) {
      const normalizedLabel = normalizeOptionLabelChildren(child.props.children);
      options.push({
        disabled: [parentDisabled, child.props.disabled].some(Boolean),
        id: optionPath.join('-'),
        label: child.props.label ?? normalizedLabel.label,
        value: String(child.props.value ?? child.props.label ?? normalizedLabel.label),
      });
      return cloneElement(child, { children: normalizedLabel.nativeChildren });
    }
    if (isOptgroupElement(child)) {
      const normalizedGroup = normalizeListboxSelectLevel(
        child.props.children,
        [parentDisabled, child.props.disabled].some(Boolean),
        optionPath,
      );
      options.push(...normalizedGroup.options);
      return cloneElement(child, { children: normalizedGroup.nativeChildren });
    }
    return child;
  });

  return { nativeChildren, options };
};

/**
 * Materializes native select children once while deriving matching custom-listbox metadata.
 */
export const normalizeListboxSelectChildren = (
  children: ListboxSelectProps['children'],
): NormalizedListboxSelectChildren => normalizeListboxSelectLevel(children, false, []);

/**
 * Flattens native `<option>` and `<optgroup>` children into custom listbox records.
 */
export const flattenListboxSelectOptions = (
  children: ListboxSelectProps['children'],
  parentDisabled = false,
  path: string[] = [],
): ListboxSelectOptionRecord[] =>
  normalizeListboxSelectLevel(children, parentDisabled, path).options;

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
