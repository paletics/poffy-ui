/**
 * Shared Panda recipe styles for floating dropdown/listbox content.
 */
export const dropdownContentStyles = {
  position: 'absolute',
  top: '100%',
  left: '0',
  boxSizing: 'border-box',
  width: 'min(var(--floating-reference-width, 100%), var(--floating-available-width, 100vw))',
  maxWidth: 'var(--floating-available-width, 100vw)',
  mt: '{spacing.2xs}',
  zIndex: 'popover',
  bg: 'brand.surface',
  borderRadius: 'md',
  borderWidth: '1px',
  borderColor: 'brand.border',
  boxShadow: 'md',
  maxHeight: 'min({sizes.silver.5}, var(--floating-available-height, {sizes.silver.5}))',
  overflowX: 'hidden',
  overflowY: 'auto',
  listStyle: 'none',
  p: '{spacing.2xs}',
  _hidden: {
    display: 'none',
    opacity: 0,
    pointerEvents: 'none',
  },
  '& > ul': {
    m: 0,
    p: 0,
    listStyle: 'none',
  },
  transition: 'opacity 0.2s',
  _motionSubtle: { transition: 'opacity {durations.ultraFast} {easings.soft}' },
  _motionPop: { transition: 'opacity {durations.standard} {easings.bounce}' },
};

/**
 * Shared Panda recipe styles for selectable dropdown/listbox items.
 */
export const dropdownItemStyles = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  minWidth: 0,
  overflowWrap: 'anywhere',
  px: '{spacing.sm}',
  py: '{spacing.xs}',
  borderRadius: 'sm',
  cursor: 'pointer',
  fontSize: 'sm',
  color: 'text.primary',
  transition: 'background-color 0.2s',
  _motionSubtle: { transition: 'background-color {durations.ultraFast} {easings.soft}' },
  _motionPop: { transition: 'background-color {durations.standard} {easings.bounce}' },
  _hover: {
    bg: 'brand.tint',
  },
  _highlighted: {
    bg: 'brand.tint',
  },
  _selected: {
    color: 'brand.main',
    fontWeight: 'medium',
    bg: 'brand.surface',
  },
  _disabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
};
