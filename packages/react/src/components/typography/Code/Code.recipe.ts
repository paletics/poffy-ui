import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Code component slots with Panda CSS recipe variants.
 */
export const codeRecipe = defineSlotRecipe({
  className: 'code',
  description: 'Code component with inline and block variants',
  slots: ['root', 'code'],
  base: {
    root: {
      position: 'relative',
    },
    code: {
      fontFamily: 'mono',
      fontSize: 'sm',
    },
  },
  variants: {
    variant: {
      inline: {
        code: {
          backgroundColor: 'layout.surface',
          padding: '0.2em 0.4em',
          borderRadius: '{radii.xs}',
          color: 'brand.main',
        },
      },
      block: {
        root: {
          maxWidth: '100%',
          overflow: 'auto',
        },
        code: {
          display: 'block',
          padding: '{spacing.lg}',
          paddingRight: '{spacing.lg}',
          backgroundColor: 'layout.surface',
          borderRadius: '{radii.sm}',
          overflow: 'auto',
          lineHeight: 'relaxed',
          color: 'text.primary',
        },
      },
    },
    colorScheme: {
      light: {
        code: {
          backgroundColor: 'layout.surface',
          color: 'text.primary',
        },
      },
      dark: {
        code: {
          backgroundColor: 'layout.background',
          color: 'text.primary',
        },
      },
    },
  },
  defaultVariants: {
    variant: 'inline',
    colorScheme: 'light',
  },
});
