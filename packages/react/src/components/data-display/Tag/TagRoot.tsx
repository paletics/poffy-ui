'use client';

import { Slot } from '@radix-ui/react-slot';
import { getFallbackChildrenPreservingVoidHost } from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import { tag } from '@/styled-system/recipes';
import { Children, ElementType, forwardRef, isValidElement, type ReactNode, useMemo } from 'react';
import { TagContext } from './TagContext';
import { TagCloseButton } from './TagCloseButton';
import type { TagComponent, TagProps } from './Tag.types';
import {
  getTagInlineFallbackChildren,
  isInteractiveTagRootAsChildHost,
  isTagRootAsChildHost,
} from './Tag.utils';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const containsTagCloseButton = (children: ReactNode): boolean =>
  Children.toArray(children).some((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return false;
    if (child.type === TagCloseButton) return true;
    return child.props.children !== undefined && containsTagCloseButton(child.props.children);
  });

const TagRootImpl = forwardRef<HTMLElement, TagProps>((props, ref) => {
  const { asChild, children, className, size, appearance, intent, shape, ...rest } = props;
  const {
    variant: _unsupportedVariant,
    colorScheme: _unsupportedColorScheme,
    ...safeRest
  } = rest as typeof rest & { colorScheme?: unknown; variant?: unknown };
  const materializedChildren = materializeReactNodeTree(children);
  const asChildElement =
    asChild && isTagRootAsChildHost(materializedChildren) ? materializedChildren : null;
  const mustFallbackInteractiveRoot = Boolean(
    asChildElement &&
    containsTagCloseButton(asChildElement.props.children) &&
    (isInteractiveTagRootAsChildHost(asChildElement)
      ? true
      : typeof asChildElement.type !== 'string'),
  );
  const canUseAsChild = Boolean(asChildElement && !mustFallbackInteractiveRoot);
  const Component = (canUseAsChild ? Slot : 'span') as ElementType;
  const classes = tag({ size, appearance, intent, shape });

  const contextValue = useMemo(
    () => ({ size, appearance, intent, shape, classes }),
    [size, appearance, intent, shape, classes],
  );

  return (
    <TagContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...safeRest}>
        {asChild && !canUseAsChild
          ? getTagInlineFallbackChildren(
              getFallbackChildrenPreservingVoidHost(asChildElement ?? materializedChildren),
            )
          : materializedChildren}
      </Component>
    </TagContext.Provider>
  );
});

TagRootImpl.displayName = 'Tag.Root';

/**
 * Renders the Tag root and shares appearance variants with compound children.
 *
 * It falls back to a `span` if `asChild` is unsupported. It also rejects an
 * interactive delegated host that contains `Tag.CloseButton`, because that
 * would create nested interactive controls. Unsupported legacy visual props
 * are not forwarded to the DOM.
 */

export const TagRoot = TagRootImpl as TagComponent;
