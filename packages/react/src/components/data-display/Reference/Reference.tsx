import { Slot, Slottable } from '@radix-ui/react-slot';
import { sanitizeMarkdownUrl } from '@poffy-ui/behavior';
import { cx } from '@/styled-system/css';
import { reference } from '@/styled-system/recipes';
import { resolveSafeLinkRel } from '@/components/shared/linkTarget';
import { hasAccessibleCaptionContent } from '@/components/data-display/CodeViewer/CodeViewer.utils';
import { getSafeInteractiveContent } from '@/components/shared/getSafeInteractiveContent';
import { omitNativeAnchorOnlyProps } from '@/components/shared/linkDelegation';
import { useOptionalLocale } from '@/providers/LocaleProvider';
import { cloneElement, ElementType, forwardRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { ReferenceComponent, ReferenceProps } from './Reference.types';
import { isReferenceAsChildHost } from './Reference.utils';
import { getReferenceMessages } from './Reference.locales';

interface ReferenceHostProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  children?: ReactNode;
  href?: string;
  rel?: string;
  target?: string;
}

const ReferenceImpl = forwardRef<HTMLElement, ReferenceProps>((publicProps, ref) => {
  const {
    asChild,
    index,
    label,
    href,
    external = false,
    description,
    appearance,
    size,
    overflow,
    locale: localeProp,
    messages: messageOverrides,
    children,
    className,
    target,
    rel,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    ...rest
  } = publicProps as ReferenceProps & { rel?: string; target?: string };
  const providerLocale = useOptionalLocale()?.locale;
  const messages = getReferenceMessages(localeProp ?? providerLocale, messageOverrides);
  const classes = reference({ appearance, size, overflow });
  const hasHref = href !== undefined;
  const safeHref = href ? sanitizeMarkdownUrl(href) : undefined;
  const canUseAsChild = asChild && isReferenceAsChildHost(children, hasHref);
  const Component = (canUseAsChild ? Slot : hasHref ? 'a' : 'span') as ElementType;
  const safeTarget = safeHref ? (external ? '_blank' : target) : undefined;
  const safeRel = safeHref ? resolveSafeLinkRel(safeTarget, rel) : undefined;
  const hostProps = safeHref ? rest : omitNativeAnchorOnlyProps(rest);
  const normalizedAriaLabel = ariaLabel?.trim() || undefined;
  const normalizedAriaLabelledBy = ariaLabelledBy?.trim() || undefined;
  const slottedAriaLabel = canUseAsChild
    ? (children as ReactElement<ReferenceHostProps>).props['aria-label']?.trim()
    : undefined;
  const slottedAriaLabelledBy = canUseAsChild
    ? (children as ReactElement<ReferenceHostProps>).props['aria-labelledby']?.trim()
    : undefined;
  const displayedLabel = canUseAsChild
    ? (label ?? (children as ReactElement<ReferenceHostProps>).props.children)
    : (children ?? label);
  const safeLabel = safeHref ? getSafeInteractiveContent(displayedLabel) : displayedLabel;
  const safeDescription = safeHref ? getSafeInteractiveContent(description) : description;
  const referenceContent = [index != null ? `[${index}]` : null, safeLabel, safeDescription];
  const fallbackAriaLabel =
    safeHref &&
    !normalizedAriaLabel &&
    !normalizedAriaLabelledBy &&
    !slottedAriaLabel &&
    !slottedAriaLabelledBy &&
    !hasAccessibleCaptionContent(referenceContent)
      ? messages.reference
      : undefined;
  const resolvedAriaLabel = normalizedAriaLabel ?? fallbackAriaLabel;
  const slottedChild = canUseAsChild
    ? cloneElement(children as ReactElement<ReferenceHostProps>, {
        href: safeHref,
        rel: safeRel,
        target: safeTarget,
        ...(resolvedAriaLabel !== undefined ? { 'aria-label': resolvedAriaLabel } : {}),
        ...(normalizedAriaLabel !== undefined ? { 'aria-labelledby': undefined } : {}),
        ...(normalizedAriaLabelledBy !== undefined
          ? { 'aria-labelledby': normalizedAriaLabelledBy }
          : {}),
      })
    : null;
  const content = (
    <>
      {index != null ? (
        <>
          <span className={classes.marker} data-part="marker">
            [{index}]
          </span>{' '}
        </>
      ) : null}
      <span className={classes.label} data-part="label">
        {canUseAsChild ? safeLabel : asChild && href && !safeHref ? label : safeLabel}
      </span>
      {safeDescription != null ? (
        <>
          {' '}
          <span className={classes.description} data-part="description">
            {safeDescription}
          </span>
        </>
      ) : null}
    </>
  );

  return (
    <Component
      ref={ref}
      className={cx(classes.root, className)}
      href={safeHref}
      target={safeTarget}
      rel={safeRel}
      aria-label={resolvedAriaLabel}
      aria-labelledby={normalizedAriaLabelledBy}
      {...hostProps}
      data-has-marker={index != null ? '' : undefined}
    >
      {canUseAsChild ? <Slottable>{slottedChild}</Slottable> : null}
      {content}
    </Component>
  );
});

ReferenceImpl.displayName = 'Reference';

/**
 * Renders one cited source as text or a safe link.
 *
 * Providing `href` selects an anchor; otherwise it renders a `span`. Unsafe
 * destinations are removed, including their anchor-only attributes. External
 * links open in a new tab and receive safe `rel` tokens. Link labels and
 * descriptions are made non-interactive, and an otherwise unnamed link gets a
 * localized fallback name. `asChild` accepts `a` for links and `span` for text.
 */

export const Reference = ReferenceImpl as ReferenceComponent;
