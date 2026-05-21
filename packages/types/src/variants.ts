/*
 * Shared public variant vocabularies for Poffy UI components.
 *
 * This file is the source of truth for global `appearance`, `intent`, and
 * `shape` values. Individual components should expose only a subset where
 * appropriate, but those subsets should derive from the tuples defined here.
 */

/**
 * Semantic meaning variants used across action and feedback components.
 */
export const INTENTS = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'danger',
  'light',
  'dark',
] as const;

/**
 * Shared visual surface vocabulary for components that expose public
 * appearance variants.
 *
 * `solid`, `soft`, `outline`, and `ghost` are the core system appearances.
 * `minimal` is a practical dense-UI extension.
 * `neo` and `glass` are expressive brand accents.
 */
export const APPEARANCES = [
  'solid',
  'soft',
  'outline',
  'ghost',
  'minimal',
  'neo',
  'glass',
] as const;

/**
 * Shared geometry vocabulary for components whose silhouette is meaningfully
 * part of the API.
 */
export const SHAPES = ['rounded', 'pill', 'square'] as const;

/**
 * Core appearance subset appropriate for broadly reusable system surfaces.
 */
export const CORE_APPEARANCES = ['solid', 'soft', 'outline', 'ghost'] as const;

/**
 * Practical appearance extensions for dense or utility-heavy interfaces.
 */
export const PRACTICAL_APPEARANCES = ['minimal'] as const;

/**
 * Expressive appearance extensions for stronger brand-forward moments.
 */
export const EXPRESSIVE_APPEARANCES = ['neo', 'glass'] as const;

/**
 * Broad action-surface appearance subset used by flagship action components.
 */
export const ACTION_APPEARANCES = [
  'solid',
  'soft',
  'outline',
  'ghost',
  'minimal',
  'neo',
  'glass',
] as const;

/**
 * Narrow appearance subset for input-family components.
 */
export const INPUT_APPEARANCES = ['soft', 'outline'] as const;

/**
 * Narrow appearance subset for overlay-family components that expose surface tone.
 */
export const OVERLAY_APPEARANCES = ['soft', 'outline'] as const;

/**
 * Navigation surface subset for components such as tabs, pagination, or nav shells.
 */
export const NAVIGATION_APPEARANCES = ['soft', 'outline', 'ghost'] as const;

/**
 * Semantic feedback appearance subset.
 */
export const FEEDBACK_APPEARANCES = ['solid', 'soft', 'outline'] as const;

/**
 * Surface/container appearance subset.
 */
export const SURFACE_APPEARANCES = ['solid', 'soft', 'outline', 'ghost', 'glass'] as const;

/**
 * Full semantic intent set used by actions and major feedback components.
 */
export const SEMANTIC_INTENTS = INTENTS;

/**
 * Status-focused intent subset.
 */
export const STATUS_INTENTS = ['info', 'success', 'warning', 'danger'] as const;

/**
 * Neutral + emphasis intents used by many action components.
 */
export const ACTION_INTENTS = [
  'primary',
  'secondary',
  'info',
  'success',
  'warning',
  'danger',
  'light',
  'dark',
] as const;

/**
 * Smaller semantic color subset for selection controls.
 */
export const CONTROL_INTENTS = ['primary', 'secondary', 'success', 'danger'] as const;

/**
 * Broad shape subset used by action components.
 */
export const ACTION_SHAPES = ['rounded', 'pill', 'square'] as const;

/**
 * Geometric subset for icon-like or utility controls.
 */
export const CONTROL_SHAPES = ['rounded', 'square'] as const;

/** Union type of all valid intent values. */
export type Intent = (typeof INTENTS)[number];

/** Union type of all valid appearance values. */
export type Appearance = (typeof APPEARANCES)[number];

/** Union type of all valid shape values. */
export type Shape = (typeof SHAPES)[number];

/** Union type of the core appearance subset. */
export type CoreAppearance = (typeof CORE_APPEARANCES)[number];

/** Union type of the practical appearance subset. */
export type PracticalAppearance = (typeof PRACTICAL_APPEARANCES)[number];

/** Union type of the expressive appearance subset. */
export type ExpressiveAppearance = (typeof EXPRESSIVE_APPEARANCES)[number];

/** Union type of the action appearance subset. */
export type ActionAppearance = (typeof ACTION_APPEARANCES)[number];

/** Union type of the input appearance subset. */
export type InputAppearance = (typeof INPUT_APPEARANCES)[number];

/** Union type of the overlay appearance subset. */
export type OverlayAppearance = (typeof OVERLAY_APPEARANCES)[number];

/** Union type of the navigation appearance subset. */
export type NavigationAppearance = (typeof NAVIGATION_APPEARANCES)[number];

/** Union type of the feedback appearance subset. */
export type FeedbackAppearance = (typeof FEEDBACK_APPEARANCES)[number];

/** Union type of the surface appearance subset. */
export type SurfaceAppearance = (typeof SURFACE_APPEARANCES)[number];

/** Union type of the full semantic intent subset. */
export type SemanticIntent = (typeof SEMANTIC_INTENTS)[number];

/** Union type of the status intent subset. */
export type StatusIntent = (typeof STATUS_INTENTS)[number];

/** Union type of the action intent subset. */
export type ActionIntent = (typeof ACTION_INTENTS)[number];

/** Union type of the control intent subset. */
export type ControlIntent = (typeof CONTROL_INTENTS)[number];

/** Union type of the action shape subset. */
export type ActionShape = (typeof ACTION_SHAPES)[number];

/** Union type of the control shape subset. */
export type ControlShape = (typeof CONTROL_SHAPES)[number];
