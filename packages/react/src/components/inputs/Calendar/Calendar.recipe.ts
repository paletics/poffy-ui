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
      p: '{spacing.md}',
      bg: '{colors.brand.surface}',
      borderRadius: '{radii.md}',
      borderWidth: '1px',
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
      gridTemplateColumns: '1fr auto 1fr',
      alignItems: 'center',
      mb: '{spacing.md}',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    headerRight: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: '{spacing.xs}',
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
      transition: 'all {durations.fast}',
      _hover: {
        bg: '{colors.brand.tint}',
        color: '{colors.text.primary}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '2px',
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
      fontWeight: 'semibold',
      fontSize: 'md',
    },
    table: {
      width: '100%',
      tableLayout: 'fixed',
      borderCollapse: 'collapse',
      borderSpacing: '0',
    },
    headCell: {
      color: '{colors.text.secondary}',
      fontSize: 'md',
      fontWeight: 'medium',
      textAlign: 'center',
      pb: '{spacing.xs}',
    },
    cell: {
      p: '0',
      textAlign: 'center',
      position: 'relative',
      zIndex: 1,
      '&[data-range-middle]': {
        bg: '{colors.brand.tint}',
      },
      '&[data-range-start]': {
        _before: {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '50%',
          bg: '{colors.brand.tint}',
          zIndex: -1,
        },
      },
      '&[data-range-end]': {
        _before: {
          content: '""',
          position: 'absolute',
          top: '0',
          left: '0',
          bottom: '0',
          right: '50%',
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
      transition: 'all {durations.fast}',
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
    },
    todayButton: {
      fontSize: 'sm',
      fontWeight: 'medium',
      color: '{colors.brand.main}',
      cursor: 'pointer',
      px: '{spacing.xs}',
      py: '{spacing.2xs}',
      borderRadius: '{radii.sm}',
      _hover: {
        bg: '{colors.brand.tint}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '2px',
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
          p: '{spacing.sm}',
          minW: 'calc(7 * {sizes.root.1} + 14 * {spacing.2xs} + 2 * {spacing.sm})',
        },
        dayButton: { w: '{sizes.root.1}', h: '{sizes.root.1}', fontSize: 'sm', mx: 'auto' },
        headCell: {},
        cell: { p: '{spacing.2xs}' },
      },
      md: {
        root: {
          minW: 'calc(7 * {sizes.silver.2} + 14 * {spacing.xs} + 2 * {spacing.md})',
        },
        dayButton: { w: '{sizes.silver.2}', h: '{sizes.silver.2}', mx: 'auto' },
        headCell: {},
        cell: { p: '{spacing.xs}' },
      },
    },
  },
});
