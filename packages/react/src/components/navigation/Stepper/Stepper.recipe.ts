import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Stepper component suite.
 * Defines styles for the root container, steps, indicators, separators, and step content.
 *
 * ### Variant Logic
 * - horizontal: Standard process flow. vertical: Detail-heavy step lists.
 */
export const stepperRecipe = defineSlotRecipe({
  className: 'stepper',
  description:
    'Stepper styling for progress steps, indicators, connectors, labels, and descriptions',
  slots: [
    'root',
    'item',
    'trigger',
    'indicator',
    'indicatorContent',
    'separator',
    'body',
    'title',
    'description',
    'content',
  ],
  base: {
    root: {
      display: 'flex',
      gap: '{spacing.lg}',
      width: '{sizes.full}',
      maxWidth: '{sizes.full}',
      minWidth: '0',
      boxSizing: 'border-box',
      '--stepper-indicator-size': '{sizes.silver.2}',
      '--stepper-accent': '{colors.brand.main}',
      '--stepper-accent-contrast': '{colors.brand.contrast}',
    },
    item: {
      display: 'flex',
      alignItems: 'center',
      flex: '1',
      minWidth: '0',
      position: 'relative',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      gap: '{spacing.md}',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      padding: '0',
      font: 'inherit',
      color: 'inherit',
      minWidth: '0',
      minHeight: '{sizes.control.minimumTarget}',
      '& > div:last-child': {
        minWidth: '0',
      },
      _disabled: {
        cursor: 'not-allowed',
        opacity: '0.6',
      },
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'var(--stepper-accent)',
        outlineOffset: '-2px',
        borderRadius: '{radii.sm}',
      },
    },
    indicator: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: '0',
      width: 'var(--stepper-indicator-size)',
      height: 'var(--stepper-indicator-size)',
      borderRadius: '{radii.full}',
      borderWidth: '2px',
      borderColor: '{colors.layout.divider}',
      color: '{colors.text.primary}',
      fontWeight: 'bold',
      transitionProperty: 'background-color, border-color, color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
      _motionPop: {
        transitionDuration: '{durations.standard}',
        transitionTimingFunction: '{easings.bounce}',
      },
      '&[data-state="active"]': {
        borderColor: 'var(--stepper-accent)',
        color: 'var(--stepper-accent)',
      },
      '&[data-state="completed"]': {
        borderColor: 'var(--stepper-accent)',
        bg: 'var(--stepper-accent)',
        color: 'var(--stepper-accent-contrast)',
      },
    },
    indicatorContent: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '{sizes.full}',
      height: '{sizes.full}',
      '& svg': {
        width: '60%',
        height: '60%',
      },
    },
    separator: {
      flex: '1',
      height: '2px',
      minWidth: '{spacing.2xl}',
      bg: '{colors.layout.divider}',
      mx: '{spacing.sm}',
      position: 'relative',
      overflow: 'hidden',
      _before: {
        content: '""',
        position: 'absolute',
        inset: '0',
        pointerEvents: 'none',
        bg: 'var(--stepper-accent)',
        transform: 'scaleX(0)',
        transformOrigin: 'left center',
        transitionProperty: 'transform',
        transitionDuration: '{durations.fast}',
        transitionTimingFunction: '{easings.soft}',
        _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
        _motionPop: {
          transitionDuration: '{durations.standard}',
          transitionTimingFunction: '{easings.bounce}',
        },
        _motionReduce: { transition: 'none' },
      },
      '&[data-state="completed"]::before': {
        transform: 'scaleX(1)',
      },
    },
    body: {
      minWidth: '0',
      overflow: 'hidden',
    },
    title: {
      fontSize: 'md',
      fontWeight: 'medium',
      color: '{colors.text.primary}',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    description: {
      fontSize: 'sm',
      color: '{colors.text.secondary}',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
    content: {
      mt: '{spacing.sm}',
    },
  },
  variants: {
    appearance: {
      soft: {},
      outline: {
        item: {
          borderWidth: '1px',
          borderStyle: 'solid',
          borderColor: '{colors.layout.divider}',
          borderRadius: '{radii.lg}',
          p: '{spacing.md}',
        },
      },
    },
    intent: {
      primary: {
        root: {
          '--stepper-accent': '{colors.brand.main}',
          '--stepper-accent-contrast': '{colors.brand.contrast}',
        },
      },
      secondary: {
        root: {
          '--stepper-accent': '{colors.variants.secondary.main}',
          '--stepper-accent-contrast': '{colors.variants.secondary.contrast}',
        },
      },
      success: {
        root: {
          '--stepper-accent': '{colors.variants.success.main}',
          '--stepper-accent-contrast': '{colors.variants.success.contrast}',
        },
      },
      warning: {
        root: {
          '--stepper-accent': '{colors.variants.warning.main}',
          '--stepper-accent-contrast': '{colors.variants.warning.contrast}',
        },
      },
      danger: {
        root: {
          '--stepper-accent': '{colors.variants.danger.main}',
          '--stepper-accent-contrast': '{colors.variants.danger.contrast}',
        },
      },
    },
    orientation: {
      horizontal: {
        root: {
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'nowrap',
          overflowX: 'auto',
          overscrollBehaviorX: 'contain',
          scrollPaddingInline: 'calc({focusRing.width} + {focusRing.offset})',
          '@container stepper (max-width: 30rem)': {
            flexDirection: 'column',
            alignItems: 'stretch',
            gap: '0',
            overflowX: 'visible',
          },
        },
        item: {
          flex: '0 0 auto',
          minInlineSize: 0,
          '@container stepper (max-width: 30rem)': {
            flex: '1 0 100%',
            flexDirection: 'column',
            alignItems: 'flex-start',
            inlineSize: '{sizes.full}',
            paddingBottom: '{spacing.xl}',
          },
        },
        trigger: {
          flexShrink: 0,
          minInlineSize: 0,
          '@container stepper (max-width: 30rem)': {
            alignItems: 'flex-start',
            inlineSize: '{sizes.full}',
          },
        },
        body: {
          minInlineSize: 0,
          maxInlineSize: '{sizes.ratio.sm}',
          overflow: 'visible',
          '@container stepper (max-width: 30rem)': {
            maxInlineSize: '{sizes.full}',
          },
        },
        title: {
          whiteSpace: 'normal',
          overflow: 'visible',
          textOverflow: 'clip',
          overflowWrap: 'anywhere',
        },
        description: {
          whiteSpace: 'normal',
          overflow: 'visible',
          textOverflow: 'clip',
          overflowWrap: 'anywhere',
        },
        separator: {
          flex: '0 0 {spacing.2xl}',
          height: '2px',
          width: '{spacing.2xl}',
          minWidth: 0,
          '&:dir(rtl)::before': {
            transformOrigin: 'right center',
          },
          '@container stepper (max-width: 30rem)': {
            width: '2px',
            height: 'auto',
            flex: 'none',
            minWidth: '0',
            minHeight: '0',
            marginInline: '0',
            position: 'absolute',
            top: 'var(--stepper-indicator-size)',
            bottom: '0',
            insetInlineStart: 'calc(var(--stepper-indicator-size) / 2 - 1px)',
            _before: {
              transform: 'scaleY(0)',
              transformOrigin: 'center top',
            },
            '&[data-state="completed"]::before': {
              transform: 'scaleY(1)',
            },
            '&[data-stepper-separator="manual"]:not([data-stepper-separator-placement="in-step"])':
              {
                position: 'relative',
                top: 'auto',
                bottom: 'auto',
                insetInlineStart: 'auto',
                alignSelf: 'flex-start',
                height: '{spacing.xl}',
                minHeight: '{spacing.xl}',
                marginInlineStart: 'calc(var(--stepper-indicator-size) / 2 - 1px)',
              },
          },
        },
      },
      vertical: {
        root: { flexDirection: 'column', alignItems: 'stretch', gap: '0' },
        item: {
          flexDirection: 'column',
          alignItems: 'flex-start',
          width: '{sizes.full}',
          pb: '{spacing.xl}',
        },
        trigger: { alignItems: 'flex-start' },
        separator: {
          width: '2px',
          height: 'auto',
          flex: 'none',
          minWidth: '0',
          minHeight: '0',
          mx: '0',
          position: 'absolute',
          top: 'var(--stepper-indicator-size)',
          bottom: '0',
          insetInlineStart: 'calc(var(--stepper-indicator-size) / 2 - 1px)',
          _before: {
            transform: 'scaleY(0)',
            transformOrigin: 'center top',
          },
          '&[data-state="completed"]::before': {
            transform: 'scaleY(1)',
          },
          '&[data-stepper-separator="manual"]:not([data-stepper-separator-placement="in-step"])': {
            position: 'relative',
            top: 'auto',
            bottom: 'auto',
            insetInlineStart: 'auto',
            alignSelf: 'flex-start',
            height: '{spacing.xl}',
            minHeight: '{spacing.xl}',
            marginInlineStart: 'calc(var(--stepper-indicator-size) / 2 - 1px)',
          },
        },
        body: {
          minWidth: '0',
          maxWidth: '{sizes.full}',
          overflow: 'visible',
        },
        title: {
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          overflow: 'visible',
        },
        description: {
          whiteSpace: 'normal',
          overflowWrap: 'anywhere',
          overflow: 'visible',
        },
        content: {
          marginInlineStart: 'calc(var(--stepper-indicator-size) + {spacing.md})',
        },
      },
    },
    size: {
      sm: {
        root: { '--stepper-indicator-size': '{sizes.root.1}' },
        indicator: { fontSize: '2xs' },
        title: { fontSize: 'xs' },
        description: { fontSize: 'xs' },
      },
      md: {
        root: { '--stepper-indicator-size': '{sizes.silver.2}' },
        indicator: { fontSize: 'sm' },
        title: { fontSize: 'md' },
        description: { fontSize: 'sm' },
      },
      lg: {
        root: { '--stepper-indicator-size': '{sizes.root.2}' },
        indicator: { fontSize: 'md' },
        title: { fontSize: 'lg' },
        description: { fontSize: 'md' },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    intent: 'primary',
    orientation: 'horizontal',
    size: 'md',
  },
});
