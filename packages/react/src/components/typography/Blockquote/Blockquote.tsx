import { Fragment, forwardRef, isValidElement } from 'react';
import type { ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { blockquote } from '@/styled-system/recipes';
import { getFallbackChildrenPreservingVoidHost } from '@/components/shared/asChild';
import type { BlockquoteProps } from './Blockquote.types';

const isBlockquoteAsChildHost = (children: ReactNode) =>
  isValidElement<{ children?: ReactNode }>(children) &&
  children.type !== Fragment &&
  children.type === 'blockquote';

/**
 * Presents quoted content with native `blockquote` semantics and a visual tone.
 *
 * Provide source information through the native `cite` attribute or adjacent attribution. With
 * `asChild`, only a native `blockquote` is slotted; other children fall back to an owned quote so
 * the semantic container is retained.
 */
export const Blockquote = forwardRef<HTMLQuoteElement, BlockquoteProps>(
  ({ asChild, className, tone = 'brand', children, ...rest }, ref) => {
    const [cssProps, elementProps] = splitCssProps(rest);
    const canUseAsChild = asChild && isBlockquoteAsChildHost(children);
    const Component = canUseAsChild ? Slot : 'blockquote';

    return (
      <Component
        ref={ref}
        className={cx('poffy-blockquote', blockquote({ tone }), css(cssProps), className)}
        {...elementProps}
      >
        {canUseAsChild
          ? children
          : asChild
            ? getFallbackChildrenPreservingVoidHost(children)
            : children}
      </Component>
    );
  },
);

Blockquote.displayName = 'Blockquote';
