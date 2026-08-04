import type { Preset } from '@pandacss/dev';
import { globalCss } from './theme/globalCss';
import { keyframes } from './theme/keyframes';
import { semanticTokens } from './theme/semanticTokens';
import { textStyles } from './theme/textStyles';
import { baseTokens } from './theme/tokens';
import { tokens } from './theme/tokensConfig';

/**
 * Panda CSS preset for packages that consume Poffy UI tokens, conditions, global styles, and theme
 * extensions. It registers brand (`pome`, `blue`, and `custom`), dark-mode, and motion conditions;
 * the custom brand conditions resolve their color values from the documented `--poffy-custom-*` CSS
 * variables. Add package-specific theme values through the consuming Panda configuration.
 */
export const poffyPreset = {
  name: '@poffy-ui/system',
  globalCss,

  conditions: {
    extend: {
      pome: `
        &[data-brand="pome"]:not([data-theme="dark"]):not(.dark),
        [data-brand="pome"]:not([data-theme="dark"]):not(.dark) &
      `
        .replace(/\s+/g, ' ')
        .trim(),
      blue: '&[data-brand="blue"], [data-brand="blue"] &',
      dark: '&[data-theme="dark"], [data-theme="dark"] &, .dark &',
      pomeDark: `
        &[data-theme="dark"][data-brand="pome"],
        &.dark[data-brand="pome"],
        [data-theme="dark"][data-brand="pome"] &,
        .dark[data-brand="pome"] &,
        [data-theme="dark"] [data-brand="pome"] &,
        .dark [data-brand="pome"] &,
        [data-brand="pome"] [data-theme="dark"] &,
        [data-brand="pome"] .dark &
      `
        .replace(/\s+/g, ' ')
        .trim(),
      custom: `
        &[data-brand="custom"]:not([data-theme="dark"]):not(.dark),
        [data-brand="custom"]:not([data-theme="dark"]):not(.dark) &
      `
        .replace(/\s+/g, ' ')
        .trim(),
      customDark: `
        &[data-theme="dark"][data-brand="custom"],
        &.dark[data-brand="custom"],
        [data-theme="dark"][data-brand="custom"] &,
        .dark[data-brand="custom"] &,
        [data-theme="dark"] [data-brand="custom"] &,
        .dark [data-brand="custom"] &,
        [data-brand="custom"] [data-theme="dark"] &,
        [data-brand="custom"] .dark &
      `
        .replace(/\s+/g, ' ')
        .trim(),
      reducedMotion: '@media (prefers-reduced-motion: reduce)',
      motionSubtle: '@scope ([data-motion-style="subtle"]) to ([data-motion-style])',
      motionPop: '@scope ([data-motion-style="pop"]) to ([data-motion-style])',
      highlighted: '&[data-highlighted], &[data-highlighted=true]',
    },
  },

  theme: {
    breakpoints: {
      sm: baseTokens.breakpoints.sm,
      md: baseTokens.breakpoints.md,
      lg: baseTokens.breakpoints.lg,
      xl: baseTokens.breakpoints.xl,
    },
    extend: {
      tokens,
      semanticTokens,
      textStyles,
      keyframes,
    },
  },
} satisfies Preset;
