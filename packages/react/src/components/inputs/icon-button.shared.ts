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
  minWidth: '{sizes.control.minimumTarget}',
  minHeight: '{sizes.control.minimumTarget}',
  userSelect: 'none',

  transitionProperty: 'background-color, color, box-shadow, border-color, transform',
  transitionDuration: '{durations.fast}',
  transitionTimingFunction: '{easings.soft}',
  _motionSubtle: { transitionDuration: '{durations.ultraFast}' },
  _motionPop: {
    transitionDuration: '{durations.standard}',
    transitionTimingFunction: '{easings.bounce}',
  },

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
  '&[aria-disabled="true"]': {
    cursor: 'not-allowed',
    opacity: 0.5,
    filter: 'grayscale(0.8)',
    pointerEvents: 'none',
  },
};
