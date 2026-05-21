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
      _last: {
        flex: '0',
      },
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
        outlineOffset: '2px',
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
      transitionProperty: 'background-color',
      transitionDuration: '{durations.fast}',
      transitionTimingFunction: '{easings.soft}',
      '&[data-state="completed"]': {
        bg: 'var(--stepper-accent)',
      },
    },
    body: {
      minWidth: '0',
    },
    title: {
      fontSize: 'md',
      fontWeight: 'medium',
      color: '{colors.text.primary}',
      whiteSpace: 'nowrap',
    },
    description: {
      fontSize: '2xs',
      color: '{colors.text.secondary}',
      whiteSpace: 'nowrap',
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
        root: { flexDirection: 'row', alignItems: 'center' },
        item: { flexDirection: 'row', alignItems: 'center' },
        trigger: { flexShrink: '0' },
        separator: { height: '2px', width: 'auto' },
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
          left: 'calc(var(--stepper-indicator-size) / 2)',
          transform: 'translateX(-50%)',
        },
        content: {
          ml: 'calc(var(--stepper-indicator-size) + {spacing.md})',
        },
      },
    },
    size: {
      sm: {
        root: { '--stepper-indicator-size': '{sizes.root.1}' },
        indicator: { fontSize: '2xs' },
        title: { fontSize: '2xs' },
        description: { fontSize: '2xs' },
      },
      md: {
        root: { '--stepper-indicator-size': '{sizes.silver.2}' },
        indicator: { fontSize: 'md' },
        title: { fontSize: 'md' },
        description: { fontSize: '2xs' },
      },
      lg: {
        root: { '--stepper-indicator-size': '{sizes.root.2}' },
        indicator: { fontSize: 'lg' },
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
