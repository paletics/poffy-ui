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
      minWidth: 0,
      maxWidth: '{sizes.full}',
    },
    list: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.xs}',
      borderBottom: '1px solid',
      borderColor: 'layout.divider',
      position: 'relative',
      minWidth: 0,
      maxWidth: '{sizes.full}',
      overflowX: 'auto',
      overscrollBehaviorX: 'contain',
    },
    trigger: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minBlockSize: '{sizes.control.minimumTarget}',
      whiteSpace: 'nowrap',
      flexShrink: 0,
      px: '{spacing.base}',
      py: '{spacing.sm}',
      cursor: 'pointer',
      fontSize: 'md',
      fontWeight: 'medium',
      color: 'text.secondary',
      transitionProperty: 'color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      position: 'relative',
      zIndex: 0,
      _hover: {
        color: 'text.primary',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '-2px',
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
      insetInline: '0',
      bg: 'brand.main',
      pointerEvents: 'none',
    },
  },
  variants: {
    size: {
      sm: {
        trigger: { px: '{spacing.md}', py: '{spacing.xs}', fontSize: 'sm' },
      },
      md: {
        trigger: { px: '{spacing.base}', py: '{spacing.sm}', fontSize: 'md' },
      },
      lg: {
        trigger: { px: '{spacing.xl}', py: '{spacing.md}', fontSize: 'lg' },
      },
    },
    orientation: {
      horizontal: {},
      vertical: {
        root: {
          flexDirection: 'row',
          alignItems: 'stretch',
        },
        list: {
          flexDirection: 'column',
          alignItems: 'stretch',
          flexGrow: 0,
          flexShrink: 1,
          flexBasis: '{sizes.ratio.sm}',
          minInlineSize: '{sizes.control.minimumTarget}',
          maxInlineSize: 'min({sizes.ratio.sm}, 60%)',
          overflowX: 'hidden',
          overflowY: 'auto',
          borderBottom: '0',
          borderInlineEnd: '1px solid',
          borderInlineEndColor: 'layout.divider',
        },
        trigger: {
          width: '{sizes.full}',
          minInlineSize: 0,
          maxInlineSize: '{sizes.full}',
          flexShrink: 1,
          justifyContent: 'flex-start',
          textAlign: 'start',
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
        },
        content: {
          flex: '1',
          minWidth: 0,
          mt: 0,
        },
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
  compoundVariants: [
    {
      orientation: 'vertical',
      variant: 'line',
      css: {
        list: {
          borderBottom: 0,
        },
        indicator: {
          insetInlineStart: 'auto',
          insetInlineEnd: '-1px',
          top: 0,
          bottom: 0,
          width: '2px',
          height: 'auto',
        },
      },
    },
    {
      orientation: 'vertical',
      variant: 'enclosed',
      css: {
        trigger: {
          borderRadius: '{radii.md}',
          borderStartEndRadius: 0,
          borderEndEndRadius: 0,
          _selected: {
            borderBottomColor: 'layout.divider',
            borderInlineEndColor: 'layout.surface',
          },
        },
        indicator: {
          borderRadius: '{radii.md}',
          borderStartEndRadius: 0,
          borderEndEndRadius: 0,
          borderBottomColor: 'layout.divider',
          borderInlineEndColor: 'layout.surface',
        },
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    variant: 'line',
    orientation: 'horizontal',
  },
});
