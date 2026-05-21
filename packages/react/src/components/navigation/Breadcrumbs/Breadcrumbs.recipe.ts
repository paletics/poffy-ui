import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Breadcrumbs component suite.
 * Defines styles for the root container, item list, individual items, links, and separators.
 *
 * ### Variant Logic
 * - md: Default trail weighting. background: Emphasized section headers.
 */
export const breadcrumbsRecipe = defineSlotRecipe({
  className: 'breadcrumbs',
  description:
    'Breadcrumbs styling for navigation trail items, links, separators, and current page',
  slots: ['root', 'list', 'item', 'link', 'separator'],
  base: {
    root: {
      display: 'block',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      listStyle: 'none',
      p: '0',
      m: '0',
    },
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
    },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      fontSize: 'md',
      color: 'text.secondary',
      textDecoration: 'none',
      transitionProperty: 'color, background-color, text-decoration-color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _hover: {
        color: 'text.primary',
        textDecoration: 'underline',
      },
      _current: {
        color: 'text.primary',
        fontWeight: 'medium',
        textDecoration: 'none',
        pointerEvents: 'none',
      },
    },
    separator: {
      color: 'text.secondary',
      fontSize: 'md',
      opacity: '0.6',
    },
  },
  variants: {
    size: {
      sm: {
        link: { fontSize: 'xs' },
        list: { gap: '{spacing.xs}' },
        item: { gap: '{spacing.xs}' },
      },
      md: {
        link: { fontSize: 'md' },
        list: { gap: '{spacing.sm}' },
        item: { gap: '{spacing.sm}' },
      },
      lg: {
        link: { fontSize: 'lg' },
        list: { gap: '{spacing.md}' },
        item: { gap: '{spacing.md}' },
      },
    },
    variant: {
      plain: {},
      background: {
        root: {
          px: '{spacing.md}',
          py: '{spacing.xs}',
          bg: 'brand.surface',
          borderRadius: '{radii.md}',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'plain',
  },
});
