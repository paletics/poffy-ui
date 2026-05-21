/**
 * Shared base styles for icon-only button components.
 */
export const iconButtonBaseStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  border: 'none',
  outline: 'none',
  position: 'relative',
  flexShrink: 0,
  userSelect: 'none',

  transitionProperty: 'background-color, color, box-shadow, border-color, transform',
  transitionDuration: '{durations.fast}',
  transitionTimingFunction: '{easings.soft}',

  _focusVisible: {
    outlineWidth: '{focusRing.width}',
    outlineStyle: 'solid',
    outlineColor: 'brand.main',
    outlineOffset: '{focusRing.offset}',
  },

  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
    filter: 'grayscale(0.8)',
  },
};
