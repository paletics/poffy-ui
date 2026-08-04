import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles for compact source and reference links.
 * Tier: Molecules, Engine: Panda CSS.
 */
export const referenceRecipe = defineSlotRecipe({
  className: 'reference',
  description: 'Reference styling for citation links and reference list containers',
  slots: ['root', 'marker', 'label', 'description', 'list'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      minW: 0,
      minH: '{sizes.control.minimumTarget}',
      gap: '{spacing.xs}',
      maxWidth: '100%',
      borderRadius: '{radii.md}',
      color: '{colors.brand.main}',
      fontWeight: 'medium',
      lineHeight: 'snug',
      textDecoration: 'none',
      verticalAlign: 'baseline',
      transitionProperty: 'background-color, color, opacity, border-color, box-shadow',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.default}',
      _motionSubtle: {
        transitionDuration: '{durations.ultraFast}',
        transitionTimingFunction: '{easings.soft}',
      },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      _hover: {
        color: '{colors.brand.hover}',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: '{colors.brand.main}',
        outlineOffset: '2px',
      },
    },
    marker: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minW: '{sizes.root.1}',
      h: '{sizes.root.1}',
      px: '{spacing.2xs}',
      borderRadius: '{radii.full}',
      border: '1px solid',
      borderColor: 'color-mix(in srgb, {colors.brand.main} 24%, transparent)',
      bg: 'color-mix(in srgb, {colors.brand.surface} 82%, {colors.layout.surface})',
      color: '{colors.brand.main}',
      fontSize: 'xs',
      fontWeight: 'semibold',
      lineHeight: 1,
      flexShrink: 0,
    },
    label: {
      minW: 0,
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    description: {
      minW: 0,
      paddingInlineStart: '{spacing.xs}',
      borderInlineStart: '1px solid',
      borderColor: '{colors.layout.divider}',
      color: '{colors.text.secondary}',
      fontSize: 'sm',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    list: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '{spacing.xs}',
      alignItems: 'center',
    },
  },
  variants: {
    appearance: {
      plain: {
        root: {
          px: 0,
          _hover: {
            '& [data-part=label]': {
              textDecoration: 'underline',
              textUnderlineOffset: '3px',
            },
          },
        },
      },
      soft: {
        root: {
          px: '{spacing.sm}',
          py: '{spacing.xs}',
          bg: 'color-mix(in srgb, {colors.brand.surface} 44%, {colors.layout.surface})',
          border: '1px solid',
          borderColor: 'color-mix(in srgb, {colors.brand.main} 22%, {colors.layout.divider})',
          boxShadow: '{shadows.xs}',
          _hover: {
            bg: 'color-mix(in srgb, {colors.brand.surface} 76%, {colors.layout.surface})',
            borderColor: 'color-mix(in srgb, {colors.brand.main} 42%, {colors.layout.divider})',
          },
        },
      },
    },
    size: {
      sm: {
        root: { gap: '{spacing.2xs}', minH: '{sizes.silver.2}', fontSize: 'sm' },
        marker: { minW: '{sizes.silver.1}', h: '{sizes.silver.1}', fontSize: '2xs' },
        description: { fontSize: 'xs' },
      },
      md: {
        root: { fontSize: 'md' },
      },
    },
    overflow: {
      truncate: {},
      wrap: {
        root: {
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr)',
          alignItems: 'start',
          width: '100%',
          '&[data-has-marker]': {
            gridTemplateColumns: 'max-content minmax(0, 1fr)',
          },
        },
        marker: {
          gridColumn: '1',
          gridRow: '1',
        },
        label: {
          gridColumn: '1',
          gridRow: '1',
          overflow: 'visible',
          overflowWrap: 'break-word',
          textOverflow: 'clip',
          whiteSpace: 'normal',
        },
        description: {
          gridColumn: '1',
          gridRow: '2',
          paddingInlineStart: 0,
          borderInlineStart: 0,
          overflow: 'visible',
          overflowWrap: 'break-word',
          textOverflow: 'clip',
          whiteSpace: 'normal',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'plain',
    size: 'md',
    overflow: 'truncate',
  },
  compoundVariants: [
    {
      overflow: 'wrap',
      css: {
        root: {
          '&[data-has-marker] [data-part=label]': {
            gridColumn: '2',
          },
          '&[data-has-marker] [data-part=description]': {
            gridColumn: '2',
          },
        },
      },
    },
  ],
});
