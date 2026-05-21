import { baseTokens } from '@poffy-ui/system';

/**
 * Silver Ratio–derived pixel offsets for slide and translate animations.
 * Each step scales by $1:1.414$ from the previous.
 *
 * ### AI Context
 * - **Domain**: Motion / Design Tokens
 * - **Side Effects**: Pure constant
 *
 * ### AI Usage
 * - **DO**: Use `md` (22.6px) as the default translate distance for entrances and exits.
 * - **DON'T**: Hardcode pixel values — always reference this object.
 *
 * @example
 * ```ts
 * hidden: { y: motionOffsets.md }
 * ```
 */
export const motionOffsets = {
  sm: 11.3,
  md: 22.6,
  lg: 32,
} as const;

/**
 * Silver Ratio–derived scale values for zoom and interaction animations.
 *
 * ### AI Context
 * - **Domain**: Motion / Design Tokens
 * - **Side Effects**: Pure constant
 *
 * ### AI Usage
 * - **DO**: Use `hover` for interactive hover states, `press` for active/tap states.
 * - **DO**: Use `in` / `out` for zoom entrance/exit effects.
 * - **DON'T**: Use arbitrary scale values — always reference this object.
 *
 * @example
 * ```ts
 * whileHover={{ scale: motionScales.hover }}
 * whileTap={{ scale: motionScales.press }}
 * ```
 */
export const motionScales = {
  in: 0.841,
  out: 1.189,
  hover: 1.059,
  press: 0.944,
} as const;

/**
 * Named Framer Motion spring physics presets, each tuned to a specific motion "character".
 * Match the preset to the emotional intent of the interaction.
 *
 * ### AI Context
 * - **Domain**: Motion / Physics
 * - **Side Effects**: Pure constant
 *
 * ### AI Usage
 * - **DO**: `snappy` / `bouncy` → tactile feedback (buttons, toggles).
 * - **DO**: `wobbly` → living/organic elements (badges, tooltips).
 * - **DO**: `heavy` / `gentle` → structural/massive elements (modals, drawers).
 * - **DO**: `sharp` → technical/precision interactions (sliders, inputs).
 * - **DO**: `lazy` → background or decorative motion.
 * - **DON'T**: Use raw `easeOut` for spring-like interactions — always prefer a named preset.
 *
 * @example
 * ```ts
 * transition={springs.snappy}
 * transition={springs.wobbly}
 * ```
 */
export const springs = {
  snappy: { type: 'spring', stiffness: 500, damping: 25, mass: 1 },
  gentle: { type: 'spring', stiffness: 120, damping: 14, mass: 1 },
  bouncy: { type: 'spring', stiffness: 400, damping: 15, mass: 0.8 },
  heavy: { type: 'spring', stiffness: 400, damping: 35, mass: 1.2 },
  wobbly: { type: 'spring', stiffness: 600, damping: 12, mass: 0.8 },
  lazy: { type: 'spring', stiffness: 50, damping: 20, mass: 1 },
  sharp: { type: 'spring', stiffness: 1000, damping: 50, mass: 0.5 },
} as const;

/**
 * Initial state presets for overlay-style components (Popover, Drawer, Modal).
 * Defines the starting `scale` and/or `y` offset used in enter/exit animations.
 *
 * ### AI Context
 * - **Domain**: Motion / Overlay Components
 * - **Side Effects**: Pure constant
 *
 * ### AI Usage
 * - **DO**: Use `popover` for small anchored overlays (Popover, Tooltip).
 * - **DO**: Use `slide` for panel-style overlays (Drawer, Sheet).
 * - **DO**: Use `zoom` for centred overlays (Modal, Dialog).
 * - **DON'T**: Define overlay initial states inline — always reference this object.
 *
 * @example
 * ```ts
 * hidden: { scale: overlay.popover.scale, y: overlay.popover.y }
 * hidden: { scale: overlay.zoom.scale, opacity: overlay.zoom.opacity }
 * ```
 */
export const overlay = {
  popover: {
    scale: motionScales.press,
    y: motionOffsets.sm,
  },
  slide: {
    y: motionOffsets.md,
    scale: 1.0,
  },
  zoom: { scale: motionScales.in, opacity: 0 },
} as const;

/**
 * Duration-based and spring-based transition presets, sourced from `baseTokens.motion`.
 * All durations conform to the Silver Ratio ($1:1.414$) timing scale.
 *
 * ### AI Context
 * - **Domain**: Motion / Design Tokens
 * - **Side Effects**: Pure constant
 *
 * ### AI Usage
 * - **DO**: Use `base` as the default transition for most animated elements.
 * - **DO**: Use `fast` for micro-interactions (tooltips, badges).
 * - **DO**: Use `slow` for large structural transitions (page changes, hero reveals).
 * - **DO**: Use `spring.*` for physics-based interactions — see `springs` for preset selection.
 * - **DON'T**: Hardcode duration values — always reference this object.
 *
 * @example
 * ```ts
 * transition={transitions.base}
 * transition={transitions.spring.snappy}
 * ```
 */
export const transitions = {
  base: { duration: baseTokens.motion.durations.base, ease: 'easeOut' },
  fast: { duration: baseTokens.motion.durations.fast, ease: 'easeOut' },
  slow: { duration: baseTokens.motion.durations.slow, ease: 'easeOut' },
  spring: springs,
} as const;
