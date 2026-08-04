import { cloneElement, Fragment, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import {
  isReactNodeIterable,
  materializeReactNodeIterable,
} from '@/components/shared/flattenFragmentChildren';

const voidElementNames = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

const nativeButtonSafeVoidElementNames = new Set(['br', 'img', 'wbr']);
const containerAsChildElementNames = new Set(['article', 'div', 'section']);

interface AsChildHostProps {
  children?: ReactNode;
}
interface AnchorFallbackProps extends AsChildHostProps {
  'aria-label'?: unknown;
  'aria-labelledby'?: unknown;
  alt?: unknown;
  contentEditable?: unknown;
  href?: unknown;
  placeholder?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  title?: unknown;
  value?: unknown;
}
interface ButtonHostProps extends AsChildHostProps {
  contentEditable?: unknown;
  href?: unknown;
  role?: unknown;
}
interface ButtonAsChildHostProps extends AsChildHostProps {
  contentEditable?: unknown;
  href?: unknown;
  onClick?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  to?: unknown;
}

const nativeInteractiveElementNames = new Set([
  'audio',
  'button',
  'details',
  'iframe',
  'label',
  'object',
  'select',
  'summary',
  'textarea',
  'video',
]);

const interactiveAriaRoles = new Set([
  'button',
  'checkbox',
  'combobox',
  'gridcell',
  'link',
  'menuitem',
  'menuitemcheckbox',
  'menuitemradio',
  'option',
  'radio',
  'scrollbar',
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem',
]);

const incompatibleButtonAsChildHostNames = new Set([
  'audio',
  'details',
  'iframe',
  'input',
  'label',
  'object',
  'select',
  'summary',
  'textarea',
  'video',
]);

const htmlButtonAsChildHostNames = new Set([
  'a',
  'abbr',
  'b',
  'bdi',
  'bdo',
  'button',
  'cite',
  'code',
  'data',
  'del',
  'dfn',
  'div',
  'em',
  'i',
  'ins',
  'kbd',
  'mark',
  'q',
  'rp',
  'rt',
  'ruby',
  's',
  'samp',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
  'var',
]);

const hasUnsafeButtonDescendant = (content: ReactNode): boolean => {
  if (Array.isArray(content)) return content.some(hasUnsafeButtonDescendant);
  if (isReactNodeIterable(content))
    return materializeReactNodeIterable(content).some(hasUnsafeButtonDescendant);
  if (!isValidElement<ButtonAsChildHostProps>(content)) return false;
  if (content.type === Fragment) return hasUnsafeButtonDescendant(content.props.children);
  if (typeof content.type !== 'string') return true;
  if (nativeInteractiveElementNames.has(content.type) || content.type === 'input') return true;
  if (content.type === 'a' && content.props.href !== undefined && content.props.href !== null)
    return true;
  if (content.props.tabIndex !== undefined || typeof content.props.onClick === 'function')
    return true;
  if (
    content.props.contentEditable !== undefined &&
    content.props.contentEditable !== false &&
    content.props.contentEditable !== 'false'
  ) {
    return true;
  }

  const roles =
    typeof content.props.role === 'string' ? content.props.role.trim().split(/\s+/) : [];
  if (roles.some((role) => role !== '' && role !== 'none' && role !== 'presentation')) return true;
  return hasUnsafeButtonDescendant(content.props.children);
};

const isVoidElement = (child: ReactElement) =>
  typeof child.type === 'string' && voidElementNames.has(child.type);

export const isNonVoidAsChildHost = (child: ReactNode): child is ReactElement<AsChildHostProps> =>
  isValidElement<AsChildHostProps>(child) && child.type !== Fragment && !isVoidElement(child);

/** Returns whether a host can receive passive reference props, including void elements. */
export const isReferenceAsChildHost = (child: ReactNode): child is ReactElement<AsChildHostProps> =>
  isValidElement<AsChildHostProps>(child) && child.type !== Fragment;

/** Returns whether a host is a custom component or one of the requested native elements. */
export const isAsChildHost = (
  child: ReactNode,
  nativeElementNames: ReadonlySet<string>,
): child is ReactElement<AsChildHostProps> =>
  isNonVoidAsChildHost(child) &&
  [typeof child.type !== 'string', nativeElementNames.has(child.type as string)].some(Boolean);

/**
 * Returns whether a delegated host may expose its own user interaction.
 *
 * Opaque components fail closed because their rendered host cannot be verified.
 * Any explicit tab stop, activation handler, editable state, native interactive
 * element, or interactive ARIA role is treated as interactive.
 */
export const isPotentiallyInteractiveAsChildHost = (child: ReactElement): boolean => {
  const props = child.props as {
    contentEditable?: unknown;
    onClick?: unknown;
    onKeyDown?: unknown;
    onKeyUp?: unknown;
    onPointerDown?: unknown;
    role?: unknown;
    tabIndex?: unknown;
  };
  if (typeof child.type !== 'string') return true;
  if (
    child.type === 'a' ||
    child.type === 'input' ||
    nativeInteractiveElementNames.has(child.type)
  ) {
    return true;
  }
  if (props.tabIndex !== undefined) return true;
  if (
    props.contentEditable !== undefined &&
    props.contentEditable !== false &&
    props.contentEditable !== 'false'
  ) {
    return true;
  }
  if (
    [props.onClick, props.onKeyDown, props.onKeyUp, props.onPointerDown].some(
      (handler) => typeof handler === 'function',
    )
  ) {
    return true;
  }

  const roles = typeof props.role === 'string' ? props.role.trim().split(/\s+/) : [];
  return roles.some((role) => interactiveAriaRoles.has(role));
};

/** Returns whether a host can safely receive native or emulated button behavior. */
export const isButtonAsChildHost = (
  child: ReactNode,
): child is ReactElement<ButtonAsChildHostProps> => {
  if (!isNonVoidAsChildHost(child)) return false;
  const host = child as ReactElement<ButtonAsChildHostProps>;
  if (typeof host.type !== 'string') return true;
  if (!htmlButtonAsChildHostNames.has(host.type)) return false;
  if (incompatibleButtonAsChildHostNames.has(host.type)) return false;
  if (
    host.props.contentEditable !== undefined &&
    host.props.contentEditable !== false &&
    host.props.contentEditable !== 'false'
  ) {
    return false;
  }

  const roles = typeof host.props.role === 'string' ? host.props.role.trim().split(/\s+/) : [];
  return !roles.some(
    (role) => role !== '' && role !== 'none' && role !== 'presentation' && role !== 'button',
  );
};

/** Returns whether an asChild host explicitly carries a navigation destination. */
export const hasAsChildLinkDestination = (child: ReactNode): boolean => {
  if (!isValidElement<ButtonAsChildHostProps>(child)) return false;
  return [child.props.href, child.props.to].some(
    (destination) => destination !== undefined && destination !== null,
  );
};

/** Returns whether a host can represent an action-only button without link semantics. */
export const isExclusiveButtonAsChildHost = (
  child: ReactNode,
): child is ReactElement<ButtonAsChildHostProps> => {
  if (!isButtonAsChildHost(child)) return false;
  return !hasAsChildLinkDestination(child);
};

/**
 * Returns whether a host can act exclusively as a disclosure button.
 *
 * Native anchors are accepted because trigger adapters can remove their `href`
 * deterministically. Opaque custom components remain supported under the
 * documented button-compatible prop/ref forwarding contract, but link-like
 * custom hosts cannot be converted safely before they render.
 */
export const isButtonTriggerAsChildHost = (
  child: ReactNode,
): child is ReactElement<ButtonAsChildHostProps> => {
  if (!isButtonAsChildHost(child)) return false;
  if (typeof child.type === 'string') {
    return (
      htmlButtonAsChildHostNames.has(child.type) && !hasUnsafeButtonDescendant(child.props.children)
    );
  }
  if (
    child.props.contentEditable !== undefined &&
    child.props.contentEditable !== false &&
    child.props.contentEditable !== 'false'
  ) {
    return false;
  }
  if (child.props.href !== undefined && child.props.href !== null) return false;
  if (child.props.to !== undefined && child.props.to !== null) return false;

  const roles = typeof child.props.role === 'string' ? child.props.role.trim().split(/\s+/) : [];
  return !roles.some((role) => role !== '' && role !== 'button');
};

/**
 * Returns whether a validated action host accepts native button ownership props.
 *
 * Opaque components opt into this contract by omitting link destinations and
 * forwarding `type`, `disabled`, DOM events, and the ref to their button host.
 */
export const isButtonCompatibleAsChildHost = (child: ReactNode): boolean =>
  isButtonTriggerAsChildHost(child)
    ? [child.type === 'button', typeof child.type !== 'string'].some(Boolean)
    : false;

/**
 * Returns whether a host can receive native text-input props.
 * Custom input components are permitted when they forward the input contract and ref.
 */
export const isInputAsChildHost = (child: ReactNode): child is ReactElement<AsChildHostProps> =>
  isValidElement<AsChildHostProps>(child) &&
  child.type !== Fragment &&
  [typeof child.type !== 'string', child.type === 'input'].some(Boolean);

/** Returns whether a host can safely contain compound-component descendants. */
export const isContainerAsChildHost = (
  child: ReactNode,
): child is ReactElement<AsChildHostProps> => {
  if (!isNonVoidAsChildHost(child)) return false;
  return [
    typeof child.type !== 'string',
    containerAsChildElementNames.has(child.type as string),
  ].some(Boolean);
};

const sanitizeNativeContainerFallbackContent = (content: ReactNode): ReactNode => {
  if (Array.isArray(content)) return content.map(sanitizeNativeContainerFallbackContent);
  if (isReactNodeIterable(content))
    return materializeReactNodeIterable(content).map(sanitizeNativeContainerFallbackContent);
  if (!isValidElement<AsChildHostProps>(content)) return content;
  if (content.type === Fragment)
    return sanitizeNativeContainerFallbackContent(content.props.children);
  if (typeof content.type !== 'string') return content;
  if (containerAsChildElementNames.has(content.type)) return content;
  return sanitizeNativeContainerFallbackContent(content.props.children);
};

/** Returns safe compound descendants after an incompatible container host is rejected. */
export const getFallbackChildrenForNativeContainer = (children: ReactNode): ReactNode =>
  sanitizeNativeContainerFallbackContent(children);

/** Returns whether a passive intrinsic host needs synthetic button semantics. */
export const shouldEmulateButtonHost = (child: ReactNode): boolean => {
  if (!isValidElement<ButtonHostProps>(child) || typeof child.type !== 'string') return false;
  if (isVoidElement(child) || nativeInteractiveElementNames.has(child.type)) return false;
  if (child.type === 'a' && child.props.href !== undefined && child.props.href !== null)
    return false;
  if (
    child.props.contentEditable !== undefined &&
    child.props.contentEditable !== false &&
    child.props.contentEditable !== 'false'
  ) {
    return false;
  }

  const roles = typeof child.props.role === 'string' ? child.props.role.trim().split(/\s+/) : [];
  return !roles.some((role) => role !== '' && role !== 'none' && role !== 'presentation');
};

export const getFallbackChildrenPreservingVoidHost = (children: ReactNode): ReactNode => {
  if (!isValidElement<AsChildHostProps>(children)) return children;
  return isVoidElement(children) ? children : children.props.children;
};

const sanitizeNativeButtonFallbackContent = (content: ReactNode): ReactNode => {
  if (Array.isArray(content)) {
    return content.map(sanitizeNativeButtonFallbackContent);
  }
  if (isReactNodeIterable(content)) {
    return materializeReactNodeIterable(content).map(sanitizeNativeButtonFallbackContent);
  }
  if (!isValidElement<AsChildHostProps>(content)) return content;
  if (content.type === Fragment) {
    return sanitizeNativeButtonFallbackContent(content.props.children);
  }
  if (typeof content.type !== 'string') {
    return sanitizeNativeButtonFallbackContent(content.props.children);
  }
  if (!isVoidElement(content)) {
    return sanitizeNativeButtonFallbackContent(content.props.children);
  }

  return nativeButtonSafeVoidElementNames.has(content.type) ? content : null;
};

/** Returns fallback content that can be placed directly inside a native button. */
export const getFallbackChildrenForNativeButton = (children: ReactNode): ReactNode => {
  if (!isValidElement<AsChildHostProps>(children)) {
    return sanitizeNativeButtonFallbackContent(children);
  }
  if (children.type === Fragment) {
    return sanitizeNativeButtonFallbackContent(children.props.children);
  }
  if (isVoidElement(children)) {
    return sanitizeNativeButtonFallbackContent(children);
  }

  return sanitizeNativeButtonFallbackContent(children.props.children);
};

export interface NativeButtonFallbackAccessibleNameProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
}

/** Returns rejected-host name sources for its native button fallback. */
export const getFallbackAccessibleNamePropsForNativeButton = (
  children: ReactNode,
): NativeButtonFallbackAccessibleNameProps => {
  if (!isValidElement<AnchorFallbackProps>(children)) return {};

  const accessibleNameProps: NativeButtonFallbackAccessibleNameProps = {};
  const ariaLabelledBy = children.props['aria-labelledby'];
  if (typeof ariaLabelledBy === 'string' && ariaLabelledBy.trim() !== '') {
    accessibleNameProps['aria-labelledby'] = ariaLabelledBy.trim();
  }

  for (const value of [children.props['aria-label'], children.props.title, children.props.alt]) {
    if (typeof value === 'string' && value.trim() !== '') {
      accessibleNameProps['aria-label'] = value.trim();
      break;
    }
  }
  return accessibleNameProps;
};

const anchorUnsafeElementNames = new Set([
  ...nativeInteractiveElementNames,
  ...voidElementNames,
  'a',
  'optgroup',
  'option',
]);
anchorUnsafeElementNames.delete('br');
anchorUnsafeElementNames.delete('wbr');

const getAnchorFallbackText = (props: AnchorFallbackProps): ReactNode => {
  for (const value of [
    props.children,
    props['aria-label'],
    props.alt,
    props.title,
    props.placeholder,
    props.value,
  ]) {
    if (value !== undefined && value !== null && value !== '') return value as ReactNode;
  }
  return null;
};

const isUnsafeAnchorDescendant = (element: ReactElement<AnchorFallbackProps>): boolean => {
  if (typeof element.type !== 'string') return true;
  if (anchorUnsafeElementNames.has(element.type)) return true;
  if (element.props.href !== undefined && element.props.href !== null) return true;
  if (element.props.tabIndex !== undefined) return true;
  if (
    element.props.contentEditable !== undefined &&
    element.props.contentEditable !== false &&
    element.props.contentEditable !== 'false'
  ) {
    return true;
  }

  const role = typeof element.props.role === 'string' ? element.props.role.trim() : '';
  return role !== '' && role !== 'none' && role !== 'presentation' && role !== 'img';
};

const sanitizeNativeAnchorFallbackContent = (content: ReactNode): ReactNode => {
  if (Array.isArray(content)) return content.map(sanitizeNativeAnchorFallbackContent);
  if (isReactNodeIterable(content))
    return materializeReactNodeIterable(content).map(sanitizeNativeAnchorFallbackContent);
  if (!isValidElement<AnchorFallbackProps>(content)) return content;
  if (content.type === Fragment) {
    return sanitizeNativeAnchorFallbackContent(content.props.children);
  }
  if (isUnsafeAnchorDescendant(content)) {
    return sanitizeNativeAnchorFallbackContent(getAnchorFallbackText(content.props));
  }

  return cloneElement(
    content,
    undefined,
    sanitizeNativeAnchorFallbackContent(content.props.children),
  );
};

/** Returns meaningful fallback content without interactive descendants for a native anchor. */
export const getFallbackChildrenForNativeAnchor = (children: ReactNode): ReactNode =>
  sanitizeNativeAnchorFallbackContent(children);
