'use client';

import { css, cx } from '@/styled-system/css';
import { Slot } from '@radix-ui/react-slot';
import {
  Children,
  createElement,
  forwardRef,
  isValidElement,
  type ElementType,
  type ReactElement,
  type ReactNode,
  useEffect,
} from 'react';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { useEmptyStateClasses } from '@/components/feedback/EmptyState/EmptyStateContext';
import type {
  EmptyStateIconComponent,
  EmptyStateIconProps,
} from '@/components/feedback/EmptyState/EmptyState.types';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

const isSafeIconAsChildHost = (children: ReactNode) =>
  isValidElement(children) && children.type === 'svg';

const interactiveElements = new Set(['a', 'button', 'input', 'select', 'textarea']);
const presentationHostBlockedProps = new Set([
  'accessKey',
  'autoFocus',
  'children',
  'contentEditable',
  'dangerouslySetInnerHTML',
  'draggable',
  'focusable',
  'tabIndex',
]);
const sanitizePresentationHostProps = (props: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(props).filter(
      ([name]) => !presentationHostBlockedProps.has(name) && !/^on[A-Z]/.test(name),
    ),
  );
const presentationContentsClass = css({ display: 'contents' });

const containsInteractiveContent = (children: ReactNode): boolean =>
  Children.toArray(children).some((child) => {
    if (!isValidElement(child)) return false;
    const element = child as ReactElement<{
      children?: ReactNode;
      href?: unknown;
      contentEditable?: unknown;
      onClick?: unknown;
      onKeyDown?: unknown;
      onKeyUp?: unknown;
      onPointerDown?: unknown;
      role?: string;
      tabIndex?: number;
    }>;
    if (
      (typeof element.type === 'string' && interactiveElements.has(element.type)) ||
      element.props.href !== undefined ||
      element.props.role === 'button' ||
      (element.props.tabIndex !== undefined && element.props.tabIndex >= 0) ||
      (element.props.contentEditable !== undefined &&
        element.props.contentEditable !== false &&
        element.props.contentEditable !== 'false') ||
      [
        element.props.onClick,
        element.props.onKeyDown,
        element.props.onKeyUp,
        element.props.onPointerDown,
      ].some((handler) => typeof handler === 'function')
    ) {
      return true;
    }
    return containsInteractiveContent(element.props.children);
  });

/**
 * Icon container for EmptyState.
 */
const EmptyStateIconImpl = forwardRef<HTMLDivElement | SVGSVGElement, EmptyStateIconProps>(
  (props, ref) => {
    const {
      asChild,
      className,
      children,
      decorative = true,
      'aria-label': ariaLabel,
      'aria-labelledby': ariaLabelledBy,
      ...rest
    } = props as EmptyStateIconProps & {
      role?: unknown;
      'aria-hidden'?: unknown;
      inert?: unknown;
    };
    const materializedChildren = materializeReactNodeTree(children);
    const {
      role: _role,
      'aria-hidden': _ariaHidden,
      inert: _inert,
      tabIndex: _tabIndex,
      contentEditable: _contentEditable,
      draggable: _draggable,
      dangerouslySetInnerHTML: _dangerouslySetInnerHTML,
      ...unfilteredRest
    } = rest as typeof rest & {
      contentEditable?: unknown;
      dangerouslySetInnerHTML?: unknown;
      draggable?: unknown;
      tabIndex?: unknown;
    };
    const safeRest = sanitizePresentationHostProps(unfilteredRest);
    const canUseAsChild = asChild && isSafeIconAsChildHost(materializedChildren);
    const Component = (canUseAsChild ? Slot : 'div') as ElementType;
    const classes = useEmptyStateClasses();
    const childHasName =
      canUseAsChild &&
      isValidElement<{ 'aria-label'?: string; 'aria-labelledby'?: string }>(materializedChildren) &&
      [
        materializedChildren.props['aria-label'],
        materializedChildren.props['aria-labelledby'],
      ].some((value) => Boolean(value?.trim()));
    const hasOwnName = [ariaLabel, ariaLabelledBy].some((value) => Boolean(value?.trim()));
    const hasName = hasOwnName ? true : childHasName;
    const isMeaningful = decorative === false && hasName;
    const isDecorative = decorative === true ? true : decorative === false && !hasName;
    const hasInteractiveContent = containsInteractiveContent(materializedChildren);
    const safeIconChildren =
      canUseAsChild && isValidElement<{ children?: ReactNode }>(materializedChildren)
        ? getSafeInteractiveContent(materializedChildren.props.children, {
            preserveOpaque: isDecorative,
            disallowActivationHandlers: true,
          })
        : getSafeInteractiveContent(materializedChildren, {
            preserveOpaque: true,
            disallowActivationHandlers: true,
          });

    useEffect(() => {
      if (!hasInteractiveContent) return;
      const nodeEnv = (globalThis as { process?: { env?: Record<string, string | undefined> } })
        .process?.env?.['NODE_ENV'];
      if (nodeEnv === 'production') return;
      console.warn(
        '[EmptyStateIcon] Icons must not contain interactive content. Move actions to EmptyStateActions.',
      );
    }, [hasInteractiveContent]);

    const renderedChildren =
      canUseAsChild &&
      (isDecorative || isMeaningful) &&
      isValidElement<{
        role?: string;
        'aria-hidden'?: boolean;
        'aria-label'?: string;
        'aria-labelledby'?: string;
        inert?: boolean;
      }>(materializedChildren) ? (
        createElement(
          'svg',
          {
            ...sanitizePresentationHostProps(
              materializedChildren.props as unknown as Record<string, unknown>,
            ),
            role: isMeaningful ? 'img' : undefined,
            'aria-hidden': isMeaningful ? false : true,
            'aria-label':
              isMeaningful && isValidElement<{ 'aria-label'?: string }>(materializedChildren)
                ? (ariaLabel ?? materializedChildren.props['aria-label'])
                : undefined,
            'aria-labelledby':
              isMeaningful && isValidElement<{ 'aria-labelledby'?: string }>(materializedChildren)
                ? (ariaLabelledBy ?? materializedChildren.props['aria-labelledby'])
                : undefined,
            inert: isMeaningful ? undefined : true,
          },
          safeIconChildren,
        )
      ) : asChild ? null : isMeaningful ? (
        <span aria-hidden="true" className={presentationContentsClass} inert>
          {safeIconChildren}
        </span>
      ) : (
        safeIconChildren
      );

    return (
      <Component
        ref={ref}
        className={cx(classes.icon, className)}
        {...safeRest}
        role={isMeaningful ? 'img' : undefined}
        aria-hidden={isMeaningful ? false : true}
        aria-label={isMeaningful ? ariaLabel : undefined}
        aria-labelledby={isMeaningful ? ariaLabelledBy : undefined}
        inert={isMeaningful ? undefined : true}
      >
        {renderedChildren}
      </Component>
    );
  },
);

EmptyStateIconImpl.displayName = 'EmptyStateIcon';

/**
 * EmptyState icon with branch-aware div and SVG ref contracts.
 *
 * Icons are decorative and inert by default. To expose a meaningful SVG, set `decorative={false}`
 * and provide an accessible name; otherwise it remains hidden. `asChild` accepts only one SVG and
 * sanitizes interactive descendants, which belong in `EmptyStateActions` instead.
 */
export const EmptyStateIcon = EmptyStateIconImpl as EmptyStateIconComponent;
