import { defineSlotRecipe } from '@pandacss/dev';
import { overlayInternalStyles, pomeAesthetics } from '../overlay.shared';
import {
  floatingAvailableHeight,
  floatingAvailableWidth,
  floatingViewportFallbackStyles,
} from '@/components/shared/floatingViewportFallback';

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
      ...floatingViewportFallbackStyles,
      boxSizing: 'border-box',
      minWidth: 0,
      maxWidth: `min({sizes.ratio.md}, ${floatingAvailableWidth})`,
      maxHeight: floatingAvailableHeight,
      overflow: 'auto',
      zIndex: 'popover',
      outline: 'none',
      display: 'flex',
      flexDirection: 'column',
      '&:has([data-popover-close]) [data-popover-title]': {
        minInlineSize: 0,
        paddingInlineEnd: 'calc({sizes.control.minimumTarget} + {spacing.xs})',
      },
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
      fontSize: 'md',
      fontWeight: 'semibold',
      color: '{colors.text.primary}',
      overflowWrap: 'anywhere',
    },
    description: {
      fontSize: 'sm',
      color: '{colors.text.secondary}',
      overflowWrap: 'anywhere',
    },
    body: {
      ...overlayInternalStyles.body,
      minHeight: 0,
      overflowWrap: 'anywhere',
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
      insetBlockStart: '{spacing.xs}',
      insetInlineEnd: '{spacing.xs}',
      minInlineSize: '{sizes.control.minimumTarget}',
      minBlockSize: '{sizes.control.minimumTarget}',
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
  variants: {
    surface: {
      default: {
        content: {
          bg: '{colors.layout.surface}',
          color: '{colors.text.primary}',
          borderRadius: '{radii.md}',
          boxShadow: '{shadows.md}',
          borderWidth: '1px',
          borderColor: '{colors.layout.divider}',
          // Content is a public scrollport and can contain focusable children
          // directly. Reserve the complete external ring at every scroll edge.
          p: 'calc({focusRing.width} + {focusRing.offset})',
          scrollPadding: 'calc({focusRing.width} + {focusRing.offset})',
          ...pomeAesthetics,
        },
      },
      none: {
        content: {
          bg: '[transparent]',
          borderWidth: '[0]',
          borderRadius: '[0]',
          boxShadow: '[none]',
          p: 'none',
          scrollPadding: 'none',
        },
      },
    },
  },
  defaultVariants: {
    surface: 'default',
  },
});
