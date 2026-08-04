import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { heading } from '@/styled-system/recipes';
import {
  getFallbackChildrenPreservingVoidHost,
  isNonVoidAsChildHost,
} from '@/components/shared/asChild';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef, type ElementType } from 'react';
import type { ReactNode } from 'react';
import type { HeadingComponent, HeadingLevel, HeadingProps } from './Heading.types';

const normalizeHeadingLevel = (level: unknown): HeadingLevel => {
  const numeric = typeof level === 'string' ? Number(level) : level;
  return typeof numeric === 'number' && Number.isInteger(numeric) && numeric >= 1 && numeric <= 6
    ? (String(numeric) as HeadingLevel)
    : '1';
};

const isEmptyHeading = (children: ReactNode) => {
  if (children === null) return true;
  if (children === undefined) return true;
  return typeof children === 'string' && children.trim() === '';
};


const HeadingImpl = forwardRef<Element, HeadingProps>((props, ref) => {
  const {
    level = '1',
    asChild,
    className,
    children,
    weight,
    role,
    'aria-level': ariaLevel,
    ...rest
  } = props;
  const normalizedLevel = normalizeHeadingLevel(level);
  const canUseAsChild = asChild && isNonVoidAsChildHost(children);

  const Component = (canUseAsChild ? Slot : `h${normalizedLevel}`) as ElementType;

  const [cssProps, elementProps] = splitCssProps(rest);
  const semanticOverrideProps = canUseAsChild ? { role, 'aria-level': ariaLevel } : {};

  const recipeClass = heading({
    level: normalizedLevel,
    weight,
  });
  const styleClass = css(cssProps);
  const renderedChildren = canUseAsChild
    ? children
    : asChild
      ? getFallbackChildrenPreservingVoidHost(children)
      : children;

  if (isEmptyHeading(renderedChildren)) return null;

  return (
    <Component
      ref={ref}
      className={cx(recipeClass, styleClass, className)}
      {...elementProps}
      {...semanticOverrideProps}
    >
      {renderedChildren}
    </Component>
  );
});

HeadingImpl.displayName = 'Heading';
/**
 * Renders a non-empty semantic heading whose visual styling is independent of its level.
 *
 * Choose `level` from the document outline. With `asChild`, a single non-void child host is
 * preserved and the caller owns any heading semantics or ARIA override. Empty content renders
 * nothing; an invalid runtime `level` is normalized to `1`.
 */
export const Heading = HeadingImpl as HeadingComponent;
