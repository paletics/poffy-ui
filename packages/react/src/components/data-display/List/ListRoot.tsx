'use client';

import { Slot, Slottable } from '@radix-ui/react-slot';
import { isNonVoidAsChildHost } from '@/components/shared/asChild';
import { cx } from '@/styled-system/css';
import { list } from '@/styled-system/recipes';
import {
  Children,
  cloneElement,
  ElementType,
  Fragment,
  forwardRef,
  isValidElement,
  type ReactNode,
  useEffect,
  useMemo,
} from 'react';
import type { ListProps, ListRootComponent } from './List.types';
import { ListContext } from './ListContext';
import { isListRootAsChildHost } from './List.utils';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const hasDefinitelyInvalidListChild = (children: ReactNode): boolean =>
  Children.toArray(children).some((child) => {
    if (!isValidElement<{ children?: ReactNode }>(child)) return true;
    if (child.type === Fragment) return hasDefinitelyInvalidListChild(child.props.children);
    if (typeof child.type !== 'string') return false;
    return child.type !== 'li';
  });

const normalizeKnownInvalidListChildren = (children: ReactNode, path = 'list-child'): ReactNode[] =>
  Children.toArray(children).flatMap((child, index) => {
    const childPath = `${path}-${isValidElement(child) && child.key !== null ? child.key : index}`;
    if (isValidElement<{ children?: ReactNode }>(child) && child.type === Fragment) {
      return normalizeKnownInvalidListChildren(child.props.children, childPath);
    }
    if (isValidElement(child) && typeof child.type !== 'string') return child;
    if (isValidElement(child) && child.type === 'li')
      return cloneElement(child, { key: childPath });
    return <li key={childPath}>{child}</li>;
  });

const getListFallbackSource = (children: ReactNode): ReactNode =>
  isValidElement<{ children?: ReactNode }>(children) &&
  (children.type === Fragment || isNonVoidAsChildHost(children))
    ? children.props.children
    : children;

const ListRootImpl = forwardRef<HTMLUListElement | HTMLOListElement, ListProps>((props, ref) => {
  const { asChild, variant = 'plain', children, className, ...rest } = props;
  const classes = useMemo(() => list({ variant }), [variant]);
  const materializedChildren = materializeReactNodeTree(children);
  const asChildHost =
    asChild && isListRootAsChildHost(materializedChildren, variant) ? materializedChildren : null;
  const asChildProps = asChildHost?.props as { children?: ReactNode } | undefined;
  const asChildChildren = asChildProps?.children;
  const Component = (asChildHost ? Slot : variant === 'ordered' ? 'ol' : 'ul') as ElementType;
  const fallbackChildren = asChild
    ? getListFallbackSource(materializedChildren)
    : materializedChildren;
  const renderedChildren = asChildHost
    ? cloneElement(asChildHost, undefined, normalizeKnownInvalidListChildren(asChildChildren))
    : normalizeKnownInvalidListChildren(fallbackChildren);
  const isSemanticList = true;
  const hasInvalidChildren = hasDefinitelyInvalidListChild(
    asChildHost ? asChildChildren : fallbackChildren,
  );

  useEffect(() => {
    if (!hasInvalidChildren) return;
    const nodeEnv = (
      globalThis as typeof globalThis & { process?: { env?: { NODE_ENV?: string } } }
    ).process?.env?.NODE_ENV;
    if (nodeEnv === 'production') return;
    console.warn(
      '[List] List.Root children must render list items. Use List.Item or a component that forwards to List.Item.',
    );
  }, [hasInvalidChildren]);

  const contextValue = useMemo(
    () => ({ variant, isSemanticList, classes }),
    [variant, isSemanticList, classes],
  );

  return (
    <ListContext.Provider value={contextValue}>
      <Component ref={ref} className={cx(classes.root, className)} {...rest}>
        <Slottable>{renderedChildren}</Slottable>
      </Component>
    </ListContext.Provider>
  );
});

ListRootImpl.displayName = 'List.Root';

/**
 * Renders the semantic list container and shares its visual slots with children.
 *
 * `ordered` selects an `ol`; every other variant selects a `ul`. Text and
 * native non-`li` children are normalized into list items, while opaque
 * component output is preserved and warns in development when known invalid.
 * `asChild` only accepts the matching native list host.
 */

export const ListRoot = ListRootImpl as unknown as ListRootComponent;
