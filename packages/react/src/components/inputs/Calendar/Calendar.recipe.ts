import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Calendar component slots with Panda CSS recipe variants.
 */
export const calendarRecipe = defineSlotRecipe({
  className: 'calendar',
  description: 'Calendar styling for grid, navigation, day cells, and selection states',
  slots: [
    'root',
    'header',
    'headerLeft',
    'headerRight',
    'navButton',
    'title',
    'table',
    'head',
    'headRow',
    'headCell',
    'body',
    'row',
    'cell',
    'dayButton',
    'selectContainer',
    'todayButton',
  ],
  base: {
    root: {
      display: 'inline-block',
      containerName: 'calendar',
      containerType: 'inline-size',
      maxWidth: '100%',
      minWidth: '0',
      boxSizing: 'border-box',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
      p: '{spacing.md}',
      bg: '{colors.brand.surface}',
      borderRadius: '{radii.md}',
      borderWidth: '{borderWidths.thin}',
      borderColor: '{colors.brand.border}',
      boxShadow: '{shadows.sm}',
      color: '{colors.text.primary}',
      _disabled: {
        opacity: 0.6,
        pointerEvents: 'none',
        userSelect: 'none',
      },
    },
    header: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
      minInlineSize: 'var(--calendar-content-min-inline-size)',
      alignItems: 'center',
      mb: '{spacing.md}',
      '@container calendar (max-width: 12rem)': {
        gridTemplateAreas: '"title title" "previous actions"',
        gridTemplateColumns: 'auto minmax(0, 1fr)',
        minInlineSize: 'calc(7 * {sizes.control.minimumTarget})',
        rowGap: '{spacing.xs}',
      },
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      '@container calendar (max-width: 12rem)': {
        gridArea: 'previous',
      },
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '{spacing.xs}',
      '@container calendar (max-width: 12rem)': {
        gridArea: 'actions',
        minInlineSize: 0,
        maxInlineSize: '100%',
        flexWrap: 'nowrap',
      },
    },
    navButton: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '{radii.md}',
      width: '{sizes.silver.2}',
      height: '{sizes.silver.2}',
      color: '{colors.text.secondary}',
      cursor: 'pointer',
      scrollMarginInline: 'calc({focusRing.width} + {focusRing.offset})',
      transition: 'all {durations.fast}',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      _hover: {
        bg: '{colors.brand.tint}',
        color: '{colors.text.primary}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
      },
      _active: {
        transform: 'scale(0.97)',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
    title: {
      minWidth: '0',
      fontWeight: 'semibold',
      fontSize: 'md',
    },
    table: {
      width: '100%',
      minInlineSize: 'var(--calendar-content-min-inline-size)',
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      borderSpacing: '0',
      '@container calendar (max-width: 12rem)': {
        minInlineSize: 'calc(7 * {sizes.control.minimumTarget})',
      },
    },
    headCell: {
      color: '{colors.text.secondary}',
      fontSize: 'md',
      fontWeight: 'medium',
      textAlign: 'center',
      pb: '{spacing.xs}',
      '@container calendar (max-width: 12rem)': {
        overflow: 'hidden',
        fontSize: 'xs',
      },
    },
    cell: {
      p: '0',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
      '@container calendar (max-width: 12rem)': {
        p: '0',
      },
      '&[data-range-middle]': {
        bg: '{colors.brand.tint}',
      },
      '&[data-range-start]': {
        _before: {
          content: '""',
          position: 'absolute',
          insetBlock: '0',
          insetInlineStart: '50%',
          insetInlineEnd: '0',
          bg: '{colors.brand.tint}',
          zIndex: -1,
        },
      },
      '&[data-range-end]': {
        _before: {
          content: '""',
          position: 'absolute',
          insetBlock: '0',
          insetInlineStart: '0',
          insetInlineEnd: '50%',
          bg: '{colors.brand.tint}',
          zIndex: -1,
        },
      },
    },
    dayButton: {
      borderRadius: '{radii.md}',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 'md',
      cursor: 'pointer',
      scrollMarginInline: 'calc({focusRing.width} + {focusRing.offset})',
      transition: 'all {durations.fast}',
      _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
      color: '{colors.text.primary}',
      width: '100%',
      height: '100%',
      _hover: {
        bg: '{colors.brand.tint}',
      },
      '&[data-range-middle]': {
        _hover: {
          bg: '{colors.brand.tint}',
        },
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
      },
      _active: {
        transform: 'scale(0.95)',
      },
      _selected: {
        bg: '{colors.brand.main}',
        color: '{colors.brand.contrast}',
        borderRadius: '{radii.md}',
        _hover: {
          bg: '{colors.brand.main}',
        },
      },
      '&[data-today]': {
        color: '{colors.brand.main}',
        fontWeight: 'bold',
        position: 'relative',
        _after: {
          content: '""',
          position: 'absolute',
          bottom: '{spacing.2xs}',
          width: '{spacing.2xs}',
          height: '{spacing.2xs}',
          borderRadius: '{radii.full}',
          bg: '{colors.brand.main}',
        },
      },
      '&[data-today][data-selected]': {
        color: '{colors.brand.contrast}',
        _after: {
          bg: '{colors.brand.contrast}',
        },
      },
      '&[data-outside]': {
        color: '{colors.text.secondary}',
        pointerEvents: 'none',
      },
      _disabled: {
        opacity: 0.4,
        cursor: 'not-allowed',
      },
    },
    selectContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      '@container calendar (max-width: 12rem)': {
        gridArea: 'title',
        minInlineSize: 0,
        maxInlineSize: '100%',
        flexWrap: 'wrap',
        justifyContent: 'center',
        '& > *': {
          minInlineSize: 0,
          maxInlineSize: '100%',
        },
      },
    },
    todayButton: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: '{colors.brand.main}',
      cursor: 'pointer',
      px: '{spacing.xs}',
      py: '{spacing.2xs}',
      borderRadius: '{radii.sm}',
      '@container calendar (max-width: 12rem)': {
        minInlineSize: '{sizes.control.minimumTarget}',
        maxInlineSize: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      },
      _hover: {
        bg: '{colors.brand.tint}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
      },
      _active: {
        transform: 'scale(0.95)',
      },
    },
  },
  defaultVariants: {
    size: 'md',
  },
  variants: {
    size: {
      sm: {
        root: {
          '--calendar-content-min-inline-size':
            'calc(7 * {sizes.control.minimumTarget} + 14 * {spacing.2xs})',
          p: '{spacing.sm}',
          width:
            'calc(7 * {sizes.control.minimumTarget} + 14 * {spacing.2xs} + 2 * {spacing.sm} + {borderWidths.thin} + {borderWidths.thin})',
        },
        header: {
          gridTemplateAreas: '"title title title" "previous today next"',
          gridTemplateColumns: 'auto minmax(0, 1fr) auto',
          rowGap: '{spacing.xs}',
        },
        headerLeft: {
          gridArea: 'previous',
        },
        headerRight: {
          display: 'contents',
        },
        selectContainer: {
          gridArea: 'title',
          justifyContent: 'center',
        },
        todayButton: {
          gridArea: 'today',
          justifySelf: 'center',
        },
        navButton: {
          '&[data-calendar-navigation-position="previous"]': {
            gridArea: 'previous',
          },
          '&[data-calendar-navigation-position="next"]': {
            gridArea: 'next',
          },
        },
        dayButton: {
          inlineSize: '{sizes.control.minimumTarget}',
          minInlineSize: '{sizes.control.minimumTarget}',
          minBlockSize: '{sizes.control.minimumTarget}',
          aspectRatio: '1',
          fontSize: 'sm',
          mx: 'auto',
        },
        headCell: {},
        cell: { p: '{spacing.2xs}' },
      },
      md: {
        root: {
          '--calendar-content-min-inline-size': 'calc(7 * {sizes.silver.2} + 14 * {spacing.xs})',
          width:
            'calc(7 * {sizes.silver.2} + 14 * {spacing.xs} + 2 * {spacing.md} + {borderWidths.thin} + {borderWidths.thin})',
        },
        dayButton: {
          minInlineSize: '{sizes.control.minimumTarget}',
          minBlockSize: '{sizes.control.minimumTarget}',
          maxW: '{sizes.silver.2}',
          aspectRatio: '1',
          mx: 'auto',
        },
        headCell: {},
        cell: { p: '{spacing.xs}' },
      },
    },
  },
});
