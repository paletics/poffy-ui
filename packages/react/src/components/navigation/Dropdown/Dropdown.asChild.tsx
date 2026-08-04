import { isButtonAsChildHost } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { isValidElement, type ReactElement, type ReactNode } from 'react';

interface PassiveDropdownHostProps {
  children?: ReactNode;
  contentEditable?: unknown;
  onClick?: unknown;
  onKeyDown?: unknown;
  onPointerDown?: unknown;
  role?: unknown;
  tabIndex?: unknown;
}

const labelHostNames = new Set(['div', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span']);
const separatorHostNames = new Set(['div', 'hr']);
const interactiveRoleNames = new Set([
  'button',
  'checkbox',
  'combobox',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem',
]);

const isPassiveNativeHost = (
  child: ReactNode,
  allowedHostNames: ReadonlySet<string>,
): child is ReactElement<PassiveDropdownHostProps> => {
  if (!isValidElement<PassiveDropdownHostProps>(child) || typeof child.type !== 'string') {
    return false;
  }
  if (!allowedHostNames.has(child.type) || child.props.tabIndex !== undefined) return false;
  if (
    child.props.onClick !== undefined ||
    child.props.onKeyDown !== undefined ||
    child.props.onPointerDown !== undefined
  ) {
    return false;
  }
  if (
    child.props.contentEditable !== undefined &&
    child.props.contentEditable !== false &&
    child.props.contentEditable !== 'false'
  ) {
    return false;
  }

  const roles = typeof child.props.role === 'string' ? child.props.role.trim().split(/\s+/) : [];
  return !roles.some((role) => interactiveRoleNames.has(role));
};

export const isDropdownLabelAsChildHost = (
  child: ReactNode,
): child is ReactElement<PassiveDropdownHostProps> => isPassiveNativeHost(child, labelHostNames);

export const isDropdownSeparatorAsChildHost = (
  child: ReactNode,
): child is ReactElement<PassiveDropdownHostProps> =>
  isPassiveNativeHost(child, separatorHostNames);

/**
 * Menu items support button-compatible hosts plus the native list item used by
 * semantic `ul`/`ol` menu structures.
 */
export const isDropdownItemAsChildHost = (
  child: ReactNode,
): child is ReactElement<PassiveDropdownHostProps> =>
  isButtonAsChildHost(child) ||
  (isValidElement<PassiveDropdownHostProps>(child) && child.type === 'li');

/** Keeps fallback labels presentational without retaining interactive or opaque subtrees. */
export const getSafeDropdownLabelContent = (content: ReactNode): ReactNode =>
  getSafeInteractiveContent(content);
