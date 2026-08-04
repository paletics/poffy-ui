'use client';

import { Slot } from '@radix-ui/react-slot';
import { getFallbackChildrenPreservingVoidHost } from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import { Children, ElementType, forwardRef, isValidElement, type ReactNode } from 'react';
import { useTagContext } from './TagContext';
import { TagCloseButton } from './TagCloseButton';
import type { TagLabelComponent, TagLabelProps } from './Tag.types';
import { getTagInlineFallbackChildren, isTagLabelAsChildHost } from './Tag.utils';
import { isPotentiallyInteractiveAsChildHost } from '@/components/shared/asChild';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const containsTagCloseButton = (children: ReactNode): boolean =>
  Children.toArray(children).some((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return false;
    if (child.type === TagCloseButton) return true;
    return child.props.children !== undefined && containsTagCloseButton(child.props.children);
  });

const TagLabelImpl = forwardRef<HTMLElement, TagLabelProps>((props, ref) => {
  const { asChild, children, className, ...rest } = props;
  const { classes } = useTagContext();
  const materializedChildren = materializeReactNodeTree(children);
  const asChildElement =
    asChild && isTagLabelAsChildHost(materializedChildren) ? materializedChildren : null;
  const mustFallbackInteractiveLabel = Boolean(
    asChildElement &&
    containsTagCloseButton(asChildElement.props.children) &&
    isPotentiallyInteractiveAsChildHost(asChildElement),
  );
  const canUseAsChild = Boolean(asChildElement && !mustFallbackInteractiveLabel);
  const Component = (canUseAsChild ? Slot : 'span') as ElementType;

  return (
    <Component ref={ref} className={cx(classes.label, className)} {...rest}>
      {asChild && !canUseAsChild
        ? getTagInlineFallbackChildren(
            mustFallbackInteractiveLabel
              ? getFallbackChildrenPreservingVoidHost(asChildElement)
              : materializedChildren,
          )
        : materializedChildren}
    </Component>
  );
});

TagLabelImpl.displayName = 'Tag.Label';

/**
 * Renders the visible Tag label.
 *
 * It defaults to a `span`. `asChild` uses a supported inline host, but falls
 * back when delegation would place `Tag.CloseButton` in an interactive label.
 */

export const TagLabel = TagLabelImpl as TagLabelComponent;
