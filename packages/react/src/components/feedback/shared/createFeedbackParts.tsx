'use client';

import { cx } from '@/styled-system/css';
import type { PrimitiveProps } from '@poffy-ui/types';
import { Slot } from '@radix-ui/react-slot';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ForwardRefExoticComponent,
  type PropsWithoutRef,
  type ReactNode,
  type RefAttributes,
} from 'react';
import { containsNonPhrasingContent, getFallbackText } from './contentModel';
import { materializeReactNodeTree } from '@/components/shared/flattenFragmentChildren';

interface FeedbackPartClasses {
  title: string;
  description: string;
  actions: string;
}

type UseFeedbackClasses = () => FeedbackPartClasses;
type TitleComponent = ForwardRefExoticComponent<
  PropsWithoutRef<PrimitiveProps<'h3'>> & RefAttributes<HTMLHeadingElement>
>;
type DescriptionComponent = ForwardRefExoticComponent<
  PropsWithoutRef<PrimitiveProps<'p'>> & RefAttributes<HTMLParagraphElement>
>;
type ActionsComponent = ForwardRefExoticComponent<
  PropsWithoutRef<PrimitiveProps<'div'>> & RefAttributes<HTMLDivElement>
>;

const titleElements = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

/**
 * Creates a feedback title part using the supplied recipe-class hook.
 *
 * The result renders `h3` by default. `asChild` accepts exactly one native heading whose content
 * is phrasing-only; all other delegated children, or non-phrasing default content, fall back to
 * safe text in the owned heading so the feedback region never contains invalid heading markup.
 */
export const createFeedbackTitle = ({
  displayName,
  useClasses,
}: {
  displayName: string;
  useClasses: UseFeedbackClasses;
}): TitleComponent => {
  const Component = forwardRef<HTMLHeadingElement, PrimitiveProps<'h3'>>(
    ({ asChild, className, children, ...rest }, ref) => {
      const materializedChildren = materializeReactNodeTree(children);
      const child = isValidElement<{ children?: ReactNode }>(materializedChildren)
        ? materializedChildren
        : null;
      const canUseAsChild =
        asChild &&
        child !== null &&
        typeof child.type === 'string' &&
        titleElements.has(child.type) &&
        !containsNonPhrasingContent(child.props.children);
      const Host = canUseAsChild ? Slot : 'h3';
      const classes = useClasses();
      const useTextFallback =
        (asChild && !canUseAsChild) ||
        (!asChild && containsNonPhrasingContent(materializedChildren));

      return (
        <Host ref={ref} className={cx(classes.title, className)} {...rest}>
          {useTextFallback ? getFallbackText(materializedChildren) : materializedChildren}
        </Host>
      );
    },
  );
  Component.displayName = displayName;
  return Component;
};

/**
 * Creates a feedback description part using the supplied recipe-class hook.
 *
 * The result renders `p` by default. `asChild` accepts one phrasing-only native paragraph; invalid
 * delegated children and non-phrasing default content are reduced to text to preserve paragraph
 * semantics.
 */
export const createFeedbackDescription = ({
  displayName,
  useClasses,
}: {
  displayName: string;
  useClasses: UseFeedbackClasses;
}): DescriptionComponent => {
  const Component = forwardRef<HTMLParagraphElement, PrimitiveProps<'p'>>(
    ({ asChild, className, children, ...rest }, ref) => {
      const materializedChildren = materializeReactNodeTree(children);
      const child = isValidElement<{ children?: ReactNode }>(materializedChildren)
        ? materializedChildren
        : null;
      const canUseAsChild =
        asChild &&
        child !== null &&
        child.type === 'p' &&
        !containsNonPhrasingContent(child.props.children);
      const Host = canUseAsChild ? Slot : 'p';
      const classes = useClasses();
      const useTextFallback =
        (asChild && !canUseAsChild) ||
        (!asChild && containsNonPhrasingContent(materializedChildren));

      return (
        <Host ref={ref} className={cx(classes.description, className)} {...rest}>
          {useTextFallback ? getFallbackText(materializedChildren) : materializedChildren}
        </Host>
      );
    },
  );
  Component.displayName = displayName;
  return Component;
};

/**
 * Creates an accessible action-group part using the supplied recipe-class hook.
 *
 * It always exposes `role="group"` and a non-empty label, taking consumer props, then safe child
 * props, then `useDefaultAriaLabel` in precedence order. `aria-live` follows the same precedence
 * with `defaultAriaLive` as the fallback. `asChild` is allowed only for the caller-specified native
 * structural hosts.
 */
export const createFeedbackActions = ({
  allowedHosts,
  useDefaultAriaLabel,
  defaultAriaLive,
  displayName,
  useClasses,
}: {
  allowedHosts: readonly string[];
  useDefaultAriaLabel: () => string;
  defaultAriaLive?: 'off';
  displayName: string;
  useClasses: UseFeedbackClasses;
}): ActionsComponent => {
  const safeHosts = new Set(allowedHosts);
  const Component = forwardRef<HTMLDivElement, PrimitiveProps<'div'>>(
    (
      { asChild, className, children, 'aria-label': ariaLabel, 'aria-live': ariaLive, ...rest },
      ref,
    ) => {
      const materializedChildren = materializeReactNodeTree(children);
      const canUseAsChild =
        asChild &&
        isValidElement(materializedChildren) &&
        typeof materializedChildren.type === 'string' &&
        safeHosts.has(materializedChildren.type);
      const Host = canUseAsChild ? Slot : 'div';
      const classes = useClasses();
      const defaultAriaLabel = useDefaultAriaLabel();
      const childProps =
        canUseAsChild &&
        isValidElement<{ 'aria-label'?: string; 'aria-live'?: 'off' | 'polite' | 'assertive' }>(
          materializedChildren,
        )
          ? materializedChildren.props
          : undefined;
      const resolvedAriaLabel =
        ariaLabel?.trim() || childProps?.['aria-label']?.trim() || defaultAriaLabel;
      const resolvedAriaLive = ariaLive ?? childProps?.['aria-live'] ?? defaultAriaLive;
      const renderedChildren =
        canUseAsChild &&
        isValidElement<{
          role?: string;
          'aria-label'?: string;
          'aria-live'?: 'off' | 'polite' | 'assertive';
        }>(materializedChildren)
          ? cloneElement(materializedChildren, {
              role: 'group',
              'aria-label': resolvedAriaLabel,
              'aria-live': resolvedAriaLive,
            })
          : materializedChildren;

      return (
        <Host
          ref={ref}
          className={cx(classes.actions, className)}
          {...rest}
          role="group"
          aria-label={resolvedAriaLabel}
          aria-live={resolvedAriaLive}
        >
          {renderedChildren}
        </Host>
      );
    },
  );
  Component.displayName = displayName;
  return Component;
};
