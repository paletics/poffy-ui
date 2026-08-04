/**
 * Shared backdrop styles for Modals and Drawers.
 */
export const overlayBackdropStyles = {
  position: 'fixed',
  inset: '0',
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
 * Uses the dynamic viewport when supported while retaining a `vh` fallback.
 */
export const fullViewportHeightStyles = {
  height: '100vh',
  '@supports (height: 100dvh)': {
    height: '100dvh',
  },
} as const;

/**
 * Caps a surface to the dynamic viewport while retaining a `vh` fallback.
 */
export const fullViewportMaxHeightStyles = {
  maxHeight: '100vh',
  '@supports (height: 100dvh)': {
    maxHeight: '100dvh',
  },
} as const;

/**
 * Leaves breathing room around a dialog and follows changes to the visual viewport.
 */
export const dialogViewportMaxHeightStyles = {
  maxHeight: '85vh',
  '@supports (height: 100dvh)': {
    maxHeight: '85dvh',
  },
} as const;

/** Safe-area variables consumed by full-screen and edge-attached overlay internals. */
export const fullOverlaySafeAreaStyles = {
  '--overlay-safe-block-start': 'env(safe-area-inset-top, 0px)',
  '--overlay-safe-block-end': 'env(safe-area-inset-bottom, 0px)',
  '--overlay-safe-inline-start': 'env(safe-area-inset-left, 0px)',
  '--overlay-safe-inline-end': 'env(safe-area-inset-right, 0px)',
  '&:dir(rtl)': {
    '--overlay-safe-inline-start': 'env(safe-area-inset-right, 0px)',
    '--overlay-safe-inline-end': 'env(safe-area-inset-left, 0px)',
  },
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
    paddingInlineStart: 'calc({spacing.md} + var(--overlay-safe-inline-start, 0px))',
    paddingInlineEnd:
      'calc({spacing.md} + {sizes.control.minimumTarget} + {spacing.sm} + var(--overlay-safe-inline-end, 0px))',
    paddingBlockStart: 'calc({spacing.sm} + var(--overlay-safe-block-start, 0px))',
    paddingBlockEnd: '{spacing.sm}',
    borderBlockEndWidth: '1px',
    borderColor: 'layout.divider',
    position: 'relative',
    minInlineSize: 0,
  },
  body: {
    paddingInlineStart: 'calc({spacing.md} + var(--overlay-safe-inline-start, 0px))',
    paddingInlineEnd: 'calc({spacing.md} + var(--overlay-safe-inline-end, 0px))',
    py: '{spacing.sm}',
    flex: '1',
    minInlineSize: 0,
    overflowY: 'auto',
    // Keep the external focus ring visible when the browser scrolls a child
    // control to either edge of an overlay body.
    scrollPaddingBlock: 'calc({focusRing.width} + {focusRing.offset})',
    overflowWrap: 'anywhere',
    color: 'text.primary',
  },
  footer: {
    paddingInlineStart: 'calc({spacing.md} + var(--overlay-safe-inline-start, 0px))',
    paddingInlineEnd: 'calc({spacing.md} + var(--overlay-safe-inline-end, 0px))',
    paddingBlockStart: '{spacing.sm}',
    paddingBlockEnd: 'calc({spacing.sm} + var(--overlay-safe-block-end, 0px))',
    borderBlockStartWidth: '1px',
    borderColor: 'layout.divider',
    display: 'flex',
    minInlineSize: 0,
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: '{spacing.sm}',
  },
} as const;

/**
 * Shared typography for overlay titles and descriptions.
 */
export const overlayTypographyStyles = {
  title: {
    minInlineSize: 0,
    overflowWrap: 'anywhere',
    fontSize: 'lg',
    fontWeight: 'semibold',
    color: 'text.primary',
  },
  description: {
    minInlineSize: 0,
    overflowWrap: 'anywhere',
    fontSize: 'sm',
    color: 'text.secondary',
    mt: '{spacing.xs}',
  },
} as const;

/**
 * Shared close button styles for overlays.
 */
export const overlayCloseButtonStyles = {
  position: 'absolute',
  insetBlockStart: 'calc({spacing.md} + var(--overlay-safe-block-start, 0px))',
  insetInlineEnd: 'calc({spacing.md} + var(--overlay-safe-inline-end, 0px))',
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minInlineSize: '{sizes.control.minimumTarget}',
  minBlockSize: '{sizes.control.minimumTarget}',
  color: 'text.secondary',
  cursor: 'pointer',
  transition: 'all {durations.fast} {easings.soft}',
  _motionSubtle: { transition: 'all {durations.ultraFast} {easings.soft}' },
  _motionPop: { transition: 'all {durations.standard} {easings.bounce}' },
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
