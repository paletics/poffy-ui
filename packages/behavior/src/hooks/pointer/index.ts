/**
 * Tracks latest viewport/client coordinates from `mousemove` on the global or supplied window.
 *
 * It deliberately does not model touch, pen, drag, or pointer-capture input.
 */
export { useMousePosition } from './useMousePosition';

/** Mouse viewport-coordinate contract. */
export type { MousePosition } from './useMousePosition.types';
