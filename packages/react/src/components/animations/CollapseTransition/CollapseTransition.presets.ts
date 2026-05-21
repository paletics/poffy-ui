import { baseTokens } from '@poffy-ui/system';
import { motionScales, springs } from '../presets';
import { CustomData } from '../types';
import { getCustomValue } from '../utils';

/**
 * Motion variant presets for `CollapseTransition`.
 *
 * ### Notes
 * These presets are intentionally limited to open/closed region transitions.
 * Height-based presets are measured by the component, while `scale-y` avoids layout
 * measurement for lightweight menus and indicators.
 */
export const collapseVariants = {
  /** Animates block height without fading the content. */
  height: {
    initial: { height: 0, overflow: 'hidden' },
    animate: { height: 'auto', overflow: 'hidden' },
    exit: { height: 0, overflow: 'hidden' },
    transition: (custom?: CustomData) => ({
      height: {
        type: 'tween' as const,
        duration: getCustomValue(custom, 'duration', baseTokens.motion.durations.base),
        ease: baseTokens.motion.easings.default,
      },
    }),
  },

  /** Animates block height and opacity for standard disclosure panels. */
  'height-fade': {
    initial: { height: 0, opacity: 0, overflow: 'hidden' },
    animate: { height: 'auto', opacity: 1, overflow: 'hidden' },
    exit: { height: 0, opacity: 0, overflow: 'hidden' },
    transition: (custom?: CustomData) => {
      const duration = getCustomValue(custom, 'duration', baseTokens.motion.durations.base);

      return {
        height: {
          type: 'tween' as const,
          duration,
          ease: baseTokens.motion.easings.default,
        },
        opacity: {
          type: 'tween' as const,
          duration: duration * 0.75,
          ease: baseTokens.motion.easings.default,
        },
      };
    },
  },

  /** Animates vertical scale from the top edge without measuring content height. */
  'scale-y': {
    initial: { opacity: 0, scaleY: motionScales.in, transformOrigin: 'top' },
    animate: { opacity: 1, scaleY: 1, transformOrigin: 'top' },
    exit: { opacity: 0, scaleY: motionScales.in, transformOrigin: 'top' },
    transition: springs.sharp,
  },
} as const;

/**
 * Named collapse transition preset.
 */
export type CollapseTransitionType = keyof typeof collapseVariants;
