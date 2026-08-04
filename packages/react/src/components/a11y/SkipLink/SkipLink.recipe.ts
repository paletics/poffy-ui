import { defineRecipe } from '@pandacss/dev';

export const skipLinkRecipe = defineRecipe({
  className: 'skip-link',
  description: 'Keyboard-visible link for bypassing repeated page content',
  base: {
    srOnly: true,
    _focusVisible: {
      bg: '{colors.brand.main}',
      borderRadius: '{radii.md}',
      boxShadow: '{shadows.lg}',
      clip: 'auto',
      color: '{colors.brand.contrast}',
      height: 'auto',
      insetBlockStart: '{spacing.sm}',
      insetInlineStart: '{spacing.sm}',
      margin: '[0]',
      outline: '2px solid',
      outlineColor: '{colors.brand.main}',
      outlineOffset: '2px',
      overflow: 'visible',
      p: '{spacing.sm}',
      position: 'fixed',
      whiteSpace: 'normal',
      width: 'auto',
      zIndex: 'modal',
    },
  },
});
