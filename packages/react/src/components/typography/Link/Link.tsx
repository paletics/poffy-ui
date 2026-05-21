import { cx } from '@/styled-system/css';
import { link } from '@/styled-system/recipes';
import { Slot } from '@radix-ui/react-slot';
import { forwardRef } from 'react';
import type { LinkProps } from './Link.types';

/**
 * Polymorphic anchor component for navigational links.
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: link), Radix Slot
 * ### Design Tokens
 * - colors: brand.main / danger / success semantic tokens
 * ### Variant Logic
 * - underline: persistent decoration for inline body links. hover: subtle for nav contexts. plain: least intrusive.
 * @example
 * ```tsx
 * <Link href="/docs">Documentation</Link>
 * <Link href="https://example.com" target="_blank">External Site</Link>
 * <Link asChild variant="plain"><NextLink href="/about">About</NextLink></Link>
 * ```
 * ### Notes
 * `rel="noopener noreferrer"` is automatically merged whenever `target="_blank"` is present,
 *          regardless of how it was set — via prop, `external`, or spread. The consumer's explicit
 *          `rel` value is preserved and the security tokens are appended only if not already included.
 * ### Notes
 * **`external` takes precedence over `target`** — passing both `external={true}` and
 *          `target="_self"` will result in `target="_blank"`. Use `target` directly (without `external`)
 *          when you need explicit control over the target value.
 * ### Accessibility
 * - Inherits native <a> semantics. Use aria-label when link text is non-descriptive (e.g. "click here").
 * ### AI Usage
 * - Use for any navigational or inline hyperlink. Use asChild with Next.js Link.
 */
export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  (
    { variant, colorScheme, external = false, asChild = false, className, children, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : 'a';

    // Merge target: external shorthand sets _blank, but consumer's explicit target wins after spread.
    const target = external ? '_blank' : props.target;

    // Automatically enforce noopener noreferrer for any _blank target to prevent reverse tabnapping.
    // Preserve any consumer-provided rel values and only append the missing tokens.
    let rel = props.rel ?? '';
    if (target === '_blank') {
      if (!rel.includes('noopener')) rel = `${rel} noopener`.trimStart();
      if (!rel.includes('noreferrer')) rel = `${rel} noreferrer`.trimStart();
    }

    return (
      <Component
        ref={ref}
        className={cx(link({ variant, colorScheme }), className)}
        {...props}
        target={target}
        rel={rel === '' ? undefined : rel}
      >
        {children}
      </Component>
    );
  },
);

Link.displayName = 'Link';
