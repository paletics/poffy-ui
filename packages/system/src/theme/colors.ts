import type { Tokens } from '@pandacss/dev';

/**
 * Poffy UI Primitive Color Palette.
 * These are the fundamental colors used across the design system.
 * Reference these primitive values in semantic tokens.
 */
export const poffyPalette = {
  /**
   * Absolute white for contrast and overlays.
   */
  white: { value: '#FFFFFF' },

  /**
   * Absolute black for contrast and overlays.
   */
  black: { value: '#000000' },

  /**
   * Blue: The core brand color representing reliability and intelligence.
   * Semantic use: brand / variants.primary
   */
  blue: {
    50: { value: '#EFF6FF' },
    100: { value: '#DBEAFE' },
    200: { value: '#BFDBFE' },
    300: { value: '#93C5FD' },
    400: { value: '#60A5FA' }, // Dark Mode Main
    500: { value: '#3B82F6' }, // Light Mode Main
    600: { value: '#2563EB' },
    700: { value: '#1D4ED8' },
    800: { value: '#1E40AF' },
    900: { value: '#1E3A8A' },
    950: { value: '#172554' },
  },

  /**
   * Pome: An amber-orange representing playfulness and warmth.
   * Semantic use: brand alternate
   */
  pome: {
    50: { value: '#FFFBEB' },
    100: { value: '#FEF3C7' },
    200: { value: '#FDE68A' },
    300: { value: '#FCD34D' },
    400: { value: '#FBBF24' }, // Dark Mode Main
    500: { value: '#F59E0B' }, // Light Mode Main
    600: { value: '#D97706' },
    700: { value: '#B45309' },
    800: { value: '#92400E' },
    900: { value: '#78350F' },
    950: { value: '#451A03' },
  },

  /**
   * Slate: Neutral grayscale for UI skeletons, borders, and backgrounds.
   * Semantic use: text / layout / variants.secondary / light-dark neutrals
   */
  slate: {
    50: { value: '#F8FAFC' },
    100: { value: '#F1F5F9' },
    200: { value: '#E2E8F0' },
    300: { value: '#CBD5E1' },
    400: { value: '#94A3B8' }, // Dark Mode Sub Text
    500: { value: '#64748B' }, // Light Mode Sub Text
    600: { value: '#475569' },
    700: { value: '#334155' },
    800: { value: '#1E293B' },
    900: { value: '#0F172A' },
    950: { value: '#020617' },
  },

  /**
   * Zinc: Neutral grayscale for less chromatic surfaces and typography.
   * Semantic use: poffy aliases only
   */
  zinc: {
    50: { value: '#FAFAFA' },
    100: { value: '#F4F4F5' },
    200: { value: '#E4E4E7' },
    300: { value: '#D4D4D8' },
    400: { value: '#A1A1AA' },
    500: { value: '#71717A' },
    600: { value: '#52525B' },
    700: { value: '#3F3F46' },
    800: { value: '#27272A' },
    900: { value: '#18181B' },
    950: { value: '#09090B' },
  },

  /**
   * Emerald: Green shades indicating success, safety, and completion.
   * Semantic use: variants.success
   */
  emerald: {
    50: { value: '#ECFDF5' },
    100: { value: '#D1FAE5' },
    200: { value: '#A7F3D0' },
    300: { value: '#6EE7B7' },
    400: { value: '#34D399' },
    500: { value: '#10B981' },
    600: { value: '#059669' },
    700: { value: '#047857' },
    800: { value: '#065F46' },
    900: { value: '#064E3B' },
    950: { value: '#022C22' },
  },

  /**
   * Rose: Red shades for danger, errors, and high-priority actions.
   * Semantic use: variants.danger
   */
  rose: {
    50: { value: '#FFF1F2' },
    100: { value: '#FFE4E6' },
    200: { value: '#FECDD3' },
    300: { value: '#FDA4AF' },
    400: { value: '#FB7185' },
    500: { value: '#F43F5E' },
    600: { value: '#E11D48' },
    700: { value: '#BE123C' },
    800: { value: '#9F1239' },
    900: { value: '#881337' },
    950: { value: '#4C0519' },
  },

  /**
   * Cyan: Bright blue shades for info, notices, and modern aesthetics.
   * Semantic use: variants.info
   */
  cyan: {
    50: { value: '#ECFEFF' },
    100: { value: '#CFFAFE' },
    200: { value: '#A5F3FC' },
    300: { value: '#67E8F9' },
    400: { value: '#22D3EE' },
    500: { value: '#06B6D4' },
    600: { value: '#0891B2' },
    700: { value: '#0E7490' },
    800: { value: '#155E75' },
    900: { value: '#164E63' },
    950: { value: '#083344' },
  },

  /**
   * Sky: Clear and airy blue for illustration, charts, and alternate accents.
   * Semantic use: poffy aliases only
   */
  sky: {
    50: { value: '#F0F9FF' },
    100: { value: '#E0F2FE' },
    200: { value: '#BAE6FD' },
    300: { value: '#7DD3FC' },
    400: { value: '#38BDF8' },
    500: { value: '#0EA5E9' },
    600: { value: '#0284C7' },
    700: { value: '#0369A1' },
    800: { value: '#075985' },
    900: { value: '#0C4A6E' },
    950: { value: '#082F49' },
  },

  /**
   * Teal: Balanced blue-green shades for alternative positive or technical accents.
   * Semantic use: poffy aliases only
   */
  teal: {
    50: { value: '#F0FDFA' },
    100: { value: '#CCFBF1' },
    200: { value: '#99F6E4' },
    300: { value: '#5EEAD4' },
    400: { value: '#2DD4BF' },
    500: { value: '#14B8A6' },
    600: { value: '#0D9488' },
    700: { value: '#0F766E' },
    800: { value: '#115E59' },
    900: { value: '#134E4A' },
    950: { value: '#042F2E' },
  },

  /**
   * Yellow: Vibrant yellow shades for warnings and caution.
   * Semantic use: variants.warning
   */
  yellow: {
    50: { value: '#FEFCE8' },
    100: { value: '#FEF9C3' },
    200: { value: '#FEF08A' },
    300: { value: '#FDE047' },
    400: { value: '#FACC15' },
    500: { value: '#EAB308' },
    600: { value: '#CA8A04' },
    700: { value: '#A16207' },
    800: { value: '#854D0E' },
    900: { value: '#713F12' },
    950: { value: '#422006' },
  },

  /**
   * Orange: Warmer action and highlight shades adjacent to pome.
   * Semantic use: poffy aliases only
   */
  orange: {
    50: { value: '#FFF7ED' },
    100: { value: '#FFEDD5' },
    200: { value: '#FED7AA' },
    300: { value: '#FDBA74' },
    400: { value: '#FB923C' },
    500: { value: '#F97316' },
    600: { value: '#EA580C' },
    700: { value: '#C2410C' },
    800: { value: '#9A3412' },
    900: { value: '#7C2D12' },
    950: { value: '#431407' },
  },

  /**
   * Lime: Sharp yellow-green shades for playful highlights and chart accents.
   * Semantic use: poffy aliases only
   */
  lime: {
    50: { value: '#F7FEE7' },
    100: { value: '#ECFCCB' },
    200: { value: '#D9F99D' },
    300: { value: '#BEF264' },
    400: { value: '#A3E635' },
    500: { value: '#84CC16' },
    600: { value: '#65A30D' },
    700: { value: '#4D7C0F' },
    800: { value: '#3F6212' },
    900: { value: '#365314' },
    950: { value: '#1A2E05' },
  },

  /**
   * Violet: High-contrast purple shades for accentuation.
   * Semantic use: poffy aliases only
   */
  violet: {
    50: { value: '#F5F3FF' },
    100: { value: '#EDE9FE' },
    200: { value: '#DDD6FE' },
    300: { value: '#C4B5FD' },
    400: { value: '#A78BFA' },
    500: { value: '#8B5CF6' },
    600: { value: '#7C3AED' },
    700: { value: '#6D28D9' },
    800: { value: '#5B21B6' },
    900: { value: '#4C1D95' },
    950: { value: '#2E1065' },
  },

  /**
   * Indigo: Deep cool blue-purple shades for navigation and premium accents.
   * Semantic use: poffy aliases only
   */
  indigo: {
    50: { value: '#EEF2FF' },
    100: { value: '#E0E7FF' },
    200: { value: '#C7D2FE' },
    300: { value: '#A5B4FC' },
    400: { value: '#818CF8' },
    500: { value: '#6366F1' },
    600: { value: '#4F46E5' },
    700: { value: '#4338CA' },
    800: { value: '#3730A3' },
    900: { value: '#312E81' },
    950: { value: '#1E1B4B' },
  },

  /**
   * Pink: Expressive accent shades for celebratory or editorial surfaces.
   * Semantic use: poffy aliases only
   */
  pink: {
    50: { value: '#FDF2F8' },
    100: { value: '#FCE7F3' },
    200: { value: '#FBCFE8' },
    300: { value: '#F9A8D4' },
    400: { value: '#F472B6' },
    500: { value: '#EC4899' },
    600: { value: '#DB2777' },
    700: { value: '#BE185D' },
    800: { value: '#9D174D' },
    900: { value: '#831843' },
    950: { value: '#500724' },
  },
} satisfies NonNullable<Tokens['colors']>;
