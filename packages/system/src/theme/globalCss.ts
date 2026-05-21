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
} satisfies GlobalStyleObject;
