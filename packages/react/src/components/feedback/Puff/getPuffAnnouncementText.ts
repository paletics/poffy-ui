import { Fragment, isValidElement, type ReactNode } from 'react';
import type { PuffBaseProps } from './Puff.types';

const interactiveElementNames = new Set([
  'a',
  'button',
  'details',
  'input',
  'select',
  'summary',
  'textarea',
]);

const getStaticText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number' || typeof node === 'bigint') {
    return String(node);
  }
  if (Array.isArray(node)) return node.map(getStaticText).filter(Boolean).join(' ');
  if (
    !isValidElement<{
      children?: ReactNode;
      hidden?: boolean;
      inert?: boolean;
      'aria-hidden'?: boolean | 'true' | 'false';
    }>(node)
  ) {
    return '';
  }
  if (node.type !== Fragment && typeof node.type !== 'string') return '';
  if (
    node.props.hidden ||
    node.props.inert ||
    node.props['aria-hidden'] === true ||
    node.props['aria-hidden'] === 'true' ||
    (typeof node.type === 'string' && interactiveElementNames.has(node.type))
  ) {
    return '';
  }
  return getStaticText(node.props.children);
};

/**
 * Creates a stable announcement string without rendering opaque components or
 * duplicating interactive toast actions inside a live region.
 */
export const getPuffAnnouncementText = ({
  announcement,
  title,
  children,
}: Pick<PuffBaseProps, 'announcement' | 'title' | 'children'>): string | undefined => {
  const fallbackText = [getStaticText(title), getStaticText(children)].filter(Boolean).join(' ');
  const text = typeof announcement === 'string' ? announcement : fallbackText;
  const normalizedText = text.replace(/\s+/g, ' ').trim();
  return normalizedText.length > 0 ? normalizedText : undefined;
};
