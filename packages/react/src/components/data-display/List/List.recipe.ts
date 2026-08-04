import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the List component slots with Panda CSS recipe variants.
 */
export const listRecipe = defineSlotRecipe({
  className: 'list',
  description: 'List styling for root, item, icon, title, description, and action slots',
  slots: ['root', 'item', 'icon', 'text', 'marker', 'primary', 'secondary'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      minInlineSize: 0,
      gap: '{spacing.xs}',
      m: '0',
      p: '0',
      listStyle: 'none',
    },
    item: {
      display: 'flex',
      minInlineSize: 0,
      alignItems: 'center',
      gap: '{spacing.md}',
      p: '{spacing.sm}',
      borderRadius: '{radii.md}',
      color: 'text.primary',
      fontSize: 'md',
      lineHeight: 'normal',
    },
    icon: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'text.secondary',
      flexShrink: '0',
      width: '{sizes.root.1}',
      height: '{sizes.root.1}',
    },
    text: {
      flex: '1',
      minInlineSize: 0,
      display: 'flex',
      flexDirection: 'column',
    },
    primary: {
      minInlineSize: 0,
      fontWeight: 'medium',
      color: 'text.primary',
      overflowWrap: 'anywhere',
    },
    secondary: {
      minInlineSize: 0,
      fontSize: 'sm',
      color: 'text.secondary',
      overflowWrap: 'anywhere',
    },
    marker: {
      color: 'text.secondary',
    },
  },
  defaultVariants: {
    variant: 'plain',
  },
  variants: {
    variant: {
      plain: {},
      marker: {
        root: {
          listStyle: 'disc',
          paddingInlineStart: '{spacing.xl}',
        },
        item: {
          display: 'list-item',
          p: '0',
        },
      },
      ordered: {
        root: {
          listStyle: 'decimal',
          paddingInlineStart: '{spacing.xl}',
        },
        item: {
          display: 'list-item',
          p: '0',
        },
      },
      menu: {
        item: {
          transition: 'background-color 0.2s',
          _motionSubtle: { transition: 'background-color {durations.ultraFast} {easings.soft}' },
          _motionPop: { transition: 'background-color {durations.standard} {easings.bounce}' },
          _hover: {
            bg: 'brand.tint',
          },
        },
      },
    },
  },
});
