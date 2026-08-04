import { springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

export const layoutVariants = {
  /**
   * Reorder: Smooth transitions for elements changing position in a list.
   */
  reorder: {
    transition: (custom?: CustomData) => ({
      ...springs.bouncy,
      type: 'spring' as const,
      stiffness: getCustomValue(custom, 'stiffness', 300),
      damping: getCustomValue(custom, 'damping', 25),
    }),
  },

  /**
   * Accordion: Expansion and contraction animations for dynamic content height.
   */
  accordion: {
    transition: (custom?: CustomData) => ({
      type: 'spring' as const,
      stiffness: getCustomValue(custom, 'stiffness', 250),
      damping: getCustomValue(custom, 'damping', 20),
      mass: getCustomValue(custom, 'mass', 1),
      velocity: 2,
    }),
  },

  /**
   * Translate: Fast position-only movement without scale distortion.
   * Recommended for text or elements where size should remain constant.
   */
  translate: {
    transition: { ...springs.snappy, type: 'spring' as const },
  },

  /**
   * Switch: Quick feedback for UI toggles and indicators.
   */
  switch: {
    transition: { ...springs.sharp, type: 'spring' as const },
  },

  /**
   * Morph: Transition for shared layout elements (layoutId) between different states.
   */
  morph: {
    transition: (custom?: CustomData) => ({
      type: 'spring' as const,
      stiffness: getCustomValue(custom, 'stiffness', 350),
      damping: getCustomValue(custom, 'damping', 30),
      mass: 1,
    }),
  },

  /**
   * Elastic: Rubber-band effect for high-attention layout changes.
   */
  elastic: {
    transition: (custom?: CustomData) => ({
      type: 'spring' as const,
      stiffness: getCustomValue(custom, 'stiffness', 300),
      damping: getCustomValue(custom, 'damping', 15),
      mass: 1.2,
    }),
  },

  /**
   * Stable: Rigid transitions without oscillation.
   * Best for content that must remain legible during the transition.
   */
  stable: {
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 40,
    },
  },

  /**
   * Pop: Playful but contained layout movement for small active indicators.
   * Mirrors the bouncy action preset without scaling large interactive surfaces.
   */
  pop: {
    transition: {
      ...springs.bouncy,
      type: 'spring' as const,
    },
  },
} as const;

/**
 * Named layout transition preset.
 */
export type LayoutTransitionType = keyof typeof layoutVariants;
