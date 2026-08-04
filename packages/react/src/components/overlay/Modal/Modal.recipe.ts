import { defineSlotRecipe } from '@pandacss/dev';
import {
  centeredOverlayStyles,
  dialogViewportMaxHeightStyles,
  fullOverlaySafeAreaStyles,
  fullViewportHeightStyles,
  fullViewportMaxHeightStyles,
  overlayBackdropStyles,
  overlayCloseButtonStyles,
  overlayInternalStyles,
  overlayTypographyStyles,
  pomeAesthetics,
} from '../overlay.shared';

/**
 * Slot recipe for the Modal component.
 * Defines styles for the overlay, content, header, title, description, body, footer, and close button.
 */
export const modalRecipe = defineSlotRecipe({
  className: 'modal',
  description: 'Modal overlay styling for content, backdrop, header, body, footer, and close slots',
  slots: ['overlay', 'content', 'header', 'title', 'description', 'body', 'footer', 'close'],
  base: {
    overlay: {
      ...overlayBackdropStyles,
      ...centeredOverlayStyles,
      p: '{spacing.sm}',
    },
    content: {
      bg: 'layout.surface',
      color: 'text.primary',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.lg}',
      width: '{sizes.full}',
      maxWidth: '{sizes.md}',
      minInlineSize: 0,
      boxSizing: 'border-box',
      ...dialogViewportMaxHeightStyles,
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      outline: 'none',
      ...pomeAesthetics,
    },
    header: overlayInternalStyles.header,
    title: overlayTypographyStyles.title,
    description: overlayTypographyStyles.description,
    body: overlayInternalStyles.body,
    footer: {
      ...overlayInternalStyles.footer,
      '&[data-align="center"]': {
        justifyContent: 'center',
        gap: '{spacing.md}',
      },
    },
    close: overlayCloseButtonStyles,
  },
  variants: {
    appearance: {
      soft: {
        content: {
          bg: 'layout.surface',
          borderColor: 'layout.divider',
        },
      },
      outline: {
        content: {
          bg: 'transparent',
          borderColor: 'layout.divider',
          boxShadow: 'none',
        },
      },
    },
    size: {
      sm: { content: { maxWidth: '{sizes.sm}' } },
      md: {
        content: { maxWidth: '{sizes.md}' },
        // A medium dialog is wide enough for the common cancel/confirm pair.
        // Keep it on one row; wrapping remains the fallback for long labels.
        footer: {
          paddingInlineStart: '{spacing.sm}',
          paddingInlineEnd: '{spacing.sm}',
          gap: '{spacing.xs}',
        },
      },
      lg: { content: { maxWidth: '{sizes.lg}' } },
      xl: { content: { maxWidth: '{sizes.xl}' } },
      full: {
        overlay: { p: '0' },
        content: {
          maxWidth: '100%',
          borderRadius: '0',
          ...fullOverlaySafeAreaStyles,
          ...fullViewportHeightStyles,
          ...fullViewportMaxHeightStyles,
        },
      },
    },
    scrollBehavior: {
      inside: {
        content: dialogViewportMaxHeightStyles,
        body: { overflowY: 'auto' },
      },
      outside: {
        content: { maxHeight: 'unset', my: '{spacing.3xl}', textAlign: 'start' },
        overlay: { overflowY: 'auto', display: 'block', py: '{spacing.3xl}', textAlign: 'center' },
      },
    },
  },
  defaultVariants: {
    appearance: 'soft',
    size: 'lg',
    scrollBehavior: 'inside',
  },
});
