import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Collapsible component slots.
 */
export const collapsibleRecipe = defineSlotRecipe({
  className: 'collapsible',
  description: 'Single disclosure surface with trigger, indicator, and collapsible content',
  slots: ['root', 'trigger', 'indicator', 'content'],
  base: {
    root: {
      width: '100%',
      minWidth: '0',
      display: 'flex',
      flexDirection: 'column',
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minWidth: '0',
      px: '{spacing.base}',
      py: '{spacing.sm}',
      borderWidth: '0',
      bg: 'transparent',
      color: 'text.primary',
      cursor: 'pointer',
      fontWeight: 'medium',
      overflowWrap: 'anywhere',
      textAlign: 'start',
      transition: 'all {durations.standard} {easings.default}',
      _motionSubtle: { transition: 'all {durations.fast} {easings.soft}' },
      _motionPop: { transition: 'all {durations.complex} {easings.bounce}' },
      _hover: { bg: 'brand.surface' },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
        zIndex: 1,
      },
      _disabled: { cursor: 'not-allowed', opacity: 0.5 },
    },
    indicator: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      color: 'text.secondary',
      transition: 'transform {durations.standard} {easings.snappy}',
      _motionSubtle: { transition: 'transform {durations.fast} {easings.soft}' },
      _motionPop: { transition: 'transform {durations.standard} {easings.bounce}' },
      _open: { transform: 'rotate(180deg)' },
    },
    content: {
      width: '100%',
      minWidth: '0',
      color: 'text.secondary',
      overflowWrap: 'anywhere',
      px: '{spacing.base}',
      pt: 'calc({focusRing.width} + {focusRing.offset})',
      pb: '{spacing.base}',
    },
  },
  variants: {
    appearance: {
      soft: {
        root: {
          bg: 'layout.surface',
          borderWidth: '1px',
          borderColor: 'layout.divider',
          borderRadius: '{radii.lg}',
          overflow: 'hidden',
        },
      },
      outline: {
        root: {
          borderWidth: '1px',
          borderColor: 'layout.divider',
          borderRadius: '{radii.lg}',
          overflow: 'hidden',
        },
      },
      ghost: {
        trigger: {
          px: '0',
          _hover: {
            bg: 'transparent',
            color: 'brand.main',
          },
        },
        content: {
          px: '0',
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
  },
});
