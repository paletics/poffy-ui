import { defineSlotRecipe } from '@pandacss/dev';
import { overlayInternalStyles, pomeAesthetics } from '../overlay.shared';

/**
 * Slot recipe for the Popover component.
 * Defines styles for the content, trigger, close button, title, description, body, footer, and arrow.
 */
export const popoverRecipe = defineSlotRecipe({
  className: 'popover',
  description: 'Popover overlay styling for content, trigger, arrow, and semantic slots',
  slots: [
    'arrow',
    'content',
    'trigger',
    'close',
    'title',
    'description',
    'body',
    'footer',
    'header',
  ],
  base: {
    content: {
      bg: '{colors.layout.surface}',
      color: '{colors.text.primary}',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.md}',
      borderWidth: '1px',
      borderColor: '{colors.layout.divider}',
      maxWidth: '{sizes.ratio.md}',
      zIndex: 'popover',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      ...pomeAesthetics,
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
    header: {
      ...overlayInternalStyles.header,
      px: '{spacing.sm}',
      py: '{spacing.xs}',
    },
    title: {
      fontSize: 'sm',
      fontWeight: 'semibold',
      color: '{colors.text.primary}',
    },
    description: {
      fontSize: 'xs',
      color: '{colors.text.secondary}',
    },
    body: {
      ...overlayInternalStyles.body,
      px: '{spacing.sm}',
      py: '{spacing.xs}',
    },
    footer: {
      ...overlayInternalStyles.footer,
      px: '{spacing.sm}',
      py: '{spacing.xs}',
      gap: '{spacing.xs}',
    },
    close: {
      position: 'absolute',
      top: '{spacing.xs}',
      right: '{spacing.xs}',
      p: '{spacing.2xs}',
      color: '{colors.text.secondary}',
      cursor: 'pointer',
      transition: 'all {durations.fast} {easings.soft}',
      _hover: {
        color: '{colors.text.primary}',
        bg: '{colors.brand.tint}',
        borderRadius: '{radii.sm}',
      },
      _focusVisible: {
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '1px',
      },
    },
  },
  variants: {},
  defaultVariants: {},
});
