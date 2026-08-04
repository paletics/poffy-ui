import { defineSlotRecipe } from '@pandacss/dev';
import { overlayInternalStyles, pomeAesthetics } from '../overlay.shared';
import {
  floatingAvailableHeight,
  floatingAvailableWidth,
  floatingViewportFallbackStyles,
} from '@/components/shared/floatingViewportFallback';

/**
 * Slot recipe for hover-triggered rich preview surfaces.
 */
export const hoverCardRecipe = defineSlotRecipe({
  className: 'hover-card',
  description: 'HoverCard styling for content, trigger, arrow, title, and description slots',
  slots: ['arrow', 'content', 'trigger', 'title', 'description'],
  base: {
    trigger: {
      display: 'inline-flex',
    },
    content: {
      ...floatingViewportFallbackStyles,
      bg: '{colors.layout.surface}',
      color: '{colors.text.primary}',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.md}',
      borderWidth: '1px',
      borderColor: '{colors.layout.divider}',
      boxSizing: 'border-box',
      minWidth: 0,
      maxWidth: `min({sizes.ratio.md}, ${floatingAvailableWidth})`,
      maxHeight: floatingAvailableHeight,
      overflowY: 'auto',
      // The content itself can be the scrollport when the preview is taller
      // than the available viewport; reserve room for external focus rings.
      scrollPaddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
      overflowWrap: 'anywhere',
      zIndex: 'popover',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      gap: '{spacing.xs}',
      px: '{spacing.sm}',
      py: '{spacing.sm}',
      ...pomeAesthetics,
    },
    title: {
      fontSize: 'md',
      fontWeight: 'semibold',
      color: '{colors.text.primary}',
    },
    description: {
      ...overlayInternalStyles.body,
      px: '0',
      // Description can become its own scrollport inside a height-constrained card.
      // Preserve the external focus ring of the first and last interactive descendant.
      py: 'calc({focusRing.width} + {focusRing.offset})',
      scrollPaddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
      fontSize: 'sm',
      color: '{colors.text.secondary}',
    },
    arrow: {
      width: '{sizes.root.1}',
      height: '{spacing.md}',
      overflow: 'visible',
      fill: '{colors.layout.surface}',
      color: '{colors.layout.surface}',
      filter: 'drop-shadow(0 1px 1px color-mix(in srgb, {colors.layout.divider} 70%, transparent))',
      ['& > path:first-of-type']: {
        fill: '{colors.layout.surface}',
        stroke: '{colors.layout.divider}',
        strokeWidth: '1px',
      },
      ['& > path:last-of-type']: {
        fill: '{colors.layout.surface}',
      },
    },
  },
  variants: {
    appearance: {
      soft: {
        content: {
          bg: '{colors.layout.surface}',
          borderColor: '{colors.layout.divider}',
        },
      },
      outline: {
        content: {
          bg: 'transparent',
          borderColor: '{colors.layout.divider}',
          boxShadow: 'none',
        },
      },
    },
    size: {
      sm: {
        content: {
          maxWidth: `min({sizes.ratio.sm}, ${floatingAvailableWidth})`,
          px: '{spacing.xs}',
          py: '{spacing.xs}',
        },
      },
      md: {
        content: {
          maxWidth: `min({sizes.ratio.md}, ${floatingAvailableWidth})`,
        },
      },
      lg: {
        content: {
          maxWidth: `min({sizes.ratio.lg}, ${floatingAvailableWidth})`,
        },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    size: 'md',
  },
});
