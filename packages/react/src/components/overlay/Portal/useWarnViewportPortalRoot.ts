'use client';

import { useEffect } from 'react';

interface RuntimeEnv {
  process?: { env?: Record<string, string | undefined> };
}

const warnedRoots = new WeakMap<Element, Set<string>>();
const isNonNone = (value: string | undefined) => Boolean(value && value !== 'none');

const createsFixedContainingBlock = (element: Element) => {
  const ownerWindow = element.ownerDocument.defaultView;
  if (!ownerWindow) return false;
  const style = ownerWindow.getComputedStyle(element);
  const contain = style.contain.split(/\s+/u);
  const willChange = style.willChange.split(',').map((value) => value.trim());
  const containerType = style.containerType;

  return [
    isNonNone(style.transform),
    isNonNone(style.perspective),
    isNonNone(style.filter),
    isNonNone(style.backdropFilter),
    contain.some((value) => ['content', 'layout', 'paint', 'strict'].includes(value)),
    Boolean(containerType && containerType !== 'normal'),
    style.contentVisibility === 'auto',
    willChange.some((value) =>
      ['backdrop-filter', 'filter', 'perspective', 'transform'].includes(value),
    ),
  ].some(Boolean);
};

const getPortalRootElement = (target: Element | DocumentFragment) => {
  const ownerWindow = target.ownerDocument.defaultView;
  if (!ownerWindow) return null;
  if (target instanceof ownerWindow.Element) return target;
  return target instanceof ownerWindow.ShadowRoot ? target.host : null;
};

const getComposedParentElement = (element: Element) => {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  const ownerWindow = element.ownerDocument.defaultView;
  return ownerWindow && root instanceof ownerWindow.ShadowRoot ? root.host : null;
};

/**
 * Warns when a viewport-fixed overlay is portalled beneath a CSS fixed
 * containing block. Portal roots choose DOM ownership, not geometry scope.
 */
export const useWarnViewportPortalRoot = ({
  componentName,
  enabled,
  target,
}: {
  componentName: string;
  enabled: boolean;
  target: Element | DocumentFragment | null;
}) => {
  useEffect(() => {
    if (
      !enabled ||
      !target ||
      (globalThis as RuntimeEnv).process?.env?.['NODE_ENV'] === 'production'
    ) {
      return;
    }

    const root = getPortalRootElement(target);
    if (!root) return;
    let containingBlock: Element | null = root;
    while (containingBlock && !createsFixedContainingBlock(containingBlock)) {
      containingBlock = getComposedParentElement(containingBlock);
    }
    if (!containingBlock) return;

    const warnedComponents = warnedRoots.get(containingBlock) ?? new Set<string>();
    if (warnedComponents.has(componentName)) return;
    warnedComponents.add(componentName);
    warnedRoots.set(containingBlock, warnedComponents);
    console.warn(
      `[${componentName}] The configured portal root is inside a CSS fixed-position containing block. This component remains viewport-scoped; use a viewport-compatible portal root without transform, filter, perspective, paint/layout containment, container-type, content-visibility, or matching will-change.`,
    );
  }, [componentName, enabled, target]);
};
