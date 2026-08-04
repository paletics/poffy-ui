import { defineRecipe } from '@pandacss/dev';

export const kbdRecipe = defineRecipe({
  className: 'kbd',
  description: 'Keyboard shortcut key styling',
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '{spacing.lg}',
    maxInlineSize: '100%',
    height: '{spacing.lg}',
    paddingX: '{spacing.xs}',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: '{colors.layout.divider}',
    borderRadius: '{radii.xs}',
    backgroundColor: '{colors.layout.surface}',
    color: '{colors.text.primary}',
    boxShadow: 'inset 0 -1px 0 {colors.layout.divider}',
    fontFamily: 'mono',
    fontSize: '{fontSizes.xs}',
    fontWeight: 'medium',
    lineHeight: '1',
    whiteSpace: 'nowrap',
    '& [data-kbd-label]': {
      display: 'block',
      flex: '1 1 auto',
      minWidth: 0,
      maxInlineSize: '100%',
    },
  },
  variants: {
    size: {
      sm: {
        minWidth: '{spacing.md}',
        // `spacing.md` is shorter than the xs glyph box. Keep the compact
        // width, but use the next vertical step so ascenders and descenders
        // are not clipped.
        height: '{spacing.lg}',
        fontSize: '{fontSizes.xs}',
      },
      md: {},
      lg: {
        minWidth: '{spacing.xl}',
        height: '{spacing.xl}',
        paddingX: '{spacing.sm}',
        fontSize: '{fontSizes.sm}',
      },
    },
    overflow: {
      truncate: {
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        '& [data-kbd-label]': {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        },
      },
      wrap: {
        height: 'auto',
        minHeight: '{spacing.lg}',
        whiteSpace: 'normal',
        '& [data-kbd-label]': {
          overflowWrap: 'break-word',
          whiteSpace: 'normal',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    overflow: 'truncate',
  },
});
