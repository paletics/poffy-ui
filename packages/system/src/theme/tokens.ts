/*
 * Base design tokens for the Poffy UI design system.
 * These are primitive values mapped to the theme's core properties.
 */
const motionDurations = {
  ultraFast: 0.07,
  fast: 0.212,
  base: 0.424,
  slow: 0.565,
  molasses: 1.131,
} as const;

const motionDefaultEasing = [0.25, 0.1, 0.25, 1.0] as const;

const toMs = (seconds: number) => `${Math.round(seconds * 1000)}ms`;

/**
 * Primitive token collection consumed by the system theme preset.
 */
export const baseTokens = {
  borderWidths: {
    thin: '1px',
    default: '2px',
    strong: '3px',
  },
  focusRing: {
    width: '2px',
    offset: '2px',
    insetOffset: '-2px',
    underlineWidth: '2px',
  },
  shadowOffsets: {
    sm: '4px',
    md: '6px',
    lg: '8px',
  },
  strokeWidths: {
    thin: '1px',
    default: '2px',
    strong: '3px',
  },
  radii: {
    xs: '0.125rem',
    sm: '0.25rem',
    md: '0.353rem',
    lg: '0.5rem',
    xl: '0.707rem',
    '2xl': '1rem',
    '3xl': '1.414rem',
    full: '9999px',
    none: '0px',
  },
  spacing: {
    none: '0',
    '2xs': '0.25rem',
    xs: '0.353rem',
    sm: '0.5rem',
    md: '0.707rem',
    base: '1rem',
    lg: '1.414rem',
    xl: '2rem',
    '2xl': '2.828rem',
    '3xl': '4rem',
  },
  sizes: {
    full: '100%',
    sm: '11rem',
    md: '16rem',
    lg: '22rem',
    xl: '32rem',
    ratio: {
      sm: '11rem',
      md: '16rem',
      lg: '22rem',
    },
    silver: {
      1: '1rem',
      2: '2rem',
      3: '4rem',
      4: '8rem',
      5: '16rem',
    },
    root: {
      1: '1.414rem',
      2: '2.828rem',
      3: '5.656rem',
      4: '11.312rem',
    },
  },
  fontFamilies: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  fontSizes: {
    '2xs': '0.625rem',
    xs: '0.707rem',
    sm: '0.841rem',
    md: '1rem',
    lg: '1.189rem',
    xl: '1.414rem',
    '2xl': '2rem',
    '3xl': '2.828rem',
  },
  fontWeights: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeights: {
    none: 1,
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },
  textStyles: {
    h1: { fontSize: '2.828rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 700, lineHeight: 1.3 },
    h3: { fontSize: '1.414rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.189rem', fontWeight: 600, lineHeight: 1.5 },
    h5: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.6 },
    h6: { fontSize: '0.841rem', fontWeight: 600, lineHeight: 1.6 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.841rem', fontWeight: 400, lineHeight: 1.5 },
    caption: { fontSize: '0.707rem', fontWeight: 400, lineHeight: 1.5 },
    button: { fontSize: '0.841rem', fontWeight: 600, lineHeight: 1.75, textTransform: 'none' },
  },
  breakpoints: {
    xs: '0',
    sm: '600px',
    md: '900px',
    lg: '1200px',
    xl: '1536px',
  },
  zIndex: {
    mobileStepper: 1000,
    appBar: 1100,
    drawer: 1200,
    modal: 1300,
    popover: 1350,
    snackbar: 1400,
    puff: 1500,
    tooltip: 1600,
    overlay: 1250,
  },
  blurs: {
    sm: '4px',
    md: '5.65px',
    lg: '11.3px',
    xl: '22.6px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0,0,0,0.05)',
    sm: '0 4px 6px rgba(0,0,0,0.07)',
    md: '0 10px 15px rgba(0,0,0,0.1)',
    lg: '0 20px 25px rgba(0,0,0,0.15)',
    xl: '0 25px 50px rgba(0,0,0,0.25)',
    none: 'none',
  },
  durations: {
    ultraFast: toMs(motionDurations.ultraFast),
    fast: toMs(motionDurations.fast),
    standard: toMs(motionDurations.base),
    complex: toMs(motionDurations.slow),
    slow: toMs(motionDurations.molasses),
    extraSlow: toMs(motionDurations.molasses * 2),
  },
  easings: {
    easeInOut: 'cubic-bezier(0.45, 0, 0.55, 1)',
    easeIn: 'cubic-bezier(0.3, 0, 0.7, 0)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    sharp: 'cubic-bezier(0.4, 0, 0.6, 1)',
    snappy: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
    bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    soft: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  motion: {
    durations: motionDurations,
    stagger: {
      fast: 0.042,
      base: 0.057,
      slow: 0.113,
    },
    easings: {
      default: motionDefaultEasing,
    },
    actions: {
      sink: 2,
      lift: -3,
      tapScale: 0.917,
      hoverScale: 1.09,
      squeezeScale: { x: 1.09, y: 0.917 },
      vibrantHoverScale: 1.189,
    },
  },
};
