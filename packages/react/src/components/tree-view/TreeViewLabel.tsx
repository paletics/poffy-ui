'use client';

import { forwardRef, isValidElement } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import type { TreeViewLabelComponent, TreeViewLabelProps } from './TreeView.types';
import { useTreeViewContext } from './TreeViewContext';
import { getFallbackChildrenForNativeContainer } from '@/components/shared/asChild';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';

const treeLabelAsChildHosts = new Set([
  'abbr',
  'b',
  'cite',
  'code',
  'em',
  'i',
  'mark',
  's',
  'small',
  'span',
  'strong',
  'sub',
  'sup',
  'time',
  'u',
]);


const TreeViewLabelImpl = forwardRef<HTMLElement, TreeViewLabelProps>(
  ({ children, className, asChild, title, ...props }, ref) => {
    const { classes } = useTreeViewContext();
    const canUseAsChild = Boolean(
      asChild &&
      isValidElement(children) &&
      typeof children.type === 'string' &&
      treeLabelAsChildHosts.has(children.type),
    );
    const Component = canUseAsChild ? Slot : 'span';

    return (
      <Component
        ref={ref}
        className={cx(classes.label, className)}
        title={title ?? (typeof children === 'string' ? children : undefined)}
        {...props}
      >
        {getSafeInteractiveContent(
          asChild && !canUseAsChild ? getFallbackChildrenForNativeContainer(children) : children,
          { preserveOpaque: true },
        )}
      </Component>
    );
  },
);
TreeViewLabelImpl.displayName = 'TreeViewLabel';

/**
 * Renders safe visible text inside a TreeView trigger.
 *
 * It defaults to a `span`, derives a native tooltip from string content unless
 * `title` is supplied, and delegates only to supported inline text hosts.
 * Interactive descendants are sanitized so the enclosing treeitem retains its
 * single navigation model.
 */

export const TreeViewLabel = TreeViewLabelImpl as TreeViewLabelComponent;
