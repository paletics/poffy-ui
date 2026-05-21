import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Tabs component suite.
 * Defines styles for the root container, tab list, triggers, content panels, and active indicator.
 *
 * ### Variant Logic
 * - line: Traditional underlined style. enclosed: Boxed style. pill: Rounded button style.
 */
export const tabsRecipe = defineSlotRecipe({
  className: 'tabs',
  description: 'Tabs styling for root, list, trigger, panel, and indicator slots',
  slots: ['root', 'list', 'trigger', 'content', 'indicator'],
  base: {
    root: {
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.sm}',
      width: '{sizes.full}',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      borderBottom: '1px solid',
      borderColor: 'layout.divider',
      position: 'relative',
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      whiteSpace: 'nowrap',
      px: '{spacing.base}',
      py: '{spacing.sm}',
      cursor: 'pointer',
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'text.secondary',
      transitionProperty: 'color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      position: 'relative',
      zIndex: 0,
      _hover: {
        color: 'text.primary',
      },
      _selected: {
        color: 'brand.main',
        fontWeight: 'semibold',
      },
      _disabled: {
        opacity: '0.5',
        cursor: 'not-allowed',
      },
    },
    content: {
      mt: '{spacing.sm}',
      _hidden: {
        display: 'none',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '2px',
      },
    },
    indicator: {
      position: 'absolute',
      zIndex: -1,
      left: '0',
      right: '0',
      bg: 'brand.main',
      pointerEvents: 'none',
    },
  },
  variants: {
    size: {
      sm: {
        trigger: { px: '{spacing.md}', py: '{spacing.xs}', fontSize: '2xs' },
      },
      md: {
        trigger: { px: '{spacing.base}', py: '{spacing.sm}', fontSize: 'md' },
      },
      lg: {
        trigger: { px: '{spacing.xl}', py: '{spacing.md}', fontSize: 'lg' },
      },
    },
    variant: {
      line: {
        list: { borderBottom: '1px solid' },
        trigger: {
          _selected: {
            color: 'brand.main',
          },
        },
        indicator: {
          zIndex: 0,
          bottom: '-1px',
          height: '2px',
        },
      },
      enclosed: {
        list: { gap: '{spacing.2xs}' },
        trigger: {
          borderTopRadius: 'md',
          border: '1px solid',
          borderColor: 'transparent',
          _selected: {
            borderColor: 'layout.divider',
            borderBottomColor: 'layout.surface',
            bg: 'layout.surface',
            color: 'text.primary',
          },
        },
        indicator: {
          inset: 0,
          bg: 'layout.surface',
          borderTopRadius: 'md',
          borderWidth: '1px',
          borderColor: 'layout.divider',
          borderBottomColor: 'layout.surface',
        },
      },
      pill: {
        list: { gap: '{spacing.sm}' },
        trigger: {
          borderRadius: '{radii.full}',
          px: '{spacing.base}',
          _selected: {
            color: 'brand.contrast',
          },
        },
        indicator: {
          inset: 0,
          borderRadius: '{radii.full}',
        },
      },
    },
  },
  defaultVariants: {
    size: 'md',
    variant: 'line',
  },
});
