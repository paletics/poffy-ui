import { defineSlotRecipe } from '@pandacss/dev';
import {
  centeredOverlayStyles,
  dialogViewportMaxHeightStyles,
  overlayBackdropStyles,
  overlayCloseButtonStyles,
  overlayInternalStyles,
  overlayTypographyStyles,
  pomeAesthetics,
} from '../overlay.shared';

/**
 * Slot recipe for destructive or high-impact confirmation dialogs.
 */
export const alertDialogRecipe = defineSlotRecipe({
  className: 'alert-dialog',
  description: 'AlertDialog overlay styling for urgent confirmation flows',
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
      borderColor: 'layout.divider',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.lg}',
      width: '{sizes.full}',
      maxWidth: '{sizes.sm}',
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
      flexWrap: 'wrap',
      justifyContent: 'flex-end',
      gap: '{spacing.sm}',
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
    intent: {
      neutral: {
        content: {
          borderColor: 'layout.divider',
        },
      },
      danger: {
        content: {
          borderColor: '{colors.variants.danger.main}',
        },
      },
      warning: {
        content: {
          borderColor: '{colors.variants.warning.main}',
        },
      },
    },
    size: {
      sm: { content: { maxWidth: '{sizes.sm}' } },
      md: { content: { maxWidth: '{sizes.md}' } },
      lg: { content: { maxWidth: '{sizes.lg}' } },
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
    intent: 'danger',
    size: 'lg',
    scrollBehavior: 'inside',
  },
});
