import {
  flattenFragmentChildren,
  materializeReactNodeTree,
} from '@/components/shared/flattenFragmentChildren';
import { Children, Fragment, isValidElement, type ReactNode } from 'react';

const phrasingElements = new Set([
  'a',
  'abbr',
  'audio',
  'b',
  'bdi',
  'bdo',
  'br',
  'button',
  'canvas',
  'cite',
  'code',
  'data',
  'datalist',
  'del',
  'dfn',
  'em',
  'embed',
  'i',
  'iframe',
  'img',
  'input',
  'ins',
  'kbd',
  'label',
  'map',
  'mark',
  'math',
  'meter',
  'noscript',
  'object',
  'output',
  'picture',
  'progress',
  'q',
  'ruby',
  's',
  'samp',
  'script',
  'select',
  'slot',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'svg',
  'template',
  'textarea',
  'time',
  'u',
  'var',
  'video',
  'wbr',
]);

const embeddedContentElements = new Set([
  'audio',
  'canvas',
  'iframe',
  'math',
  'object',
  'picture',
  'svg',
  'video',
]);

const isValidPictureContent = (children: ReactNode) => {
  const pictureChildren = flattenFragmentChildren(children);
  const image = pictureChildren.at(-1);

  return (
    pictureChildren.length > 0 &&
    isValidElement(image) &&
    image.type === 'img' &&
    pictureChildren.slice(0, -1).every((child) => isValidElement(child) && child.type === 'source')
  );
};

/** Returns whether content cannot safely appear in a heading or paragraph. */
export const containsNonPhrasingContent = (children: ReactNode): boolean =>
  Children.toArray(materializeReactNodeTree(children)).some((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) {
      return false;
    }

    if (child.type === Fragment) {
      return containsNonPhrasingContent(child.props.children);
    }

    if (typeof child.type === 'string' && embeddedContentElements.has(child.type)) {
      return child.type === 'picture' ? !isValidPictureContent(child.props.children) : false;
    }

    if (typeof child.type !== 'string') return true;
    if (!phrasingElements.has(child.type)) return true;
    return containsNonPhrasingContent(child.props.children);
  });

/**
 * Keeps textual content when an invalid asChild host falls back to a semantic
 * heading or paragraph, preventing invalid block-element nesting. Embedded
 * content such as SVG is preserved by the caller when its host is valid.
 */
export const getFallbackText = (children: ReactNode): ReactNode[] =>
  Children.toArray(materializeReactNodeTree(children)).flatMap((child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return child;
    }

    return isValidElement<{ children?: ReactNode }>(child)
      ? getFallbackText(child.props.children)
      : [];
  });
