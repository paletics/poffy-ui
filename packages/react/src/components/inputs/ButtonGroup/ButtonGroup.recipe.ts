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
            boxShadow: 'none !important',
            _hover: { zIndex: 1 },
            _focusVisible: { zIndex: 2 },
          },
          '&[data-orientation="horizontal"]': {
            '& > * + *': { marginLeft: '-2px' },
            '& > *:first-child:not(:last-child)': {
              borderTopRightRadius: '0 !important',
              borderBottomRightRadius: '0 !important',
            },
            '& > *:last-child:not(:first-child)': {
              borderTopLeftRadius: '0 !important',
              borderBottomLeftRadius: '0 !important',
            },
            '& > *:not(:first-child):not(:last-child)': {
              borderRadius: '0 !important',
            },
          },
          '&[data-orientation="vertical"]': {
            flexDirection: 'column',
            '& > * + *': { marginTop: '-2px' },
            '& > *:first-child:not(:last-child)': {
              borderBottomLeftRadius: '0 !important',
              borderBottomRightRadius: '0 !important',
            },
            '& > *:last-child:not(:first-child)': {
              borderTopLeftRadius: '0 !important',
              borderTopRightRadius: '0 !important',
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
            flex: 1,
            justifyContent: 'center',
          },
        },
      },
      false: {},
    },
  },

  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'md',
    connected: false,
    fullWidth: false,
  },
});
