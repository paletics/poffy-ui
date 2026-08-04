/**
 * CSS fallbacks used before Floating UI publishes its measured available size.
 *
 * The measured `--floating-available-*` variables remain authoritative, including
 * when Floating UI deliberately publishes `0px`. Components with different
 * collision padding can override `--floating-fallback-padding` after spreading
 * this fragment.
 */
export const floatingViewportFallbackStyles = {
  // Prevent a nested floating surface from consuming an ancestor's measured size.
  // Floating UI's inline declarations override these local resets after measurement.
  '--floating-available-width': 'initial',
  '--floating-available-height': 'initial',
  '--floating-fallback-padding': '8px',
  '--floating-fallback-width':
    'max(0px, calc(100vw - var(--floating-fallback-padding) - var(--floating-fallback-padding)))',
  '--floating-fallback-height':
    'max(0px, calc(100vh - var(--floating-fallback-padding) - var(--floating-fallback-padding)))',
  '@supports (width: 100dvw)': {
    '--floating-fallback-width':
      'max(0px, calc(100dvw - var(--floating-fallback-padding) - var(--floating-fallback-padding)))',
  },
  '@supports (height: 100dvh)': {
    '--floating-fallback-height':
      'max(0px, calc(100dvh - var(--floating-fallback-padding) - var(--floating-fallback-padding)))',
  },
} as const;

export const floatingAvailableWidth =
  'var(--floating-available-width, var(--floating-fallback-width))';

export const floatingAvailableHeight =
  'var(--floating-available-height, var(--floating-fallback-height))';
