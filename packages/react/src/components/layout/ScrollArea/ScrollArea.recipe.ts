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
      '--scroll-area-focus-clearance': 'calc({focusRing.width} + {focusRing.offset})',
      '--scroll-area-thumb-size': '6px',
    },
    viewport: {
      width: '100%',
      height: '100%',
      overflow: 'scroll',
      scrollbarWidth: 'none',
      // The viewport is the clipping boundary for arbitrary consumer content.
      // Keep external focus rings visible at its scroll edges.
      boxSizing: 'border-box',
      p: 'var(--scroll-area-focus-clearance)',
      scrollPadding: 'var(--scroll-area-focus-clearance)',
      _focusVisible: {
        outline: '2px solid',
        outlineColor: 'brand.main',
        outlineOffset: '-2px',
      },
      '&::-webkit-scrollbar': {
        display: 'none',
      },
      // Restrict scroll axis to match the orientation set on the root element.
      // Prevents unintended two-axis scrolling when only one axis is configured.
      '[data-orientation="vertical"] &': {
        overflowX: 'hidden',
        paddingInlineEnd:
          'calc(var(--scroll-area-focus-clearance) + var(--scroll-area-thumb-size))',
        scrollPaddingInlineEnd:
          'calc(var(--scroll-area-focus-clearance) + var(--scroll-area-thumb-size))',
      },
      '[data-orientation="horizontal"] &': {
        overflowY: 'hidden',
        paddingBlockEnd: 'calc(var(--scroll-area-focus-clearance) + var(--scroll-area-thumb-size))',
        scrollPaddingBlockEnd:
          'calc(var(--scroll-area-focus-clearance) + var(--scroll-area-thumb-size))',
      },
    },
    scrollbar: {
      position: 'absolute',
      display: 'flex',
      userSelect: 'none',
      touchAction: 'none',
      padding: 0,
      opacity: 0,
      pointerEvents: 'none',
      transition: 'opacity 0.2s ease',
      _motionSubtle: { transition: 'opacity {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'opacity {durations.standard} {easings.bounce}' },
      '&[data-visible]': { opacity: 1 },
      _groupHover: { opacity: 1 },
      '&[data-orientation="vertical"]': {
        insetBlock: 0,
        insetInlineEnd: 0,
        width: '{sizes.control.minimumTarget}',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'flex-end',
      },
      '&[data-orientation="horizontal"]': {
        // Thumb metrics use a normalized physical left origin in every document direction.
        direction: 'ltr',
        insetBlockEnd: 0,
        insetInlineStart: 0,
        height: '{sizes.control.minimumTarget}',
        width: '100%',
        flexDirection: 'row',
        alignItems: 'flex-end',
      },
    },
    thumb: {
      pointerEvents: 'none',
      borderRadius: '{radii.full}',
      bg: '{colors.layout.divider}',
      cursor: 'grab',
      flexShrink: 0,
      _active: { cursor: 'grabbing' },
      _hover: { bg: '{colors.text.secondary}' },
      transition: 'background-color 0.15s ease',
      _motionSubtle: { transition: 'background-color {durations.ultraFast} {easings.soft}' },
      _motionPop: { transition: 'background-color {durations.standard} {easings.bounce}' },
      position: 'relative',
      '[data-visible] &': { pointerEvents: 'auto' },
      '&::before': {
        content: '""',
        position: 'absolute',
      },
      '[data-orientation="vertical"] &': {
        width: 'var(--scroll-area-thumb-size)',
        '&::before': {
          insetBlock: 'calc((20px - {sizes.control.minimumTarget}) / 2)',
          insetInlineStart: 'calc(var(--scroll-area-thumb-size) - {sizes.control.minimumTarget})',
          insetInlineEnd: 0,
        },
      },
      '[data-orientation="horizontal"] &': {
        height: 'var(--scroll-area-thumb-size)',
        '&::before': {
          insetInline: 'calc((20px - {sizes.control.minimumTarget}) / 2)',
          insetBlockStart: 'calc(var(--scroll-area-thumb-size) - {sizes.control.minimumTarget})',
          insetBlockEnd: 0,
        },
      },
    },
  },
  variants: {
    size: {
      sm: {
        root: {
          '--scroll-area-thumb-size': '4px',
        },
      },
      md: {
        root: {
          '--scroll-area-thumb-size': '6px',
        },
      },
      lg: {
        root: {
          '--scroll-area-thumb-size': '10px',
        },
      },
    },
  },
  defaultVariants: { size: 'md' },
});
