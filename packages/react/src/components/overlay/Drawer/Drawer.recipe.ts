import { defineSlotRecipe } from '@pandacss/dev';
import {
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
 * Slot recipe for the Drawer component.
 * Defines styles for the overlay, content, header, title, description, body, footer, and close button.
 *
 * ### Variant Logic
 * `size` variants set `width` by default (correct for left/right placement).
 * `compoundVariants` override to restore `width: 100%` and apply `height` instead
 * for top/bottom placements, preventing the size variant from clobbering the full-width layout.
 */
export const drawerRecipe = defineSlotRecipe({
  className: 'drawer',
  description: 'Drawer overlay styling for placement-aware content, backdrop, and semantic slots',
  slots: ['overlay', 'content', 'header', 'title', 'description', 'body', 'footer', 'close'],
  base: {
    overlay: {
      ...overlayBackdropStyles,
      backdropFilter: 'blur(4px)',
    },
    content: {
      bg: 'layout.surface',
      color: 'text.primary',
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: 'transparent',
      boxShadow: '{shadows.lg}',
      display: 'flex',
      flexDirection: 'column',
      boxSizing: 'border-box',
      minInlineSize: 0,
      position: 'fixed',
      zIndex: 'modal',
      outline: 'none',
      ...pomeAesthetics,
    },
    header: overlayInternalStyles.header,
    title: overlayTypographyStyles.title,
    description: overlayTypographyStyles.description,
    body: overlayInternalStyles.body,
    footer: overlayInternalStyles.footer,
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
    placement: {
      left: {
        content: {
          top: '0',
          bottom: '0',
          left: '0',
          maxWidth: '100%',
          '--overlay-safe-block-start': 'env(safe-area-inset-top, 0px)',
          '--overlay-safe-block-end': 'env(safe-area-inset-bottom, 0px)',
          '--overlay-safe-inline-start': 'env(safe-area-inset-left, 0px)',
          '&:dir(rtl)': {
            '--overlay-safe-inline-start': '0px',
            '--overlay-safe-inline-end': 'env(safe-area-inset-left, 0px)',
          },
          ...fullViewportHeightStyles,
          borderRadius: '0',
        },
      },
      right: {
        content: {
          top: '0',
          bottom: '0',
          right: '0',
          maxWidth: '100%',
          '--overlay-safe-block-start': 'env(safe-area-inset-top, 0px)',
          '--overlay-safe-block-end': 'env(safe-area-inset-bottom, 0px)',
          '--overlay-safe-inline-end': 'env(safe-area-inset-right, 0px)',
          '&:dir(rtl)': {
            '--overlay-safe-inline-start': 'env(safe-area-inset-right, 0px)',
            '--overlay-safe-inline-end': '0px',
          },
          ...fullViewportHeightStyles,
          borderRadius: '0',
        },
      },
      start: {
        content: {
          insetBlockStart: '0',
          insetBlockEnd: '0',
          insetInlineStart: '0',
          maxWidth: '100%',
          '--overlay-safe-block-start': 'env(safe-area-inset-top, 0px)',
          '--overlay-safe-block-end': 'env(safe-area-inset-bottom, 0px)',
          '--overlay-safe-inline-start': 'env(safe-area-inset-left, 0px)',
          '&:dir(rtl)': {
            '--overlay-safe-inline-start': 'env(safe-area-inset-right, 0px)',
          },
          ...fullViewportHeightStyles,
          borderRadius: '0',
        },
      },
      end: {
        content: {
          insetBlockStart: '0',
          insetBlockEnd: '0',
          insetInlineEnd: '0',
          maxWidth: '100%',
          '--overlay-safe-block-start': 'env(safe-area-inset-top, 0px)',
          '--overlay-safe-block-end': 'env(safe-area-inset-bottom, 0px)',
          '--overlay-safe-inline-end': 'env(safe-area-inset-right, 0px)',
          '&:dir(rtl)': {
            '--overlay-safe-inline-end': 'env(safe-area-inset-left, 0px)',
          },
          ...fullViewportHeightStyles,
          borderRadius: '0',
        },
      },
      top: {
        content: {
          top: '0',
          left: '0',
          right: '0',
          width: '100%',
          '--overlay-safe-block-start': 'env(safe-area-inset-top, 0px)',
          '--overlay-safe-inline-start': 'env(safe-area-inset-left, 0px)',
          '--overlay-safe-inline-end': 'env(safe-area-inset-right, 0px)',
          '&:dir(rtl)': {
            '--overlay-safe-inline-start': 'env(safe-area-inset-right, 0px)',
            '--overlay-safe-inline-end': 'env(safe-area-inset-left, 0px)',
          },
          ...fullViewportMaxHeightStyles,
          borderRadius: '0',
        },
      },
      bottom: {
        content: {
          bottom: '0',
          left: '0',
          right: '0',
          width: '100%',
          '--overlay-safe-block-end': 'env(safe-area-inset-bottom, 0px)',
          '--overlay-safe-inline-start': 'env(safe-area-inset-left, 0px)',
          '--overlay-safe-inline-end': 'env(safe-area-inset-right, 0px)',
          '&:dir(rtl)': {
            '--overlay-safe-inline-start': 'env(safe-area-inset-right, 0px)',
            '--overlay-safe-inline-end': 'env(safe-area-inset-left, 0px)',
          },
          ...fullViewportMaxHeightStyles,
          borderRadius: '0',
        },
      },
    },
    size: {
      sm: { content: { width: '{sizes.sm}' } },
      md: { content: { width: '{sizes.md}' } },
      lg: { content: { width: '{sizes.lg}' } },
      xl: { content: { width: '{sizes.xl}' } },
      full: {
        content: {
          width: '100%',
          ...fullOverlaySafeAreaStyles,
          ...fullViewportHeightStyles,
        },
      },
    },
  },
  compoundVariants: [
    // top/bottom: size controls height while remaining bounded by the visual viewport.
    { placement: 'top', size: 'sm', css: { content: { width: '100%', height: '{sizes.sm}' } } },
    { placement: 'top', size: 'md', css: { content: { width: '100%', height: '{sizes.md}' } } },
    { placement: 'top', size: 'lg', css: { content: { width: '100%', height: '{sizes.lg}' } } },
    { placement: 'top', size: 'xl', css: { content: { width: '100%', height: '{sizes.xl}' } } },
    {
      placement: 'top',
      size: 'full',
      css: { content: { width: '100%', ...fullViewportHeightStyles } },
    },
    { placement: 'bottom', size: 'sm', css: { content: { width: '100%', height: '{sizes.sm}' } } },
    { placement: 'bottom', size: 'md', css: { content: { width: '100%', height: '{sizes.md}' } } },
    { placement: 'bottom', size: 'lg', css: { content: { width: '100%', height: '{sizes.lg}' } } },
    { placement: 'bottom', size: 'xl', css: { content: { width: '100%', height: '{sizes.xl}' } } },
    {
      placement: 'bottom',
      size: 'full',
      css: { content: { width: '100%', ...fullViewportHeightStyles } },
    },
  ],
  defaultVariants: {
    appearance: 'soft',
    placement: 'right',
    size: 'md',
  },
});
