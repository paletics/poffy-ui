import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Button Group component slots with Panda CSS recipe variants.
 */
export const buttonGroupRecipe = defineSlotRecipe({
  className: 'button-group',
  description: 'Button group styling for grouped button layout and spacing variants',
  slots: ['root'],

  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'stretch',
      position: 'relative',
      minWidth: '0',
    },
  },

  variants: {
    orientation: {
      horizontal: {
        root: {
          flexDirection: 'row',
        },
      },
      vertical: {
        root: {
          flexDirection: 'column',
        },
      },
    },

    spacing: {
      none: {
        root: { gap: 'none' },
      },
      sm: {
        root: { gap: '{spacing.sm}' },
      },
      md: {
        root: { gap: '{spacing.md}' },
      },
      lg: {
        root: { gap: '{spacing.base}' },
      },
    },

    connected: {
      true: {
        root: {
          gap: 0,
          '& > *': {
            position: 'relative',
            minWidth: '0',
            boxShadow: 'none !important',
            _hover: { zIndex: 1 },
            _focusVisible: { zIndex: 2 },
          },
          '&[data-orientation="horizontal"]': {
            '& > * + *': { marginInlineStart: '-2px' },
            '& > *:first-child:not(:last-child)': {
              borderStartEndRadius: '0 !important',
              borderEndEndRadius: '0 !important',
            },
            '& > *:last-child:not(:first-child)': {
              borderStartStartRadius: '0 !important',
              borderEndStartRadius: '0 !important',
            },
            '& > *:not(:first-child):not(:last-child)': {
              borderRadius: '0 !important',
            },
          },
          '&[data-orientation="vertical"]': {
            flexDirection: 'column',
            '& > * + *': { marginBlockStart: '-2px' },
            '& > *:first-child:not(:last-child)': {
              borderEndStartRadius: '0 !important',
              borderEndEndRadius: '0 !important',
            },
            '& > *:last-child:not(:first-child)': {
              borderStartStartRadius: '0 !important',
              borderStartEndRadius: '0 !important',
            },
            '& > *:not(:first-child):not(:last-child)': {
              borderRadius: '0 !important',
            },
          },
        },
      },
      false: {},
    },

    fullWidth: {
      true: {
        root: {
          display: 'flex',
          width: '100%',
          '& > *': {
            flex: '1 1 0',
            minWidth: '0',
            justifyContent: 'center',
          },
        },
      },
      false: {},
    },

    wrap: {
      true: {
        root: {
          flexWrap: 'wrap',
          maxWidth: '100%',
          '& > *': {
            flex: '0 1 auto',
            minWidth: 0,
            maxWidth: '100%',
          },
        },
      },
      false: {},
    },
  },

  compoundVariants: [
    {
      fullWidth: true,
      wrap: true,
      css: {
        root: {
          '& > *': {
            flex: '1 1 auto',
            minWidth: 0,
            maxWidth: '100%',
          },
        },
      },
    },
  ],

  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'md',
    connected: false,
    fullWidth: false,
    wrap: false,
  },
});
