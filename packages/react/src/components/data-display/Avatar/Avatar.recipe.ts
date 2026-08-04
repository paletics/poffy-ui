import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Avatar component slots with Panda CSS recipe variants.
 */
export const avatarRecipe = defineSlotRecipe({
  className: 'avatar',
  description: 'Avatar styling for root, image, and fallback slots',
  slots: ['root', 'image', 'fallback'],
  base: {
    root: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      verticalAlign: 'middle',
      overflow: 'hidden',
      userSelect: 'none',
      borderRadius: '{radii.full}',
      bg: 'brand.tint',
      _focusVisible: {
        position: 'relative',
        zIndex: 1,
        outline: '2px solid {colors.brand.main}',
        outlineOffset: '-2px',
      },
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      borderRadius: 'inherit',
      '&[data-loading]': {
        display: 'none',
      },
    },
    fallback: {
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'brand.border',
      fontSize: 'md',
      fontWeight: 'medium',
      lineHeight: 'none',
      borderRadius: 'inherit',
    },
  },
  defaultVariants: {
    size: 'md',
    shape: 'rounded',
  },
  variants: {
    size: {
      xs: {
        root: { width: '{sizes.silver.1}', height: '{sizes.silver.1}' },
        fallback: { fontSize: 'xs' },
      },
      sm: {
        root: { width: '{sizes.root.1}', height: '{sizes.root.1}' },
        fallback: { fontSize: 'xs' },
      },
      md: {
        root: { width: '{sizes.silver.2}', height: '{sizes.silver.2}' },
        fallback: { fontSize: 'md' },
      },
      lg: {
        root: { width: '{sizes.root.2}', height: '{sizes.root.2}' },
        fallback: { fontSize: 'lg' },
      },
      xl: {
        root: { width: '{sizes.silver.3}', height: '{sizes.silver.3}' },
        fallback: { fontSize: 'xl' },
      },
    },
    shape: {
      rounded: {
        root: { borderRadius: '{radii.full}' },
      },
      square: {
        root: { borderRadius: '{radii.md}' },
      },
    },
  },
});
