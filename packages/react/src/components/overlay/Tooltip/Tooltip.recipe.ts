import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Slot recipe for the Tooltip component.
 * Defines styles for the trigger, content, and arrow.
 */
export const tooltipRecipe = defineSlotRecipe({
  className: 'tooltip',
  description: 'Tooltip styling for trigger, content, and arrow slots',
  slots: ['trigger', 'content', 'arrow'],
  base: {
    trigger: {
      display: 'inline-block',
    },
    content: {
      bg: 'text.primary',
      color: 'text.inverse',
      px: '{spacing.sm}',
      py: '{spacing.xs}',
      borderRadius: '{radii.sm}',
      fontSize: '2xs',
      fontWeight: 'medium',
      boxShadow: '{shadows.sm}',
      maxWidth: '{sizes.ratio.sm}',
      zIndex: 'tooltip',

      _pome: {
        bg: 'brand.main',
        color: 'brand.contrast',
        borderRadius: '{radii.md}',
        boxShadow: '0 4px 12px {colors.brand.main/30}',
      },
    },
    arrow: {
      fill: 'text.primary',
      _pome: {
        fill: 'brand.main',
      },
    },
  },
  defaultVariants: {
    theme: 'dark',
  },
  variants: {
    theme: {
      dark: {},
      light: {
        content: {
          bg: 'layout.surface',
          color: 'text.primary',
          borderWidth: '1px',
          borderColor: 'layout.divider',
          boxShadow: '{shadows.xs}',
          _pome: {
            bg: 'brand.surface',
            borderColor: 'brand.main',
            color: 'brand.main',
          },
        },
        arrow: {
          fill: 'layout.surface',
          stroke: 'layout.divider',
          strokeWidth: '1px',
          _pome: {
            fill: 'brand.surface',
            stroke: 'brand.main',
          },
        },
      },
    },
  },
});
