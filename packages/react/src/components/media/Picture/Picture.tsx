import { cx } from '@/styled-system/css';
import { picture } from '@/styled-system/recipes';
import { flattenFragmentChildren } from '@/components/shared/flattenFragmentChildren';
import { forwardRef, isValidElement, type ReactElement, type ReactNode } from 'react';
import type { PictureProps } from './Picture.types';

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

interface PictureChildProps {
  alt?: string;
}

const isPictureElement = (child: ReactNode): child is ReactElement<PictureChildProps> =>
  isValidElement<PictureChildProps>(child);

const emittedPictureWarnings = new Set<string>();

const getPictureChildIssues = (materializedChildren: ReactNode[]) => {
  const childNodes = materializedChildren.filter(
    (child) => child !== null && child !== undefined && typeof child !== 'boolean',
  );
  const elements = childNodes.filter(isPictureElement);
  const hasUninspectableChild = elements.some((child) => typeof child.type !== 'string');
  const imageIndexes = childNodes.flatMap((child, index) =>
    isPictureElement(child) && child.type === 'img' ? [index] : [],
  );
  const sourceIndexes = childNodes.flatMap((child, index) =>
    isPictureElement(child) && child.type === 'source' ? [index] : [],
  );
  const issues: string[] = [];
  const fallbackImageIndex = imageIndexes[0];
  const fallbackImage =
    fallbackImageIndex === undefined ? undefined : childNodes[fallbackImageIndex];

  if (!hasUninspectableChild && imageIndexes.length === 0)
    issues.push('a direct-child fallback <img> is required');
  if (imageIndexes.length > 1) issues.push('only one direct-child fallback <img> is supported');
  if (fallbackImageIndex !== undefined && fallbackImageIndex !== childNodes.length - 1)
    issues.push('the fallback <img> must be the final direct child');
  if (isPictureElement(fallbackImage) && fallbackImage.props.alt === undefined)
    issues.push('the fallback <img> must declare alt (use alt="" when decorative)');
  if (fallbackImageIndex !== undefined && sourceIndexes.some((index) => index > fallbackImageIndex))
    issues.push('<source> elements must precede the fallback <img>');
  if (
    childNodes.some((child) => {
      if (!isPictureElement(child)) return true;
      return typeof child.type === 'string' && child.type !== 'img' && child.type !== 'source';
    })
  )
    issues.push('only direct-child <source> and the fallback <img> are supported');

  return issues;
};

/**
 * Renders responsive-image sources with a final fallback `img`.
 *
 * Keep direct-child `source` elements before exactly one final `img`, and put
 * the image alternative on that fallback `img`. Invalid inspectable structures
 * still render but warn once in development. Browser source selection does not
 * provide network-error retry; use `Image` when a managed error fallback is required.
 */
export const Picture = forwardRef<HTMLPictureElement, PictureProps>((props, ref) => {
  const { className, children, fit, sizing, ...rest } = props;

  const styles = picture({ fit, sizing });
  const nodeEnv = (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'];
  const childNodes = flattenFragmentChildren(children);
  const childIssues = getPictureChildIssues(childNodes);

  if (nodeEnv && nodeEnv !== 'production' && childIssues.length > 0) {
    const warning = `[Picture] Invalid child structure: ${childIssues.join('; ')}.`;

    if (!emittedPictureWarnings.has(warning)) {
      emittedPictureWarnings.add(warning);
      console.warn(warning);
    }
  }

  return (
    <picture ref={ref} className={cx(styles, className)} {...rest}>
      {childNodes}
    </picture>
  );
});

Picture.displayName = 'Picture';
