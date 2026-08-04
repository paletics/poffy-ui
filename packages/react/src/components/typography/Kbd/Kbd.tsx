import { cloneElement, Fragment, forwardRef, isValidElement } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { css, cx } from '@/styled-system/css';
import { splitCssProps } from '@/styled-system/jsx';
import { kbd } from '@/styled-system/recipes';
import { getFallbackChildrenPreservingVoidHost } from '@/components/shared/asChild';
import type { KbdProps } from './Kbd.types';

const isKbdAsChildHost = (children: ReactNode) =>
  isValidElement<{ children?: ReactNode }>(children) &&
  children.type !== Fragment &&
  children.type === 'kbd';

const getKbdFallbackAccessibilityProps = (children: ReactNode) => {
  if (!isValidElement<Record<string, unknown>>(children)) return undefined;

  const {
    'aria-describedby': ariaDescribedBy,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    title,
  } = children.props;

  return {
    ...(typeof ariaDescribedBy === 'string' ? { 'aria-describedby': ariaDescribedBy } : {}),
    ...(typeof ariaLabel === 'string' ? { 'aria-label': ariaLabel } : {}),
    ...(typeof ariaLabelledBy === 'string' ? { 'aria-labelledby': ariaLabelledBy } : {}),
    ...(typeof title === 'string' ? { title } : {}),
  };
};

const normalizeSize = (size: unknown): 'sm' | 'md' | 'lg' =>
  size === 'sm' || size === 'lg' || size === 'md' ? size : 'md';

const normalizeOverflow = (overflow: unknown): 'truncate' | 'wrap' =>
  overflow === 'wrap' ? 'wrap' : 'truncate';

const addChordBreakOpportunities = (children: ReactNode): ReactNode => {
  if (typeof children !== 'string') return children;

  return children.split('+').flatMap((segment, index, segments) =>
    index < segments.length - 1
      ? [
          segment,
          <Fragment key={`separator-${index}`}>
            +<wbr />
          </Fragment>,
        ]
      : [segment],
  );
};

/**
 * Renders a keyboard key or shortcut sequence using semantic `kbd` content.
 *
 * `overflow="wrap"` inserts break opportunities after `+` only for string shortcut labels;
 * `truncate` does not create a tooltip. `asChild` accepts one native `kbd` host, and other
 * children fall back to an owned `kbd` while preserving its basic accessible label attributes.
 */
export const Kbd = forwardRef<HTMLElement, KbdProps>(
  ({ asChild, className, size = 'md', overflow = 'truncate', children, ...rest }, ref) => {
    const [cssProps, elementProps] = splitCssProps(rest);
    const canUseAsChild = asChild && isKbdAsChildHost(children);
    const asChildElement = canUseAsChild
      ? (children as ReactElement<{ children?: ReactNode }>)
      : null;
    const Component = canUseAsChild ? Slot : 'kbd';
    const fallbackAccessibilityProps =
      canUseAsChild || !asChild ? undefined : getKbdFallbackAccessibilityProps(children);
    const displayedChildren = canUseAsChild
      ? asChildElement?.props.children
      : asChild
        ? getFallbackChildrenPreservingVoidHost(children)
        : children;
    const label = (
      <span data-kbd-label>
        {normalizeOverflow(overflow) === 'wrap'
          ? addChordBreakOpportunities(displayedChildren)
          : displayedChildren}
      </span>
    );
    const slottedChild = asChildElement ? cloneElement(asChildElement, undefined, label) : null;

    return (
      <Component
        ref={ref}
        className={cx(
          'poffy-kbd',
          kbd({ size: normalizeSize(size), overflow: normalizeOverflow(overflow) }),
          css(cssProps),
          className,
        )}
        {...fallbackAccessibilityProps}
        {...elementProps}
      >
        {canUseAsChild ? slottedChild : label}
      </Component>
    );
  },
);

Kbd.displayName = 'Kbd';
