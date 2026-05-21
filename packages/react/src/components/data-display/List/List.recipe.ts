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
      gap: '{spacing.xs}',
      m: '0',
      p: '0',
      listStyle: 'none',
    },
    item: {
      display: 'flex',
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
      minWidth: '0',
      display: 'flex',
      flexDirection: 'column',
    },
    primary: {
      fontWeight: 'medium',
      color: 'text.primary',
    },
    secondary: {
      fontSize: 'sm',
      color: 'text.secondary',
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
          pl: '{spacing.xl}',
        },
        item: {
          display: 'list-item',
          p: '0',
        },
      },
      ordered: {
        root: {
          listStyle: 'decimal',
          pl: '{spacing.xl}',
        },
        item: {
          display: 'list-item',
          p: '0',
        },
      },
      menu: {
        item: {
          cursor: 'pointer',
          transition: 'background-color 0.2s',
          _hover: {
            bg: 'brand.tint',
          },
        },
      },
    },
  },
});
