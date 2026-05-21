import { LinkVariantProps } from '@/styled-system/recipes';
import { PrimitiveProps } from '@poffy-ui/types';

/**
 * Specific properties for the Link component.
 *
 * @example
 * ```tsx
 * import { Link } from '@poffy-ui/react/typography';
 * ```
 *
 * ### Notes
 * Link is for navigation and external references. Use buttons for in-page actions
 * that do not navigate. When opening a new tab, security `rel` tokens are appended
 * automatically.
 *
 * ### AI Usage
 * - Do: provide meaningful link text or an `aria-label`.
 * - Don't: use Link as a button for dialogs, menus, or mutations.
 *
 * ### AI Context & Architecture
 * - Tier: Atoms, Stack: Panda CSS (Recipe: link), Radix Slot
 * - `JsxStyleProps` is intentionally omitted. `<Link>` maps to a native `<a>` element
 *             whose visual contract is fully defined by the recipe (color, underline, hover).
 *             Ad-hoc style overrides would break design system guarantees for link legibility
 *             and interactive state consistency. Use `asChild` with a wrapper element instead.
 */
export interface LinkOwnProps extends LinkVariantProps {
  /**
   * Shorthand to open the link in a new tab.
   * Automatically sets `target="_blank"` and appends `noopener noreferrer` to `rel`.
   *
   * @defaultValue `false`
   * Related: Link component JSDoc for full security behavior.
   */
  external?: boolean;
}

/**
 * Public props for Link.
 *
 * ### Notes
 * Supports `asChild` for router integration while preserving Poffy link styles.
 */
export type LinkProps = PrimitiveProps<'a', LinkOwnProps>;
