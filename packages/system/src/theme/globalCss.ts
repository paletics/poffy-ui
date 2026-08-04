import type { GlobalStyleObject } from '@pandacss/dev';

/**
 * Global CSS styles for the Poffy UI library.
 * These styles are applied to the entire document.
 */
export const globalCss = {
  'html, body': {
    bg: 'layout.background',
    color: 'text.primary',
    fontFamily: 'body',
    WebkitFontSmoothing: 'antialiased',
    lineHeight: '1.5',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
  },

  /**
   * Poffy UI Scrollbar styling.
   */
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },
  '::-webkit-scrollbar-track': {
    bg: 'transparent',
  },
  '::-webkit-scrollbar-thumb': {
    bg: 'brand.surface',
    borderRadius: 'full',
    '&:hover': {
      bg: 'brand.main',
    },
  },
  '.sr-only': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: '0',
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    borderWidth: '0',
  },

  /**
   * Global focus ring — brand-aware, keyboard-only via :focus-visible.
   * Component recipes can override this with their own focus styles.
   */
  '*:focus-visible': {
    outlineWidth: '{focusRing.width}',
    outlineStyle: 'solid',
    outlineColor: 'brand.main',
    outlineOffset: '{focusRing.offset}',
  },

  /**
   * AnimationProvider writes this attribute for `motionStyle="none"`, explicit
   * animation disablement, and the OS reduced-motion preference. It covers CSS
   * recipe keyframes in addition to Motion-powered primitives.
   */
  '[data-animation="disabled"]': {
    animation: 'none !important',
    transition: 'none !important',
    scrollBehavior: 'auto !important',
  },
  '@scope ([data-animation="disabled"]) to ([data-animation])': {
    '*': {
      animation: 'none !important',
      transition: 'none !important',
      scrollBehavior: 'auto !important',
    },
    '*::before, *::after': {
      animation: 'none !important',
      transition: 'none !important',
      scrollBehavior: 'auto !important',
    },
  },
  '[data-motion-scope-fallback="disabled"], [data-motion-scope-fallback="disabled"] *, [data-motion-scope-fallback="disabled"] *::before, [data-motion-scope-fallback="disabled"] *::after':
    {
      animation: 'none !important',
      transition: 'none !important',
      scrollBehavior: 'auto !important',
    },

  /**
   * Preserve the OS accessibility preference even before React hydrates or when
   * consumers use Poffy components without an AnimationProvider.
   */
  '@media (prefers-reduced-motion: reduce)': {
    '*, *::before, *::after': {
      animation: 'none !important',
      transition: 'none !important',
      scrollBehavior: 'auto !important',
    },
  },
} satisfies GlobalStyleObject;
