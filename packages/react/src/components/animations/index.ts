/**
 * Motion-based visual primitives and transition presets.
 *
 * They animate presentation only: callers continue to own interactive semantics, focus, dismissal,
 * and controlled state. `ThemeProvider` supplies `MotionProvider`, which respects the effective
 * animation preference; import `@poffy-ui/react/ssr` helpers when matching its initial document
 * attributes during server rendering.
 */
export * from './ActionMotion';
export * from './CollapseTransition';
export * from './ContentTransition';
export * from './DragMotion';
export * from './IconSwapTransition';
export * from './LayoutTransition';
export * from './ListTransition';
export * from './LoopEffect';
export * from './NumberTransition';
export * from './ReorderTransition';
export * from './RevealTransition';
export * from './SelectionTransition';
export * from './StaggerTransition';
export * from './TextRevealTransition';
export * from './OverlayTransition';
export * from './PathDrawTransition';
export * from './ViewTransition';
