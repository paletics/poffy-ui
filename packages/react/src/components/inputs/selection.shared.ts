/**
 * Shared root styles for selection controls such as Checkbox, Radio, and Switch.
 */
export const selectionBaseStyles = {
  display: 'inline-flex',
  alignItems: 'center',
  minInlineSize: 0,
  maxInlineSize: '100%',
  cursor: 'pointer',
  position: 'relative',
  _disabled: {
    cursor: 'not-allowed',
    opacity: 0.5,
  },
};

/**
 * Shared visually hidden input styles for custom selection controls.
 */
export const hiddenInputStyles = {
  srOnly: true,
};

/**
 * Shared label text styles for selection controls.
 */
export const labelStyles = {
  minInlineSize: 0,
  maxInlineSize: '100%',
  overflowWrap: 'anywhere',
  userSelect: 'none',
  color: 'text.primary',
  fontWeight: 'medium',
};

/**
 * Shared focus-ring styles driven by peer input focus state.
 */
export const peerFocusWithRing = {
  _peerFocusVisible: {
    boxShadow: '0 0 0 {focusRing.width} {colors.brand.main}',
    borderColor: 'brand.main',
  },
};
