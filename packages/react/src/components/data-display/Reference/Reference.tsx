import { Slot } from '@radix-ui/react-slot';
import { cx } from '@/styled-system/css';
import { reference } from '@/styled-system/recipes';
import { ElementType, forwardRef } from 'react';
import type { ReferenceProps } from './Reference.types';

const buildLabel = (index: ReferenceProps['index'], label: ReferenceProps['label']) =>
  `${index ? `[${index}] ` : ''}${typeof label === 'string' ? label : ''}`.trim();

const mergeBlankTargetRel = (rel: string | undefined) => {
  const tokens = new Set((rel ?? '').split(/\s+/).filter(Boolean));
  tokens.add('noopener');
  tokens.add('noreferrer');
  return Array.from(tokens).join(' ');
};

/**
 * Compact source attribution link for documents, search results, reports, and generated output.
 *
 * ### AI Context & Architecture
 * - Tier: Molecules
 * - Stack: Panda CSS (`reference` recipe), Radix Slot
 *
 * ### Accessibility
 * - Renders a link when `href` is supplied; otherwise renders a labelled text span.
 * - Preserves the marker in the accessible name when the label is plain text.
 *
 * @example
 * ```tsx
 * <Reference index={1} label="Design docs" href="/docs/design" />
 * ```
 */
export const Reference = forwardRef<HTMLElement, ReferenceProps>(
  (
    {
      asChild,
      index,
      label,
      href,
      external = false,
      description,
      appearance,
      size,
      children,
      className,
      target,
      rel,
      'aria-label': ariaLabel,
      ...rest
    },
    ref,
  ) => {
    const classes = reference({ appearance, size });
    const Component = (asChild ? Slot : href ? 'a' : 'span') as ElementType;
    const safeTarget = external ? '_blank' : target;
    const safeRel = safeTarget === '_blank' ? mergeBlankTargetRel(rel) : rel;
    const accessibleLabel = children ? undefined : buildLabel(index, label);

    return (
      <Component
        ref={ref}
        className={cx(classes.root, className)}
        href={href}
        target={safeTarget}
        rel={safeRel}
        aria-label={ariaLabel ?? accessibleLabel}
        {...rest}
      >
        {index ? (
          <span className={classes.marker} data-part="marker">
            [{index}]
          </span>
        ) : null}
        <span className={classes.label} data-part="label">
          {children ?? label}
        </span>
        {description ? (
          <span className={classes.description} data-part="description">
            {description}
          </span>
        ) : null}
      </Component>
    );
  },
);

Reference.displayName = 'Reference';
