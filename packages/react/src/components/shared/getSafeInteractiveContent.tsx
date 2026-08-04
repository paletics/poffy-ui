import { cloneElement, Fragment, isValidElement, type ReactElement, type ReactNode } from 'react';
import {
  isReactNodeIterable,
  materializeReactNodeIterable,
} from '@/components/shared/flattenFragmentChildren';

interface InteractiveContentProps {
  alt?: unknown;
  'aria-label'?: unknown;
  children?: ReactNode;
  contentEditable?: unknown;
  role?: unknown;
  tabIndex?: unknown;
  title?: unknown;
  value?: unknown;
}

export interface SafeInteractiveContentOptions {
  /** Whether opaque custom components are preserved under a presentation-only contract. */
  preserveOpaque?: boolean;
  /** Whether native descendants with activation handlers are reduced to passive content. */
  disallowActivationHandlers?: boolean;
}

const activationHandlerNames = new Set([
  'onAuxClick',
  'onClick',
  'onContextMenu',
  'onDoubleClick',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onMouseDown',
  'onMouseUp',
  'onPointerDown',
  'onPointerUp',
  'onTouchEnd',
  'onTouchStart',
]);
const isActivationHandlerName = (name: string) => {
  if (activationHandlerNames.has(name)) return true;
  return (
    name.endsWith('Capture') &&
    activationHandlerNames.has(name.slice(0, -'Capture'.length))
  );
};

const interactiveElementNames = new Set([
  'a',
  'audio',
  'button',
  'details',
  'embed',
  'iframe',
  'input',
  'label',
  'object',
  'select',
  'summary',
  'textarea',
  'video',
]);

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
  'searchbox',
  'slider',
  'spinbutton',
  'switch',
  'tab',
  'textbox',
  'treeitem',
]);

const isInteractiveContent = (
  element: ReactElement<InteractiveContentProps>,
  disallowActivationHandlers: boolean,
) => {
  if (typeof element.type !== 'string') return false;
  if (interactiveElementNames.has(element.type)) return true;
  if (
    disallowActivationHandlers &&
    Object.entries(element.props).some(
      ([name, value]) => isActivationHandlerName(name) && typeof value === 'function',
    )
  ) {
    return true;
  }
  if (
    element.props.contentEditable !== undefined &&
    element.props.contentEditable !== false &&
    element.props.contentEditable !== 'false'
  ) {
    return true;
  }
  const tabIndex = element.props.tabIndex;
  if ((typeof tabIndex === 'number' || typeof tabIndex === 'string') && Number(tabIndex) >= 0) {
    return true;
  }

  return (
    typeof element.props.role === 'string' &&
    element.props.role
      .trim()
      .split(/\s+/)
      .some((role) => interactiveRoleNames.has(role))
  );
};

const getTextFallback = (props: InteractiveContentProps): ReactNode => {
  for (const value of [props.children, props['aria-label'], props.alt, props.title, props.value]) {
    if (value !== undefined && value !== null && value !== '') return value as ReactNode;
  }
  return null;
};

/**
 * Removes interactive descendants from content rendered inside one interactive widget.
 *
 * Opaque custom components are reduced to their text-equivalent props because their rendered
 * descendants cannot be verified as non-interactive without rendering them first, unless the
 * caller has a narrower presentation-only contract.
 */
export const getSafeInteractiveContent = (
  content: ReactNode,
  {
    preserveOpaque = false,
    disallowActivationHandlers = false,
  }: SafeInteractiveContentOptions = {},
): ReactNode => {
  const sanitize = (node: ReactNode): ReactNode =>
    getSafeInteractiveContent(node, { disallowActivationHandlers, preserveOpaque });

  if (Array.isArray(content)) return content.map(sanitize);
  if (isReactNodeIterable(content)) return materializeReactNodeIterable(content).map(sanitize);
  if (!isValidElement<InteractiveContentProps>(content)) {
    return typeof content === 'object' && content !== null ? null : content;
  }
  if (content.type === Fragment) return sanitize(content.props.children);
  if (isInteractiveContent(content, disallowActivationHandlers))
    return sanitize(getTextFallback(content.props));
  if (typeof content.type !== 'string') {
    return preserveOpaque ? content : sanitize(getTextFallback(content.props));
  }

  return cloneElement(content, undefined, sanitize(content.props.children));
};
