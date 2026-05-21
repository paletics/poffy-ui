/**
 * Shared backdrop styles for Modals and Drawers.
 */
export const overlayBackdropStyles = {
  position: 'fixed',
  top: 'none',
  right: 'none',
  bottom: 'none',
  left: 'none',
  bg: 'layout.overlay',
  backdropBlur: 'sm',
  zIndex: 'overlay',
} as const;

/**
 * Centering utilities for overlays like Modals.
 */
export const centeredOverlayStyles = {
  display: 'grid',
  placeItems: 'center',
} as const;

/**
 * Shared aesthetic fragments for the "Pome" design intent.
 */
export const pomeAesthetics = {
  _pome: {
    borderRadius: 'lg',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'brand.main',
    boxShadow: '0 {shadowOffsets.lg} 32px {colors.brand.main/20}',
  },
  _pomeDark: {
    borderRadius: 'lg',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: 'brand.main',
    boxShadow: '0 {shadowOffsets.lg} 32px {colors.black/40}',
  },
} as const;

/**
 * Shared styles for internal overlay sections (Header, Body, Footer).
 */
export const overlayInternalStyles = {
  header: {
    px: '{spacing.md}',
    py: '{spacing.sm}',
    borderBottomWidth: '1px',
    borderColor: 'layout.divider',
    position: 'relative',
  },
  body: {
    px: '{spacing.md}',
    py: '{spacing.sm}',
    flex: '1',
    overflowY: 'auto',
    color: 'text.primary',
  },
  footer: {
    px: '{spacing.md}',
    py: '{spacing.sm}',
    borderTopWidth: '1px',
    borderColor: 'layout.divider',
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '{spacing.sm}',
  },
} as const;

/**
 * Shared typography for overlay titles and descriptions.
 */
export const overlayTypographyStyles = {
  title: {
    fontSize: 'lg',
    fontWeight: 'semibold',
    color: 'text.primary',
  },
  description: {
    fontSize: 'xs',
    color: 'text.secondary',
    mt: '{spacing.xs}',
  },
} as const;

/**
 * Shared close button styles for overlays.
 */
export const overlayCloseButtonStyles = {
  position: 'absolute',
  top: '{spacing.md}',
  right: '{spacing.md}',
  color: 'text.secondary',
  cursor: 'pointer',
  transition: 'all {durations.fast} {easings.soft}',
  _hover: {
    color: 'text.primary',
  },
  _focusVisible: {
    outlineWidth: '{focusRing.width}',
    outlineStyle: 'solid',
    outlineColor: '{colors.brand.main}',
    outlineOffset: '{focusRing.offset}',
  },
} as const;
