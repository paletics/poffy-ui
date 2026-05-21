import { defineSlotRecipe } from '@pandacss/dev';

/**
 * Styles the Scroll Area component slots with Panda CSS recipe variants.
 */
export const scrollAreaRecipe = defineSlotRecipe({
  className: 'scrollArea',
  description: 'Scroll area styling for viewport and custom scrollbar slots',
  slots: ['root', 'viewport', 'scrollbar', 'thumb'],
  base: {
    root: {
      position: 'relative',
      overflow: 'hidden',
    },
    viewport: {
      width: '100%',
      height: '100%',
      overflow: 'scroll',
      scrollbarWidth: 'none',
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      // Restrict scroll axis to match the orientation set on the root element.
      // Prevents unintended two-axis scrolling when only one axis is configured.
      '[data-orientation="vertical"] &': { overflowX: 'hidden' },
      '[data-orientation="horizontal"] &': { overflowY: 'hidden' },
    },
    scrollbar: {
      position: 'absolute',
      display: 'flex',
      userSelect: 'none',
      touchAction: 'none',
      padding: '2px',
      opacity: 0,
      transition: 'opacity 0.2s ease',
      '&[data-visible]': { opacity: 1 },
      _groupHover: { opacity: 1 },
      '&[data-orientation="vertical"]': {
        top: 0,
        right: '1px',
        width: '10px',
        height: '100%',
        flexDirection: 'column',
      },
      '&[data-orientation="horizontal"]': {
        bottom: '1px',
        left: 0,
        height: '10px',
        width: '100%',
        flexDirection: 'row',
      },
    },
    thumb: {
      borderRadius: '{radii.full}',
      bg: '{colors.layout.divider}',
      cursor: 'grab',
      flexShrink: 0,
      _active: { cursor: 'grabbing' },
      _hover: { bg: '{colors.text.secondary}' },
      transition: 'background-color 0.15s ease',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: '-4px',
      },
    },
  },
  variants: {
    size: {
      sm: {
        scrollbar: {
          padding: '1px',
          '&&[data-orientation="vertical"]': { width: '6px' },
          '&&[data-orientation="horizontal"]': { height: '6px' },
        },
      },
      md: {
        scrollbar: {
          padding: '2px',
          '&&[data-orientation="vertical"]': { width: '10px' },
          '&&[data-orientation="horizontal"]': { height: '10px' },
        },
      },
      lg: {
        scrollbar: {
          padding: '3px',
          '&&[data-orientation="vertical"]': { width: '16px' },
          '&&[data-orientation="horizontal"]': { height: '16px' },
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
});
