import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Accordion component slots with Panda CSS recipe variants.
 */
export const accordionRecipe = defineSlotRecipe({
  className: 'accordion',
  description: 'Accordion styling for root, item, trigger, indicator, and content slots',
  slots: ['root', 'item', 'trigger', 'content', 'indicator'],
  base: {
    root: {
      width: '100%',
      maxWidth: '100%',
      minWidth: '0',
      display: 'flex',
      flexDirection: 'column',
    },
    item: {
      width: '100%',
      minWidth: '0',
      overflow: 'hidden',
      borderBlockEndWidth: '1px',
      borderColor: 'layout.divider',
      _last: { borderBlockEndWidth: '0' },
    },
    trigger: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
      minWidth: '0',
      px: '{spacing.base}',
      py: '{spacing.sm}',
      cursor: 'pointer',
      bg: 'transparent',
      fontWeight: 'bold',
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
        root: { gap: '{spacing.md}' },
        item: {
          bg: 'layout.surface',
          borderWidth: '1px',
          borderColor: 'layout.divider',
          borderRadius: '{radii.lg}',
        },
      },
      outline: {
        root: {
          borderWidth: '1px',
          borderColor: 'layout.divider',
          borderRadius: '{radii.lg}',
          overflow: 'hidden',
        },
        item: {
          bg: 'layout.surface',
          borderColor: 'layout.divider',
        },
        trigger: {
          fontWeight: 'medium',
        },
      },
      ghost: {
        item: {
          overflow: 'visible',
          bg: 'transparent',
          borderColor: 'layout.divider',
        },
        trigger: {
          px: '0',
          _hover: {
            bg: 'transparent',
            color: 'brand.main',
          },
        },
        content: {
          px: '0',
          pb: '{spacing.base}',
        },
      },
    },
  },
  defaultVariants: { appearance: 'soft' },
});
