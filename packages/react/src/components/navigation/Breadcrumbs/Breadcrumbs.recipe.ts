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
      boxSizing: 'border-box',
      maxWidth: '{sizes.full}',
      minWidth: 0,
      containerType: 'inline-size',
      containerName: 'breadcrumbs',
      overflowX: 'auto',
      overflowY: 'hidden',
      overscrollBehaviorX: 'contain',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      listStyle: 'none',
      p: '0',
      m: '0',
      width: 'max-content',
      minWidth: '{sizes.full}',
    },
    item: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '{spacing.sm}',
      flexShrink: 0,
    },
    link: {
      display: 'inline-flex',
      alignItems: 'center',
      minBlockSize: '{sizes.control.minimumTarget}',
      px: '{spacing.xs}',
      gap: '{spacing.xs}',
      whiteSpace: 'nowrap',
      fontSize: 'md',
      color: 'text.secondary',
      textDecoration: 'none',
      transitionProperty: 'color, background-color, text-decoration-color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      _hover: {
        color: 'text.primary',
        textDecoration: 'underline',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '-2px',
      },
      _current: {
        boxSizing: 'border-box',
        color: 'text.primary',
        fontWeight: 'medium',
        textDecoration: 'none',
        pointerEvents: 'none',
        maxInlineSize: '100cqi',
        whiteSpace: 'normal',
        overflowWrap: 'anywhere',
      },
    },
    separator: {
      flexShrink: 0,
      color: 'text.secondary',
      fontSize: 'md',
      opacity: '0.6',
    },
  },
  variants: {
    size: {
      sm: {
        link: { fontSize: 'sm', px: '{spacing.2xs}' },
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
