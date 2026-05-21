import type { Preset } from '@pandacss/dev';
import { globalCss } from './theme/globalCss';
import { keyframes } from './theme/keyframes';
import { semanticTokens } from './theme/semanticTokens';
import { textStyles } from './theme/textStyles';
import { baseTokens } from './theme/tokens';
import { tokens } from './theme/tokensConfig';

/**
 * Panda CSS preset for Poffy UI.
 * Consuming packages (react, pro, enterprise) import this preset into
 * their own panda.config.ts via `presets: [poffyPreset]`.
 *
 * ### AI Context
 * - **Domain**: Design System / Panda CSS
 * - **Side Effects**: None (pure configuration object)
 *
 * ### AI Usage
 * - **DO**: Import in panda.config.ts of any package that extends Poffy UI.
 * - **DO**: Extend `theme` via `theme.extend` in consuming packages for package-specific additions.
 * - **DON'T**: Edit tokens here directly — update `src/theme/tokens.ts` first.
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
