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
      borderBottomWidth: '1px',
      borderColor: 'layout.divider',
      _last: { borderBottomWidth: '0' },
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
      textAlign: 'left',
      transition: 'all {durations.standard} {easings.default}',
      _hover: { bg: 'brand.surface' },
      _focusVisible: { outline: '2px solid {colors.brand.main}', zIndex: 1 },
      _disabled: { cursor: 'not-allowed', opacity: 0.5 },
    },
    indicator: {
      display: 'flex',
      flexShrink: 0,
      alignItems: 'center',
      transition: 'transform {durations.standard} {easings.snappy}',
      _open: { transform: 'rotate(180deg)' },
    },
    content: {
      width: '100%',
      minWidth: '0',
      overflow: 'hidden',
      color: 'text.secondary',
      '& > [data-accordion-content-inner]': {
        minWidth: '0',
        overflowWrap: 'anywhere',
        pb: '{spacing.base}',
      },
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
          '& > [data-accordion-content-inner]': {
            pb: '{spacing.base}',
          },
        },
      },
    },
  },
  defaultVariants: { appearance: 'soft' },
});
