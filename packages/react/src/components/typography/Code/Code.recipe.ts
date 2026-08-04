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
          overflowWrap: 'anywhere',
        },
      },
      block: {
        root: {
          width: '100%',
          maxWidth: '100%',
          minWidth: '0',
          overflow: 'auto',
          _focusVisible: {
            outline: '2px solid {colors.brand.main}',
            outlineOffset: '2px',
          },
        },
        code: {
          display: 'block',
          padding: '{spacing.lg}',
          paddingRight: '{spacing.lg}',
          backgroundColor: 'layout.surface',
          borderRadius: '{radii.sm}',
          lineHeight: 'relaxed',
          color: '{colors.text.primary}',
          '& .token.comment, & .token.prolog, & .token.doctype, & .token.cdata': {
            color: '{colors.text.secondary}',
          },
          '& .token.punctuation': {
            color: '{colors.text.secondary}',
          },
          '& .token.property, & .token.tag, & .token.boolean, & .token.number, & .token.constant, & .token.symbol, & .token.deleted':
            {
              color: {
                base: '{colors.rose.700}',
                _dark: '{colors.rose.400}',
              },
            },
          '& .token.selector, & .token.attr-name, & .token.string, & .token.char, & .token.builtin, & .token.inserted':
            {
              color: {
                base: '{colors.emerald.700}',
                _dark: '{colors.emerald.400}',
              },
            },
          '& .token.operator, & .token.entity, & .token.url, & .token.variable': {
            color: '{colors.text.primary}',
          },
          '& .token.atrule, & .token.attr-value, & .token.function, & .token.class-name': {
            color: {
              base: '{colors.yellow.700}',
              _dark: '{colors.yellow.400}',
            },
          },
          '& .token.keyword': {
            color: '{colors.brand.main}',
          },
          '& .token.regex, & .token.important': {
            color: '{colors.brand.main}',
          },
          '& .token.important, & .token.bold': {
            fontWeight: 'bold',
          },
          '& .token.italic': {
            fontStyle: 'italic',
          },
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
